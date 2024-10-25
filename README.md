# Rule Engine with AST

## Objective

The Rule Engine application is a simple 3-tier system designed to determine user eligibility based on attributes such as age, department, income, and spending. It utilizes an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, modification, and combination of these rules.

## Features

- Dynamic creation and evaluation of rules using Abstract Syntax Trees.
- API for rule creation and evaluation.
- Data storage for rules and application metadata.
- Efficient evaluation through caching of AST representations.

## Data Structure

The application defines a data structure to represent the AST, structured as follows:

## Method 1 
- **Node**
  - `type`: String indicating the node type ("operator" for AND/OR, "operand" for conditions).
  - `left`: Reference to another Node (left child).
  - `right`: Reference to another Node (right child for operators).
  - `value`: Optional value for operand nodes (e.g., a number for comparisons).
 
## Method - 2

- Implemented using npm json-rule-engine.

**npm json-rule-engine Overview**

**Key Features**
- **Rule Definition**: 
  - Allows defining rules using JSON objects for clarity and manageability.
- **AST (Abstract Syntax Tree)**: 
  - Converts rules into an AST for efficient evaluation and manipulation.
- **Evaluation**: 
  - Evaluates rules against data objects, returning boolean results.
  - Supports logical operators: AND, OR, NOT.
- **Flexibility**: 
  - Custom operators and functions can be added to extend functionality.
  - Supports nested and combined rules.
- **Performance**: 
  - Designed for efficient, real-time decision-making.



## Sample Rules

Here are a couple of sample rules that can be created using this engine:

- **Rule 1**: `"((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"`
- **Rule 2**: `"((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"`

## API Design

### 1. Create Rule

```javascript
create_rule(rule_string)
```

- **Description**: Takes a string representing a rule and returns a Node object representing the corresponding AST.

### 2. Evaluate Rule

```javascript
evaluate_rule(data)
```

- **Description**: Evaluates the combined rule's AST against the provided data attributes. Returns `True` if the user meets the criteria, `False` otherwise.
- **Example Data**: 
  ```json
  {
    "age": 35,
    "department": "Sales",
    "salary": 60000,
    "experience": 3
  }
  ```

## Test Cases

1. Create individual rules from the examples using `create_rule` and verify their AST representation.
2. Implement sample JSON data and test `evaluate_rule` for various scenarios.
3. Explore combining additional rules and validate the functionality.

## Bonus Features

- Implemented error handling for invalid rule strings or data formats (e.g., missing operators, invalid comparisons).
- Validations to ensure attributes are part of a predefined catalog.

## Installation Guide

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

## Docker Deployment

To run the application using Docker, you can pull the latest version of the Docker image:
```bash
docker pull subhank31/rule-engine:latest
```
> **Note:** The application has been developed on an Apple Silicon chip, so ensure that your Docker environment is compatible. Use the appropriate versioning to run the application smoothly on your setup.

## Running the Application

To launch the application, execute the following command:
```bash
npm run dev
```
This command will start both the backend server and the frontend interface simultaneously.
