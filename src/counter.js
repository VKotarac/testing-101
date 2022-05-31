import { useState } from "react";

const add = (a, b) => a + b;

const isNotANumber = (x) => typeof x !== "number";

function sum(...numbers) {
  if (numbers.length < 1 || numbers.some(isNotANumber)) return NaN;
  return numbers.reduce(add);
}

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

function useCounter({
  initialValue = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
} = {}) {
  const [value, setValue] = useState(initialValue);
  function increment() {
    setValue((current) => clamp(current + step, initialValue, max));
  }
  return { value, increment };
}

const identity = (x) => x;

function Counter({
  value: controlledValue,
  onIncrement,
  initialValue = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  render = identity,
}) {
  if ((controlledValue && !onIncrement) || (!controlledValue && onIncrement)) {
    console.warn("`value` or `onIncrement` not provided");
  }
  const { value, increment } = useCounter({ initialValue, max, step });
  function handleClick() {
    if (onIncrement) {
      onIncrement(clamp(renderValue + step, initialValue, max));
      return;
    }
    increment();
  }
  const renderValue = controlledValue ?? value;
  return (
    <button value={renderValue} onClick={handleClick}>
      {render(renderValue)}
    </button>
  );
}

export { sum, useCounter, Counter };
