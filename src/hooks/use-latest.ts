import { useRef, useEffect } from "react";

/**
 * Returns a ref that always contains the latest value.
 * Useful for accessing latest values in callbacks without adding them to dependency arrays.
 * Prevents effect re-runs while avoiding stale closures.
 *
 * Based on Vercel React Best Practices: advanced-use-latest
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
