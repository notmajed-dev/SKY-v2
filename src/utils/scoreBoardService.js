export function generateRiskScoreboard(classified) {
  return classified.sort((a, b) => b.riskScore - a.riskScore);
}

export function calculateScoreboardStats(classified) {
  if (!classified.length) return null;

  const sorted = classified.sort((a, b) => b.riskScore - a.riskScore);
  const highest = sorted[0];
  const threshold = 60;
  const aboveThreshold = classified.filter(c => c.riskScore >= threshold).length;

  const scores = classified.map(c => c.riskScore).sort((a, b) => a - b);
  const median = scores.length % 2 === 0
    ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
    : scores[Math.floor(scores.length / 2)];

  return {
    highestRisk: {
      ip: highest.ip,
      score: highest.riskScore,
      cluster: highest.clusterLabel
    },
    usersAboveThreshold: aboveThreshold,
    medianScore: median.toFixed(2),
    threshold
  };
}
