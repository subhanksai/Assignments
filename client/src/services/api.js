import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/rules2"; // Adjust this to your API URL

export const createRule = async (ruleString, ruleId) => {
  const response = await axios.post(`${API_BASE_URL}/create`, {
    ruleString,
    ruleId,
  });
  return response;
};

export const combineRules = async (ruleStrings) => {
  const response = await axios.post(`${API_BASE_URL}/combine`, {
    ruleStrings, // Send the list of rule strings
  });
  return response;
};
export const evaluateRule = async (ruleId, data) => {
  const response = await axios.post(`${API_BASE_URL}/evaluate`, {
    ruleId,
    data,
  });
  return response.data; // Assuming the API returns the evaluation result
};
