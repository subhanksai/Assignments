// const Rule = require("../models/Rule"); // Adjust the path based on your project structure
// const CombinedRule = require("../models/CombinedRule"); // Import the CombinedRule model
const evaluateRule = require("../utils/evaluate");

// Function to create an AST node
function createNode(type, left = null, right = null, value = null) {
  return { type, left, right, value };
}

// Function to parse a rule string into an AST
function parseRuleString(ruleString) {
  const tokens = ruleString
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(" ")
    .filter(Boolean);

  const stack = [];
  let currentNode = null;

  tokens.forEach((token) => {
    if (token === "(") {
      stack.push(currentNode);
      currentNode = null;
    } else if (token === ")") {
      const previousNode = stack.pop();
      if (previousNode) {
        previousNode.right = currentNode;
        currentNode = previousNode;
      }
    } else if (["AND", "OR"].includes(token)) {
      const newNode = createNode("operator", currentNode, null, token);
      if (currentNode) {
        // If the current node is an operator, set the right child
        newNode.left = currentNode;
      }
      currentNode = newNode;
    } else if (["<", ">", "=", ">=", "<=", "=="].includes(token)) {
      const newNode = createNode("comparison", currentNode, null, token);
      if (currentNode) {
        newNode.left = currentNode; // Set the left child to the current node
      }
      currentNode = newNode;
    } else {
      const operand = createNode("operand", null, null, token);
      if (currentNode && currentNode.type === "comparison") {
        // If the current node is a comparison, set the right operand
        currentNode.right = operand;
      } else {
        // If current node is an operator, link it correctly
        if (currentNode && currentNode.type === "operator") {
          if (!currentNode.right) {
            currentNode.right = operand;
          } else {
            const newOperator = createNode(
              "operator",
              currentNode,
              operand,
              currentNode.value
            );
            currentNode = newOperator;
          }
        } else {
          currentNode = operand; // Initialize the current node with operand
        }
      }
    }
  });

  return currentNode;
}

// Controller function to create or update a rule
async function createOrUpdateRule(req, res) {
  const { ruleString, ruleId } = req.body;

  if (!ruleString) {
    return res.status(400).json({ message: "Rule string is required" });
  }

  const ast = parseRuleString(ruleString);
  return ast;
}

// Controller function to evaluate a rule by its ID
// exports.evaluateRuleById = async (req, res) => {
//   const { ruleId, data } = req.body;
// };

// Export the functions
module.exports = createOrUpdateRule;
