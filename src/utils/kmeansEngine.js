export function initializeCentroids(matrix, k, seed = 1) {
  const random = seededRandom(seed);
  const indices = [];

  while (indices.length < k) {
    const idx = Math.floor(random() * matrix.length);
    if (!indices.includes(idx)) indices.push(idx);
  }

  return indices.map(idx => matrix[idx]);
}

function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function euclideanDistance(point1, point2) {
  return Math.sqrt(
    point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
  );
}

export function assignClusters(matrix, centroids) {
  return matrix.map(point => {
    let minDist = Infinity;
    let cluster = 0;

    centroids.forEach((centroid, idx) => {
      const dist = euclideanDistance(point, centroid);
      if (dist < minDist) {
        minDist = dist;
        cluster = idx;
      }
    });

    return cluster;
  });
}

export function updateCentroids(matrix, clusters, k) {
  const newCentroids = [];

  for (let i = 0; i < k; i++) {
    const clusterPoints = matrix.filter((_, idx) => clusters[idx] === i);

    if (clusterPoints.length === 0) {
      newCentroids.push(matrix[Math.floor(Math.random() * matrix.length)]);
    } else {
      const centroid = matrix[0].map((_, colIdx) =>
        clusterPoints.reduce((sum, point) => sum + point[colIdx], 0) / clusterPoints.length
      );
      newCentroids.push(centroid);
    }
  }

  return newCentroids;
}

export function calculateInertia(matrix, clusters, centroids) {
  let inertia = 0;

  matrix.forEach((point, idx) => {
    const centroid = centroids[clusters[idx]];
    inertia += euclideanDistance(point, centroid) ** 2;
  });

  return inertia;
}

export function kMeansClustering(matrix, k = 3, maxIterations = 12, seed = 1) {
  let centroids = initializeCentroids(matrix, k, seed);
  let clusters = assignClusters(matrix, centroids);
  let inertia = calculateInertia(matrix, clusters, centroids);
  let iterations = 0;

  while (iterations < maxIterations) {
    const newCentroids = updateCentroids(matrix, clusters, k);
    const newClusters = assignClusters(matrix, newCentroids);
    const newInertia = calculateInertia(matrix, newClusters, newCentroids);

    if (Math.abs(newInertia - inertia) < 1e-6) {
      centroids = newCentroids;
      clusters = newClusters;
      iterations++;
      break;
    }

    centroids = newCentroids;
    clusters = newClusters;
    inertia = newInertia;
    iterations++;
  }

  return { clusters, centroids, inertia, iterations };
}

export function labelClusters(clusters, features, ips) {
  const clusterStats = [{}, {}, {}];

  clusters.forEach((cluster, idx) => {
    const ip = ips[idx];
    if (!clusterStats[cluster][ip]) {
      clusterStats[cluster][ip] = [];
    }
    clusterStats[cluster][ip].push(features[ip].failureRatio);
  });

  const avgFailureRatio = clusterStats.map(cluster => {
    const ratios = Object.values(cluster).flat();
    return ratios.length ? ratios.reduce((a, b) => a + b) / ratios.length : 0;
  });

  const sortedByFailure = avgFailureRatio
    .map((ratio, idx) => ({ idx, ratio }))
    .sort((a, b) => a.ratio - b.ratio);

  const clusterLabels = ['Normal', 'Suspicious', 'Attacker'];
  const labelMap = {};

  sortedByFailure.forEach((item, position) => {
    labelMap[item.idx] = clusterLabels[position];
  });

  return labelMap;
}

export function computeRiskScore(feature, clusterLabel) {
  const baseScore = feature.failureRatio * (feature.totalAttempts / 10);

  const multipliers = {
    'Normal': 0.5,
    'Suspicious': 2,
    'Attacker': 4
  };

  const score = Math.round(baseScore * multipliers[clusterLabel]);

  return Math.min(score, 150);
}
