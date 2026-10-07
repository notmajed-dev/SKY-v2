export function generateScatterPlotData(classified) {
  return classified.map(item => ({
    ip: item.ip,
    x: item.failureRatio,
    y: item.loginFrequency,
    cluster: item.clusterLabel,
    riskScore: item.riskScore
  }));
}
