import { RefObject, useEffect } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  excludeRefs?: RefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      if (
        excludeRefs?.some((r) => r.current?.contains(event.target as Node))
      ) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler, excludeRefs]);
}
