/**
 * Evaluate rules against facts and log the results.
 * @param {Object} rule - The rule to evaluate.
 * @param {Object} facts - The facts to evaluate against.
 */
function evaluateRules(rule, facts) {
  // Create an engine instance
  const engine = new Engine();

  // Add the rule to the engine
  engine.addRule(rule);

  // Evaluate the rules against the facts
  engine
    .run(facts)
    .then(({ events }) => {
      // Handle the events that were triggered by the rules
      events.forEach((event) => {
        console.log("Event triggered:", event.params.message);
      });
    })
    .catch((err) => {
      console.error("Error evaluating rules:", err);
    });
}

module.exports = evaluateRules;
