/**
 * Voting scale definitions for planning poker.
 * These define the available card values for different estimation methods.
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

export type VotingScale = {
  type: VotingScaleType | "custom";
  cards: string[];
  isNumeric: boolean;
};

/** Special cards that should not be included in numeric calculations */
export const SPECIAL_CARDS = ["∞", "?", "☕"];

/** Default scale when none is specified (backward compatibility) */
export const DEFAULT_SCALE = VOTING_SCALES.fibonacci;

/** Helper to get a predefined scale by type */
export function getScale(type: VotingScaleType): (typeof VOTING_SCALES)[VotingScaleType] {
  return VOTING_SCALES[type];
}

/** Check if a card value is numeric (excludes special cards) */
export function isNumericCard(cardLabel: string): boolean {
  if (SPECIAL_CARDS.includes(cardLabel)) return false;
  return !isNaN(parseFloat(cardLabel));
}
