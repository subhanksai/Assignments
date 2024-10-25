const mongoose = require("mongoose");

const RuleDataSchema = new mongoose.Schema({
  age: {
    type: Number,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
});
