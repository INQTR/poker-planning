import { useMemo } from "react";

import { UserCard, User } from "@/types";

import {
  calculateVoteStatistics,
  VoteDistributionData,
  detectVoteClusters,
  calculateAgreementQuality,
} from "../utils/calculations";
import {
  generateInsights,
  getNextStepRecommendations,
} from "../utils/insights";

export function useVoteAnalysis(votes: UserCard[], users: User[]) {
  return useMemo(() => {
    // Calculate basic statistics
    const stats = calculateVoteStatistics(votes);

    // Build distribution data
    const distribution: Record<string, VoteDistributionData> = {};
    const totalVotes = votes.filter((v) => v.card).length;

    votes.forEach((vote) => {
      if (vote.card) {
        if (!distribution[vote.card]) {
          distribution[vote.card] = {
            value: vote.card,
            count: 0,
            percentage: 0,
            users: [],
            isNumeric: !isNaN(parseFloat(vote.card)),
            deviation: undefined,
          };
        }

        distribution[vote.card].count++;
        const user = users.find((u) => u.id === vote.userId);
        if (user) {
          distribution[vote.card].users.push(user.username);
        }
      }
    });

    // Calculate percentages and deviation
    Object.values(distribution).forEach((item) => {
      item.percentage = totalVotes > 0 ? (item.count / totalVotes) * 100 : 0;
      if (item.isNumeric && stats.median) {
        item.deviation = Math.abs(parseFloat(item.value) - stats.median);
      }
    });

    const distributionArray = Object.values(distribution);

    // Calculate participation rate
    const participationRate =
      totalVotes > 0 ? (totalVotes / votes.length) * 100 : 0;

    // Detect vote clusters
    const voteClusters = detectVoteClusters(distributionArray);

    // Calculate agreement quality
    const agreementQuality = calculateAgreementQuality(
      votes,
      distributionArray,
    );

    // Generate insights
    const insights = generateInsights(votes, stats, distributionArray);

    // Get recommendations
    const recommendations = getNextStepRecommendations(
      insights,
      agreementQuality,
    );

    return {
      stats,
      distribution: distributionArray,
      participationRate,
      voteClusters,
      agreementQuality,
      insights,
      recommendations,
    };
  }, [votes, users]);
}
