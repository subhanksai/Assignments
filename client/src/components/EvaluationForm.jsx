import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const EvaluateRule = () => {
  const [ruleId, setRuleId] = useState("");
  const [facts, setFacts] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setResult(null); // Reset result on new submission
    setLoading(true); // Start loading

    try {
      // Parse the facts string into an object
      const parsedFacts = JSON.parse(facts);

      const response = await axios.post("http://localhost:8080/evaluate", {
        ruleId: parseInt(ruleId, 10), // Convert ruleId to number
        data: parsedFacts, // Send the parsed facts directly
      });

      console.log(response.data);
      setResult(response.data.result); // Assuming the response has the result field
      setMessage("Evaluation successful!");
    } catch (error) {
      console.error("Error evaluating rule:", error);
      setMessage(
        "Failed to evaluate rule. Please check your input or ensure that your facts are in valid JSON format."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Evaluate Rule</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ruleId" className="form-label">
            Rule ID:
          </label>
          <input
            type="number"
            className="form-control"
            id="ruleId"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facts" className="form-label">
            Facts (JSON format):
          </label>
          <textarea
            className="form-control"
            id="facts"
            rows="5"
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder='{"age": 30, "department": "Sales", "salary": 60000, "experience": 5}'
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Evaluating..." : "Evaluate Rule"}
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      {result !== null && <p className="mt-3">Result: {result.toString()}</p>}
    </div>
  );
};

export default EvaluateRule;
