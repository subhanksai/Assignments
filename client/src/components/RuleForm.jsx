import React, { useState } from "react";
import axios from "axios";

const RuleForm = () => {
  const [ruleId, setRuleId] = useState("");
  const [ruleString, setruleString] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data to be sent in the request
    const data = {
      ruleId: parseInt(ruleId, 10), // Convert ruleId to a number if necessary
      ruleString,
    };

    axios;
    axios
      .post("http://localhost:8080/create", data)

      .then((result) => {
        console.log("Response data:", result.data);
      })
      .catch((error) => {
        console.error("There was an error creating the rule:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Set Rule</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ruleId">Rule ID:</label>
          <input
            type="number"
            className="form-control"
            id="ruleId"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ruleString">Rule String:</label>
          <input
            type="text"
            className="form-control"
            id="ruleString"
            value={ruleString}
            onChange={(e) => setruleString(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Rule
        </button>
      </form>
    </div>
  );
};

export default RuleForm;
