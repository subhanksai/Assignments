const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the CORS middleware
const { Engine } = require("json-rules-engine");
const rule = require("../server/models/Rule");

/**
 * Setup a new engine
 */

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Use CORS middleware
app.use(cors());
const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Set default logging level
  format: winston.format.json(), // Format logs as JSON
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log error level messages to error.log
    new winston.transports.File({ filename: "combined.log" }), // Log all messages to combined.log
  ],
});

const rulesMap = {};

mongoose
  .connect(
    "mongodb+srv://admin:admin@backend.3fn3q.mongodb.net/WeatherApp?retryWrites=true&w=majority&appName=BackEnd"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

function parseCondition(condition) {
  const [fact, operator, value] = condition.trim().split(/\s+/);

  let formattedOperator;
  switch (operator) {
    case ">":
      formattedOperator = "greaterThan";
      break;
    case "<":
      formattedOperator = "lessThan";
      break;
    case "=":
      formattedOperator = "equal";
      break;
    // Add other operator conversions if needed
    default:
      throw new Error("Unsupported operator: " + operator);
  }

  // Handle the case where value is a string (e.g., 'Marketing')
  const parsedValue = isNaN(value)
    ? value.replace(/['"]+/g, "")
    : Number(value);

  return {
    fact: fact.replace(/[()]+/g, ""), // Clean parentheses from fact name
    operator: formattedOperator,
    value: parsedValue,
  };
}

// Function to convert a logical expression to a rule
function createRulesFromExpression(expression) {
  // Clean expression from excess parentheses and extra spaces
  expression = expression.replace(/[()]+/g, "").trim();

  const allConditions = [];

  // Splitting by AND at the top level
  const andGroups = expression.split(/\s+AND\s+/i);

  andGroups.forEach((andGroup) => {
    const groupConditions = [];

    // Splitting by OR within each AND group
    const orConditions = andGroup.split(/\s+OR\s+/i);

    orConditions.forEach((orCondition) => {
      const match = orCondition.match(/\((.*)\)/);
      if (match) {
        const innerCondition = match[1];
        const innerParts = innerCondition
          .split(/\s+AND\s+/i)
          .map((c) => parseCondition(c));
        groupConditions.push({
          all: innerParts,
        });
      } else {
        groupConditions.push(parseCondition(orCondition));
      }
    });

    if (groupConditions.length > 1) {
      allConditions.push({
        any: groupConditions,
      });
    } else {
      allConditions.push({
        all: groupConditions,
      });
    }
  });

  // Constructing the final rule object
  const rule = {
    conditions: {
      all: allConditions,
    },
    event: {
      type: "promotion",
      params: {
        message: "Promotion criteria met!",
      },
    },
  };

  return rule;
}

app.post("/create", async (req, res) => {
  logger.info("Received request:", req.body);

  try {
    const { ruleString, ruleId } = req.body;
    console.log(ruleString, ruleId);

    // Validate inputs
    if (!ruleString || !ruleId) {
      return res.status(400).json({ message: "Missing ruleString or ruleId" });
    }

    // Check for existing rule ID
    if (rulesMap[ruleId]) {
      logger.warn(`Attempt to create a rule with an existing ID: ${ruleId}`);
      return res.status(400).json({ message: "Rule ID already exists" });
    }

    // Convert the rule string to a rule object dynamically
    const rule = createRulesFromExpression(ruleString);

    // Add the rule to the rules map
    rulesMap[ruleId] = rule;

    logger.info("Rule created successfully:", rule);
    res.status(201).json({ message: "Rule created", rule });
  } catch (error) {
    logger.error("Error creating rule:", error); // Log error
    res
      .status(500)
      .json({ message: "Error creating rule", error: error.message });
  }
});

/**
 * Validate that the rule has the correct structure.
 * @param {Object} rule - The rule to validate.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
function isValidRule(rule) {
  const validateCondition = (condition) => {
    if (condition.all) {
      return condition.all.every(validateCondition);
    }
    if (condition.any) {
      return condition.any.every(validateCondition);
    }
    return (
      condition.fact && condition.operator && condition.value !== undefined
    );
  };

  return validateCondition(rule.conditions);
}

/**
 * Evaluate rules against facts and log the results.
 * @param {Object} rule - The rule to evaluate.
 * @param {Object} facts - The facts to evaluate against.
 */
async function evaluateRules(rule, facts) {
  // Validate the rule structure
  if (!isValidRule(rule)) {
    throw new Error(
      "Invalid rule structure: Missing 'fact' property in conditions."
    );
  }

  // Create an engine instance
  const engine = new Engine();

  // Add the rule to the engine
  engine.addRule(rule);

  // Evaluate the rules against the facts
  try {
    const { events } = await engine.run(facts);

    // Log triggered events
    events.forEach((event) => {
      console.log("Event triggered:", event.params.message);
    });

    // Return whether any events were triggered
    return events.length > 0;
  } catch (err) {
    console.error("Error evaluating rules:", err);
    throw err; // Rethrow the error to handle it in the route
  }
}

// Endpoint to evaluate a rule
app.post("/evaluate", async (req, res) => {
  try {
    const { ruleId, data } = req.body;
    console.log(ruleId, data);

    if (!ruleId || !data) {
      return res.status(400).json({ message: "Missing ruleId or data" });
    }

    // Retrieve the rule from the rulesMap using the ruleId
    const rule = rulesMap[ruleId];
    console.log(rule);

    if (!rule) {
      return res
        .status(404)
        .json({ message: `Rule with ID ${ruleId} not found` });
    }

    // Perform evaluation using evaluateRules
    const result = await evaluateRules(rule, data);

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error evaluating rule:", error);
    res
      .status(500)
      .json({ message: "Error evaluating rule", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
