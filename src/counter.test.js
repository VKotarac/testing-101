import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Counter, sum, useCounter } from "./counter";

describe("sum(...numbers)", () => {
  it("returns a number", () => {
    expect(typeof sum(1)).toBe("number");
  });

  it.each([
    [2, 1, 1],
    [3, 2, 1],
    [6, 3, 3],
  ])("returns %i given %i and %i", (expected, a, b) => {
    expect(sum(a, b)).toBe(expected);
  });

  it("sums all the given numbers", () => {
    expect(sum(1, 2, 3, 4)).toBe(10);
  });

  it("returns NaN when given something other than number", () => {
    expect(sum("hello", 1)).toBe(NaN);
  });

  it("returns NaN when given no arguments", () => {
    expect(sum()).toBe(NaN);
  });
});

describe("useCounter({ initialValue, max, step })", () => {
  it("returns a object with following properties", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.value).toBe(0);
    expect(typeof result.current.increment).toBe("function");
  });

  it("returns initial value if given", () => {
    const initialValue = 13;
    const { result } = renderHook(() => useCounter({ initialValue }));
    expect(result.current.value).toBe(initialValue);
  });

  it("increments the `value`", () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
  });

  it("should respect the `max` value if given", () => {
    const max = 1;
    const { result } = renderHook(() => useCounter({ max }));
    act(() => result.current.increment());
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.value).toBe(max);
  });

  it("should increment in `steps` if given", () => {
    const step = 2;
    const { result } = renderHook(() => useCounter({ step }));
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.value).toBe(4);
  });
});

describe("<Counter />", () => {
  it("renders a `button`", () => {
    render(<Counter />);
    expect(screen.getByRole("button")).toHaveValue("0");
    expect(screen.getByRole("button")).toHaveTextContent("0");
  });

  it("counts up when clicked", () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveValue("1");
    expect(screen.getByRole("button")).toHaveTextContent("1");
  });

  it("uses initial value if given", () => {
    const initialValue = 3;
    render(<Counter initialValue={initialValue} />);
    expect(screen.getByRole("button")).toHaveValue(initialValue.toString());
    expect(screen.getByRole("button")).toHaveTextContent(
      initialValue.toString()
    );
  });

  it("respects the max value if given", () => {
    const max = 1;
    render(<Counter max={max} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveValue(max.toString());
    expect(screen.getByRole("button")).toHaveTextContent(max.toString());
  });

  it("increments in steps if given", () => {
    const step = 2;
    render(<Counter step={step} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveValue("6");
    expect(screen.getByRole("button")).toHaveTextContent("6");
  });

  it("uses custom render if given", () => {
    render(<Counter render={(value) => `Current count is ${value}`} />);
    expect(screen.getByRole("button")).toHaveValue("0");
    expect(screen.getByRole("button")).toHaveTextContent(`Current count is 0`);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveValue("1");
    expect(screen.getByRole("button")).toHaveTextContent(`Current count is 1`);
  });

  it("can be controlled", () => {
    const increment = jest.fn();
    const value = 13;
    render(<Counter value={value} onIncrement={increment} />);
    expect(screen.getByRole("button")).toHaveValue(value.toString());
    expect(screen.getByRole("button")).toHaveTextContent(value.toString());
    fireEvent.click(screen.getByRole("button"));
    expect(increment).toBeCalledTimes(1);
    expect(increment).toHaveBeenCalledWith(value + 1);
  });

  it("respects `step` when controlled", () => {
    const increment = jest.fn();
    const value = 1;
    const step = 2;
    render(<Counter value={value} onIncrement={increment} step={step} />);
    fireEvent.click(screen.getByRole("button"));
    expect(increment).toBeCalledTimes(1);
    expect(increment).toHaveBeenCalledWith(value + step);
  });

  it("respects `max` when controlled", () => {
    const increment = jest.fn();
    const value = 2;
    const max = 2;
    render(<Counter value={value} onIncrement={increment} max={max} />);
    fireEvent.click(screen.getByRole("button"));
    expect(increment).toBeCalledTimes(1);
    expect(increment).toHaveBeenCalledWith(max);
  });

  it("warns in the console if not fully controlled", () => {
    const spy = jest.spyOn(console, "warn");
    render(<Counter value={1} />);
    expect(spy).toHaveBeenCalledWith("`value` or `onIncrement` not provided");
  });
});
