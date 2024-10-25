const { Engine, Rule } = require("json-rules-engine");

// Utility function to parse a single condition
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
  const rule = new Rule({
    conditions: {
      all: allConditions,
    },
    event: {
      type: "promotion",
      params: {
        message: "Promotion criteria met!",
      },
    },
  });

  return rule;
}

// Define the engine and add the rule
const engine = new Engine();

// Parse the input expression to create a rule
const rule = createRulesFromExpression(
  "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"
);

// Add the generated rule to the engine
engine.addRule(rule);

// Define the facts
const facts = {
  age: 35,
  department: "Marketing",
  salary: 2000,
  experience: 9,
};

// Run the engine
engine
  .run(facts)
  .then(({ events }) => {
    if (events.length > 0) {
      console.log(events[0].params.message); // Output: Promotion criteria met!
    } else {
      console.log("No rules matched");
    }
  })
  .catch(console.log);
