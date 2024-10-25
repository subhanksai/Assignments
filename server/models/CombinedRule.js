const mongoose = require("mongoose");

const combinedRuleSchema = new mongoose.Schema(
  {
    combinedAST: {
      type: Object,
      required: true,
    },
    ruleList: {
      type: [String], // List of rule strings
      required: true,
    },
    dataList: {
      type: [Object], // List of data objects associated with each rule
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Use mongoose's model function to check if the model already exists
const CombinedRule =
  mongoose.models.CombinedRule ||
  mongoose.model("CombinedRule", combinedRuleSchema);
module.exports = CombinedRule;
