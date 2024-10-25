import React, { useState } from "react";
import axios from "axios";

const CombineRules = () => {
  const [ruleInput, setRuleInput] = useState(""); // Store the entire rule input
  const [message, setMessage] = useState(""); // Store success or error messages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // Split the input into individual rules based on new lines or semicolons
    const rulesArray = ruleInput
      .split(/[\n;]+/) // Split on newline or semicolon
      .map((rule) => rule.trim())
      .filter(Boolean); // Remove empty strings

    // Check if at least two rules are provided
    if (rulesArray.length < 2) {
      setMessage("Please provide at least two rules.");
      return;
    }

    // Prepare the rule strings for submission
    const ruleStrings = rulesArray
      .map((rule) => {
        const parts = rule.split("="); // Split based on '='
        if (parts.length === 2) {
          const key = parts[0].trim(); // Extract the rule name
          const condition = parts[1].trim(); // Extract the condition
          return { key, condition }; // Return an object with key and condition
        } else {
          return null; // Invalid format
        }
      })
      .filter(Boolean); // Remove any null values

    // Check if at least two valid rule definitions are provided
    if (ruleStrings.length < 2) {
      setMessage("Please provide valid rule definitions.");
      return;
    }

    try {
      // Send the rule strings to the backend to combine
      const response = await axios.post(
        "http://localhost:8080/api/rules/combine",
        {
          rules: ruleStrings, // Send the array of rule objects
        }
      );

      setMessage("Combined rule created successfully!");
      console.log("Combined Rule:", response.data);
    } catch (error) {
      console.error("Error combining rules:", error);
      setMessage("Failed to combine rules. Please try again.");
    }
  };

  return (
    <div>
      <h2>Combine Rules</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ruleInput">
            Enter Rules (format: ruleName=condition):
          </label>
          <textarea
            className="form-control"
            id="ruleInput"
            value={ruleInput}
            onChange={(e) => setRuleInput(e.target.value)}
            placeholder="e.g., rule1 = ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing'));\nrule2 = ((age > 30 AND department = 'Marketing'));"
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Combine Rules
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CombineRules;
