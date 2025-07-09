import {
  DependencyList,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
} from "react";

import { ConfirmationDialogContext } from "./ConfirmationDialogProvider";
import { ModalOptions } from "./types";

export const useModal = (
  options?: Omit<ModalOptions, "resolve" | "reject">,
  deps: DependencyList = [],
): ((
  options?: ModalOptions | ((close: () => void) => ModalOptions),
) => Promise<void>) => {
  const id = useId();
  const handlers = useContext(ConfirmationDialogContext);

  if (!handlers) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, [options, ...deps]);

  const closeModalHandler = useCallback(() => {
    handlers.close?.(id);
  }, [handlers, id]);

  const openModalHandler = useCallback(
    (options?: ModalOptions | ((close: () => void) => ModalOptions)) => {
      let newOptions: ModalOptions | undefined;

      if (typeof options === "function") {
        newOptions = options(closeModalHandler);
      } else {
        newOptions = options;
      }

      return handlers.open?.(id, {
        ...memoizedOptions,
        ...newOptions,
      });
    },
    [closeModalHandler, handlers, id, memoizedOptions],
  );

  useEffect(() => {
    handlers?.update?.(id, memoizedOptions);
  }, [id, memoizedOptions, handlers]);

  useEffect(
    () => () => {
      handlers?.clear?.(id);
    },
    [id, handlers],
  );

  return openModalHandler;
};
