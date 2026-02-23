import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

export const Banner = () => {
  return (
    <aside
      aria-label="Ukraine support banner"
      className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 flex items-center justify-center gap-x-6 z-50 text-sm font-medium"
    >
      <p>
        We stand with Ukraine and its people.{" "}
        <a
          href="https://u24.gov.ua/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-1 underline-offset-2 hover:opacity-80 transition-opacity ml-1"
        >
          Support Ukraine
        </a>
      </p>
      <button
        type="button"
        className="-m-3 p-3 hidden"
        aria-label="Dismiss"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
      </button>
    </aside>
  );
};
