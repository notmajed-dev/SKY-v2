export function generateClusterInsights(classified) {
  const clusters = {
    Normal: [],
    Suspicious: [],
    Attacker: []
  };

  classified.forEach(item => {
    clusters[item.clusterLabel].push(item);
  });

  const insights = {};

  Object.entries(clusters).forEach(([label, items]) => {
    if (!items.length) {
      insights[label] = {
        count: 0,
        percentage: '0.0',
        avgFailureRate: '0.0',
        avgAttempts: '0.0',
        totalFails: 0,
        members: []
      };
      return;
    }

    const failureRatios = items.map(i => i.failureRatio);
    const attempts = items.map(i => i.totalAttempts);
    const failedAttempts = items.map(i => i.failedAttempts);

    insights[label] = {
      count: items.length,
      percentage: ((items.length / classified.length) * 100).toFixed(1),
      avgFailureRate: (failureRatios.reduce((a, b) => a + b) / failureRatios.length).toFixed(1),
      avgAttempts: (attempts.reduce((a, b) => a + b) / attempts.length).toFixed(1),
      totalFails: failedAttempts.reduce((a, b) => a + b),
      members: items.slice(0, 3).map(i => ({
        ip: i.ip,
        failureRatio: i.failureRatio
      }))
    };
  });

  return insights;
}
