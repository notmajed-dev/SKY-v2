import { kMeansClustering, labelClusters, computeRiskScore } from './kmeansEngine';
import { normalizeFeatures, createFeatureMatrix, extractFeatures } from './featureExtractor';

export function performClustering(records, k = 3, maxIterations = 12, seed = 1) {
  const features = extractFeatures(records);
  const { normalized, original } = normalizeFeatures(features);
  const { matrix, ips } = createFeatureMatrix(normalized);

  const result = kMeansClustering(matrix, k, maxIterations, seed);
  const clusterLabels = labelClusters(result.clusters, original, ips);

  const output = ips.map((ip, idx) => ({
    ip,
    cluster: result.clusters[idx],
    clusterLabel: clusterLabels[result.clusters[idx]],
    ...original[ip],
    riskScore: computeRiskScore(
      original[ip],
      clusterLabels[result.clusters[idx]]
    )
  }));

  return {
    classified: output,
    metadata: {
      totalIPs: ips.length,
      inertia: result.inertia,
      iterations: result.iterations,
      seed,
      maxIterations,
      clusterCounts: {
        Normal: output.filter(x => x.clusterLabel === 'Normal').length,
        Suspicious: output.filter(x => x.clusterLabel === 'Suspicious').length,
        Attacker: output.filter(x => x.clusterLabel === 'Attacker').length
      }
    }
  };
}
