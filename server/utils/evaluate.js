function evaluate(root, data) {
  if (!root) return null;

  // Handle the case for operand nodes
  if (root.type === "operand") {
    const operandValue = root.value;

    // Look up the operand in the data object
    if (typeof operandValue === "string" && operandValue in data) {
      return data[operandValue];
    } else {
      return operandValue; // Return the value directly if it's not found
    }
  }

  // Handle the case for operator nodes
  if (root.type === "operator") {
    const operatorToken = root.value;

    const leftValue = evaluate(root.left, data);
    const rightValue = evaluate(root.right, data);

    // Handle logical operators
    if (operatorToken === "AND") {
      return leftValue && rightValue;
    } else if (operatorToken === "OR") {
      return leftValue || rightValue;
    }
  }

  // Handle the case for comparison nodes
  if (root.type === "comparison") {
    const leftOperand = evaluate(root.left, data);
    const rightOperand = evaluate(root.right, data);

    switch (root.value) {
      case "<":
        return leftOperand < rightOperand;
      case ">":
        return leftOperand > rightOperand;
      case "=":
        return leftOperand === rightOperand;
      case ">=":
        return leftOperand >= rightOperand;
      case "<=":
        return leftOperand <= rightOperand;
      case "==":
        return leftOperand == rightOperand; // Use strict equality if needed
      case "!=":
        return leftOperand != rightOperand; // Use strict inequality if needed
    }
  }

  return null; // If none of the conditions match, return null
}

// // Example Usage
// const data = {
//   age: 49,
//   department: 'Marketing',
//   salary: 345673,
//   experience: 8
// };

// const rootNode = {
//   type: 'operator',
//   value: 'AND',
//   left: {
//     type: 'operator',
//     value: 'AND',
//     left: {
//       type: 'comparison',
//       left: { type: 'operand', value: 'age' },
//       right: { type: 'operand', value: 30 },
//       value: '>'
//     },
//     right: {
//       type: 'comparison',
//       left: { type: 'operand', value: 'department' },
//       right: { type: 'operand', value: 'Marketing' },
//       value: '='
//     }
//   },
//   right: {
//     type: 'operator',
//     value: 'OR',
//     left: {
//       type: 'comparison',
//       left: { type: 'operand', value: 'salary' },
//       right: { type: 'operand', value: 20000 },
//       value: '>'
//     },
//     right: {
//       type: 'comparison',
//       left: { type: 'operand', value: 'experience' },
//       right: { type: 'operand', value: 5 },
//       value: '>'
//     }
//   }
// };

// // Evaluate the rule
// const result = evaluate(rootNode, data);
// console.log(result); // Should output true or false based on the evaluation.

module.exports = evaluate;
