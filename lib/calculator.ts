export type CalculatorOperator = "+" | "−" | "×" | "÷";

const precedence: Record<CalculatorOperator, number> = { "+": 1, "−": 1, "×": 2, "÷": 2 };

function tokenize(expression: string): Array<number | CalculatorOperator> {
  const normalized = expression.replace(/\s+/g, "");
  const tokens: Array<number | CalculatorOperator> = [];
  let number = "";

  const flush = () => {
    if (!number) return;
    const value = Number(number);
    if (!Number.isFinite(value)) throw new Error("Invalid number");
    tokens.push(value);
    number = "";
  };

  for (const char of normalized) {
    if ((char >= "0" && char <= "9") || char === ".") {
      number += char;
      continue;
    }
    if (char === "+" || char === "−" || char === "×" || char === "÷") {
      flush();
      if (tokens.length === 0 || typeof tokens[tokens.length - 1] !== "number") throw new Error("Invalid expression");
      tokens.push(char);
      continue;
    }
    throw new Error("Invalid character");
  }

  flush();
  if (tokens.length === 0 || typeof tokens[tokens.length - 1] !== "number") throw new Error("Invalid expression");
  return tokens;
}

export function evaluateExpression(expression: string): number {
  const tokens = tokenize(expression);
  const values: number[] = [];
  const operators: CalculatorOperator[] = [];

  const applyTop = () => {
    const operator = operators.pop();
    const right = values.pop();
    const left = values.pop();
    if (!operator || right === undefined || left === undefined) throw new Error("Invalid expression");
    if (operator === "÷" && right === 0) throw new Error("Cannot divide by zero");
    const result = operator === "+" ? left + right : operator === "−" ? left - right : operator === "×" ? left * right : left / right;
    if (!Number.isFinite(result)) throw new Error("Result is not finite");
    values.push(result);
  };

  for (const token of tokens) {
    if (typeof token === "number") {
      values.push(token);
      continue;
    }
    while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) applyTop();
    operators.push(token);
  }
  while (operators.length) applyTop();

  if (values.length !== 1) throw new Error("Invalid expression");
  return Number(values[0].toPrecision(12));
}
