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
        if (previousNode.type === "operator" && !previousNode.right) {
          previousNode.right = currentNode;
        } else {
          currentNode = createNode("operand", null, null, currentNode);
          previousNode.right = currentNode;
        }
        currentNode = previousNode;
      }
    } else if (["AND", "OR"].includes(token)) {
      const newNode = createNode("operator", currentNode, null, token);
      currentNode = newNode;
    } else if (["<", ">", "=", ">=", "<=", "=="].includes(token)) {
      const comparisonNode = createNode("comparison", currentNode, null, token);
      currentNode = comparisonNode;
    } else {
      const isNumber = !isNaN(token);
      const value = isNumber ? parseFloat(token) : token.replace(/'/g, "");

      const operand = createNode("operand", null, null, value);
      if (currentNode && currentNode.type === "comparison") {
        currentNode.right = operand;
      } else if (currentNode && currentNode.type === "operator") {
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
        currentNode = operand;
      }
    }
  });

  return currentNode;
}

ruleString =
  "( age > 30 AND department = 'Sales' ) AND ( salary > 3000 OR experience > 1 )";

rule = parseRuleString(ruleString);

console.log("Parsed Rule Object:", JSON.stringify(rule, null, 2));
