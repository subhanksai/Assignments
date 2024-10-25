import React from "react";
import RuleForm from "./components/RuleForm";
import CombineRules from "./components/CombinedRules";
import EvaluateRule from "./components/EvaluationForm";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const App = () => {
  return (
    <div className="container">
      <h1 className="my-4">Rule Engine with AST</h1>
      <RuleForm />
      {/* <CombineRules /> */}
      <EvaluateRule />
    </div>
  );
};

export default App;
