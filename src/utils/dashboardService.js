export function generateLiveOpsData(records, classified) {
  const totalUsers = classified.length;
  const failedAttempts = records.filter(r => r.status === 'failed').length;
  const bruteForceIPs = classified.filter(c => c.clusterLabel === 'Attacker').length;
  const normalUsers = classified.filter(c => c.clusterLabel === 'Normal').length;

  const failureRate = records.length > 0
    ? ((failedAttempts / records.length) * 100).toFixed(1)
    : 0;

  return {
    totalUsers,
    failedAttempts,
    bruteForceIPs,
    normalUsers,
    failureRate: parseFloat(failureRate)
  };
}

export function generateLoginActivityChart(records) {
  const hourlyData = {};

  records.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    const hourKey = `${hour}:00`;

    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = { time: hourKey, success: 0, failed: 0 };
    }

    if (record.status === 'failed') {
      hourlyData[hourKey].failed++;
    } else {
      hourlyData[hourKey].success++;
    }
  });

  return Object.values(hourlyData).sort((a, b) =>
    parseInt(a.time) - parseInt(b.time)
  );
}

export function calculateDatasetRiskScore(classified) {
  if (classified.length === 0) return 0;

  const avgRisk = classified.reduce((sum, item) => sum + item.riskScore, 0) / classified.length;

  if (avgRisk < 20) return { score: avgRisk, level: 'Low' };
  if (avgRisk < 50) return { score: avgRisk, level: 'Moderate' };
  if (avgRisk < 80) return { score: avgRisk, level: 'High' };
  return { score: avgRisk, level: 'Critical' };
}

export function getTopOffendingIPs(classified, limit = 5) {
  return classified
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit)
    .map(item => ({
      ip: item.ip,
      riskScore: item.riskScore,
      failureRatio: item.failureRatio,
      cluster: item.clusterLabel
    }));
}
