/**
 * Voting scale definitions for the frontend.
 * Mirrors convex/scales.ts for use in React components.
 */

export const VOTING_SCALES = {
  fibonacci: {
    type: "fibonacci" as const,
    label: "Fibonacci",
    description: "0, 1, 2, 3, 5, 8, 13, 21...",
    cards: [
      "0",
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "21",
      "34",
      "55",
      "89",
      "∞",
      "?",
      "☕",
    ],
    isNumeric: true,
  },
  standard: {
    type: "standard" as const,
    label: "Standard",
    description: "0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100",
    cards: [
      "0",
      "0.5",
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "20",
      "40",
      "100",
      "?",
      "☕",
    ],
    isNumeric: true,
  },
  tshirt: {
    type: "tshirt" as const,
    label: "T-Shirt Sizes",
    description: "XS, S, M, L, XL, XXL",
    cards: ["XS", "S", "M", "L", "XL", "XXL", "?", "☕"],
    isNumeric: false,
  },
} as const;

export type VotingScaleType = keyof typeof VOTING_SCALES;

export type VotingScaleConfig = {
  type: VotingScaleType | "custom";
  cards?: string[]; // Required only for custom type
};

/** Custom scale validation rules */
export const SCALE_VALIDATION = {
  minCards: 3,
  maxCards: 20,
  maxCardLength: 10,
} as const;

/** Validate a custom scale */
export function validateCustomScale(cards: string[]): {
  valid: boolean;
  error?: string;
} {
  if (cards.length < SCALE_VALIDATION.minCards) {
    return { valid: false, error: `Minimum ${SCALE_VALIDATION.minCards} cards required` };
  }
  if (cards.length > SCALE_VALIDATION.maxCards) {
    return { valid: false, error: `Maximum ${SCALE_VALIDATION.maxCards} cards allowed` };
  }

  const uniqueCards = new Set(cards);
  if (uniqueCards.size !== cards.length) {
    return { valid: false, error: "Duplicate card values not allowed" };
  }

  const tooLong = cards.find((c) => c.length > SCALE_VALIDATION.maxCardLength);
  if (tooLong) {
    return {
      valid: false,
      error: `Card "${tooLong}" exceeds ${SCALE_VALIDATION.maxCardLength} characters`,
    };
  }

  const emptyCard = cards.find((c) => c.trim() === "");
  if (emptyCard !== undefined) {
    return { valid: false, error: "Empty card values not allowed" };
  }

  return { valid: true };
}

/** Get scale display info for UI */
export function getScalePreview(type: VotingScaleType): string {
  const scale = VOTING_SCALES[type];
  // Show first 6 cards + ellipsis if more
  const preview = scale.cards.slice(0, 6);
  return preview.join(", ") + (scale.cards.length > 6 ? "..." : "");
}
