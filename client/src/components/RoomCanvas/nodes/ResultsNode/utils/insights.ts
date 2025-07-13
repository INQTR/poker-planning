import { UserCard } from "@/types";

import {
  VoteStatistics,
  VoteDistributionData,
  calculateAgreementQuality,
  detectOutliers,
} from "./calculations";

export interface Insight {
  type: "success" | "warning" | "info" | "discussion";
  title: string;
  description: string;
  icon?: string;
  priority: number;
}

export function generateInsights(
  votes: UserCard[],
  stats: VoteStatistics,
  distribution: VoteDistributionData[],
): Insight[] {
  const insights: Insight[] = [];
  const agreementQuality = calculateAgreementQuality(votes, distribution);
  const outliers = detectOutliers(votes, stats);

  // Consensus insights
  if (agreementQuality.agreementLevel === "strong") {
    insights.push({
      type: "success",
      title: "Strong Consensus",
      description: `Team has reached ${agreementQuality.consensusStrength.toFixed(
        0,
      )}% agreement`,
      icon: "🎯",
      priority: 1,
    });
  } else if (agreementQuality.hasSplit) {
    insights.push({
      type: "warning",
      title: "Team Split Detected",
      description: `Team is divided between ${agreementQuality.splitGroups?.join(
        " and ",
      )}. Consider discussing the differences`,
      icon: "🤔",
      priority: 2,
    });
  }

  // Spread insights
  if (stats.standardDeviation > 0 && stats.numericVotes.length > 0) {
    const coefficientOfVariation =
      (stats.standardDeviation / stats.average) * 100;
    if (coefficientOfVariation > 50) {
      insights.push({
        type: "discussion",
        title: "High Variance",
        description:
          "Estimates vary significantly. This might indicate unclear requirements or varying complexity understanding",
        icon: "📊",
        priority: 3,
      });
    }
  }

  // Outlier insights
  if (outliers.length > 0) {
    insights.push({
      type: "info",
      title: "Outliers Detected",
      description: `${
        outliers.length
      } vote(s) significantly different from the group: ${outliers.join(", ")}`,
      icon: "🔍",
      priority: 4,
    });
  }

  // Range insights
  if (stats.numericVotes.length > 0 && stats.range.max - stats.range.min > 20) {
    insights.push({
      type: "discussion",
      title: "Wide Estimate Range",
      description: `Estimates range from ${stats.range.min} to ${stats.range.max}. Consider breaking down the story`,
      icon: "📏",
      priority: 5,
    });
  }

  // Participation insights
  const participationRate =
    (votes.filter((v) => v.card).length / votes.length) * 100;
  if (participationRate < 100) {
    insights.push({
      type: "info",
      title: "Incomplete Voting",
      description: `Only ${participationRate.toFixed(
        0,
      )}% of team members have voted`,
      icon: "👥",
      priority: 6,
    });
  }

  // Non-numeric votes insight
  if (stats.nonNumericVotes.length > 0) {
    const uniqueNonNumeric = [...new Set(stats.nonNumericVotes)];
    insights.push({
      type: "info",
      title: "Special Votes",
      description: `Non-numeric votes: ${uniqueNonNumeric.join(", ")}`,
      icon: "🃏",
      priority: 7,
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

export function getNextStepRecommendations(
  insights: Insight[],
  agreementQuality: ReturnType<typeof calculateAgreementQuality>,
): string[] {
  const recommendations: string[] = [];

  if (agreementQuality.agreementLevel === "strong") {
    recommendations.push("✅ Ready to proceed with this estimate");
  } else if (agreementQuality.hasSplit) {
    recommendations.push(
      "💬 Facilitate discussion between team members with different estimates",
    );
    recommendations.push("📋 Review story requirements for clarity");
  }

  if (insights.some((i) => i.title === "High Variance")) {
    recommendations.push(
      "🔨 Consider breaking the story into smaller, more manageable pieces",
    );
  }

  if (insights.some((i) => i.title === "Outliers Detected")) {
    recommendations.push(
      "🎤 Ask team members with outlier votes to explain their reasoning",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "🔄 Consider another voting round to improve consensus",
    );
  }

  return recommendations;
}

export function getFibonacciCompliance(votes: UserCard[]): {
  isCompliant: boolean;
  nonCompliantVotes: string[];
} {
  const fibonacciSequence = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const nonCompliantVotes: string[] = [];

  votes.forEach((vote) => {
    if (vote.card) {
      const numValue = parseFloat(vote.card);
      if (!isNaN(numValue) && !fibonacciSequence.includes(numValue)) {
        nonCompliantVotes.push(vote.card);
      }
    }
  });

  return {
    isCompliant: nonCompliantVotes.length === 0,
    nonCompliantVotes,
  };
}
