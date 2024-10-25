const mongoose = require("mongoose");

// Define the schema for the rule
const RuleSchema = new mongoose.Schema({
  ruleId: {
    type: String, // or Number, depending on your use case
    required: true,
    unique: true,
  },
  ruleString: {
    type: String,
    required: true,
  },
  ast: {
    type: Object, // You can store the rule's AST as an object
    required: true,
  },
});

// Create the model from the schema
const RuleModel = mongoose.model("Rule", RuleSchema, "Rule");
module.exports = RuleModel;
