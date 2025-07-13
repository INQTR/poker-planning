import { UserCard } from "@/types";

export interface VoteStatistics {
  average: number;
  median: number;
  mode: string[];
  standardDeviation: number;
  variance: number;
  range: { min: number; max: number };
  confidenceInterval: { lower: number; upper: number };
  numericVotes: number[];
  nonNumericVotes: string[];
}

export interface VoteDistributionData {
  value: string;
  count: number;
  percentage: number;
  users: string[];
  isNumeric: boolean;
  deviation?: number;
}

export function calculateVoteStatistics(votes: UserCard[]): VoteStatistics {
  const numericVotes: number[] = [];
  const nonNumericVotes: string[] = [];

  votes.forEach((vote) => {
    if (vote.card) {
      const numValue = parseFloat(vote.card);
      if (!isNaN(numValue)) {
        numericVotes.push(numValue);
      } else {
        nonNumericVotes.push(vote.card);
      }
    }
  });

  const sortedNumeric = [...numericVotes].sort((a, b) => a - b);

  const average =
    numericVotes.length > 0
      ? numericVotes.reduce((sum, val) => sum + val, 0) / numericVotes.length
      : 0;

  const median = calculateMedian(sortedNumeric);
  const mode = calculateMode(
    votes.map((v) => v.card).filter(Boolean) as string[],
  );
  const { standardDeviation, variance } = calculateVariance(
    numericVotes,
    average,
  );
  const range =
    numericVotes.length > 0
      ? { min: Math.min(...numericVotes), max: Math.max(...numericVotes) }
      : { min: 0, max: 0 };

  const confidenceInterval = calculateConfidenceInterval(
    numericVotes,
    average,
    standardDeviation,
  );

  return {
    average,
    median,
    mode,
    standardDeviation,
    variance,
    range,
    confidenceInterval,
    numericVotes,
    nonNumericVotes,
  };
}

function calculateMedian(sortedValues: number[]): number {
  if (sortedValues.length === 0) return 0;

  const mid = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
    : sortedValues[mid];
}

function calculateMode(values: string[]): string[] {
  const frequency: Record<string, number> = {};
  let maxFreq = 0;

  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[value]);
  });

  return Object.entries(frequency)
    .filter(([_, freq]) => freq === maxFreq)
    .map(([value]) => value);
}

function calculateVariance(
  values: number[],
  mean: number,
): { variance: number; standardDeviation: number } {
  if (values.length === 0) return { variance: 0, standardDeviation: 0 };

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const standardDeviation = Math.sqrt(variance);

  return { variance, standardDeviation };
}

function calculateConfidenceInterval(
  values: number[],
  mean: number,
  stdDev: number,
): { lower: number; upper: number } {
  if (values.length === 0) return { lower: 0, upper: 0 };

  // 95% confidence interval using 1.96 z-score
  const marginOfError = 1.96 * (stdDev / Math.sqrt(values.length));

  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
  };
}

export function detectVoteClusters(
  distribution: VoteDistributionData[],
): string[] {
  const clusters: string[] = [];
  const sortedDist = [...distribution].sort((a, b) => {
    const numA = parseFloat(a.value);
    const numB = parseFloat(b.value);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.value.localeCompare(b.value);
  });

  let currentCluster: VoteDistributionData[] = [];

  sortedDist.forEach((item, index) => {
    if (item.count > 0) {
      if (currentCluster.length === 0) {
        currentCluster.push(item);
      } else {
        const lastValue = parseFloat(
          currentCluster[currentCluster.length - 1].value,
        );
        const currentValue = parseFloat(item.value);

        if (
          !isNaN(lastValue) &&
          !isNaN(currentValue) &&
          Math.abs(currentValue - lastValue) <= 1
        ) {
          currentCluster.push(item);
        } else {
          if (currentCluster.length >= 2) {
            const clusterVotes = currentCluster.reduce(
              (sum, c) => sum + c.count,
              0,
            );
            clusters.push(
              `${clusterVotes} votes clustered around ${
                currentCluster[0].value
              }-${currentCluster[currentCluster.length - 1].value}`,
            );
          }
          currentCluster = [item];
        }
      }
    }

    if (index === sortedDist.length - 1 && currentCluster.length >= 2) {
      const clusterVotes = currentCluster.reduce((sum, c) => sum + c.count, 0);
      clusters.push(
        `${clusterVotes} votes clustered around ${currentCluster[0].value}-${
          currentCluster[currentCluster.length - 1].value
        }`,
      );
    }
  });

  return clusters;
}

export function detectOutliers(
  votes: UserCard[],
  stats: VoteStatistics,
): string[] {
  if (stats.numericVotes.length < 3) return [];

  const outliers: string[] = [];
  const q1 = calculateMedian(
    stats.numericVotes.slice(0, Math.floor(stats.numericVotes.length / 2)),
  );
  const q3 = calculateMedian(
    stats.numericVotes.slice(Math.ceil(stats.numericVotes.length / 2)),
  );
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  votes.forEach((vote) => {
    if (vote.card) {
      const numValue = parseFloat(vote.card);
      if (
        !isNaN(numValue) &&
        (numValue < lowerBound || numValue > upperBound)
      ) {
        outliers.push(vote.card);
      }
    }
  });

  return outliers;
}

export function calculateAgreementQuality(
  votes: UserCard[],
  distribution: VoteDistributionData[],
): {
  consensusStrength: number;
  hasSplit: boolean;
  splitGroups?: string[];
  agreementLevel: "strong" | "moderate" | "weak";
} {
  const totalVotes = votes.length;
  const mostCommonCount = Math.max(...distribution.map((d) => d.count));
  const consensusStrength = (mostCommonCount / totalVotes) * 100;

  // Check for split (two or more groups with similar vote counts)
  const significantGroups = distribution.filter(
    (d) => d.count >= totalVotes * 0.25,
  );
  const hasSplit = significantGroups.length >= 2;

  let agreementLevel: "strong" | "moderate" | "weak";
  if (consensusStrength > 80) {
    agreementLevel = "strong";
  } else if (consensusStrength > 60) {
    agreementLevel = "moderate";
  } else {
    agreementLevel = "weak";
  }

  return {
    consensusStrength,
    hasSplit,
    splitGroups: hasSplit ? significantGroups.map((g) => g.value) : undefined,
    agreementLevel,
  };
}
