function parseRuleString(ruleString) {
  // Remove spaces and normalize operators
  const normalizedRuleString = ruleString
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/AND/g, "&&")
    .replace(/OR/g, "||")
    .replace(/([><=]+)/g, " $1 ") // Add spaces around operators
    .trim();

  const conditions = parseConditions(normalizedRuleString);
  const rule = {
    conditions: conditions,
    event: {
      type: "rule-matched",
      params: {
        message: "Rule conditions met: User is eligible.",
      },
    },
  };

  return rule;
}

function parseConditions(ruleString) {
  // Handle logical operations and grouping
  const conditionGroups = [];
  let currentGroup = { all: [] };
  const stack = [currentGroup];

  // Split the rule string into tokens
  const tokens = ruleString.match(/(?:\([^\)]+\)|\S+)/g);
  tokens.forEach((token) => {
    if (token === "&&") {
      // Move to the next group
      if (currentGroup.all.length > 0) {
        conditionGroups.push(currentGroup);
      }
      currentGroup = { all: [] };
      stack.push(currentGroup);
    } else if (token === "||") {
      // Move to the "any" group
      if (currentGroup.all.length > 0) {
        conditionGroups.push(currentGroup);
      }
      currentGroup = { any: [] };
      stack.push(currentGroup);
    } else if (token === "(") {
      // Start a new nested group
      const nestedGroup = { all: [] };
      currentGroup.all.push(nestedGroup);
      stack.push(nestedGroup);
      currentGroup = nestedGroup;
    } else if (token === ")") {
      // Close the current group
      stack.pop();
      currentGroup = stack[stack.length - 1];
    } else {
      // Parse individual conditions
      const condition = parseCondition(token);
      currentGroup.all.push(condition);
    }
  });

  // If there's still a current group, add it
  if (currentGroup.all.length > 0) {
    conditionGroups.push(currentGroup);
  }

  // Combine conditions into a single object
  const combinedConditions = {
    all: conditionGroups.map((group) => {
      if (group.any) {
        return { any: group.any };
      }
      return { all: group.all };
    }),
  };

  return combinedConditions;
}

function parseCondition(conditionString) {
  const [left, operator, right] = conditionString.split(/\s+(?=[><=])/);

  const parsedCondition = {
    fact: left.trim(),
    operator: mapOperator(operator.trim()),
    value: parseValue(right.trim()),
  };

  return parsedCondition;
}

function mapOperator(operator) {
  switch (operator) {
    case ">":
      return "greaterThan";
    case "<":
      return "lessThan";
    case "=":
    case "==":
      return "equal";
    case ">=":
      return "greaterThanInclusive";
    case "<=":
      return "lessThanInclusive";
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function parseValue(value) {
  if (value.startsWith("'") && value.endsWith("'")) {
    // Remove quotes for strings
    return value.slice(1, -1);
  } else {
    // Convert to number if possible
    const numValue = Number(value);
    return isNaN(numValue) ? value : numValue;
  }
}

ruleString =
  "( age > 30 AND department = 'Sales' ) AND ( salary > 3000 OR experience > 1 )";

rule = parseRuleString(ruleString);

console.log("Parsed Rule Object:", JSON.stringify(rule, null, 2));
