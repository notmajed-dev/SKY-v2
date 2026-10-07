export function extractFeatures(records) {
  const ipMap = {};
  
  records.forEach(record => {
    if (!ipMap[record.ip]) {
      ipMap[record.ip] = {
        totalAttempts: 0,
        failedAttempts: 0,
        usernames: new Set(),
        hours: [],
        timestamps: []
      };
    }
    
    ipMap[record.ip].totalAttempts++;
    if (record.status === 'failed') {
      ipMap[record.ip].failedAttempts++;
    }
    ipMap[record.ip].usernames.add(record.username);
    ipMap[record.ip].timestamps.push(new Date(record.timestamp));
    
    const hour = new Date(record.timestamp).getHours();
    ipMap[record.ip].hours.push(hour);
  });
  
  const features = {};
  
  Object.entries(ipMap).forEach(([ip, data]) => {
    const failureRatio = (data.failedAttempts / data.totalAttempts * 100).toFixed(2);
    
    const hourCounts = {};
    data.hours.forEach(h => {
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHour = Object.keys(hourCounts).reduce((a, b) =>
      hourCounts[a] > hourCounts[b] ? a : b
    );
    
    const timeSpan = Math.max(...data.timestamps) - Math.min(...data.timestamps);
    const hoursSpan = timeSpan / (1000 * 60 * 60) || 1;
    const loginFrequency = (data.totalAttempts / hoursSpan).toFixed(2);
    
    features[ip] = {
      ip,
      totalAttempts: data.totalAttempts,
      failedAttempts: data.failedAttempts,
      failureRatio: parseFloat(failureRatio),
      loginFrequency: parseFloat(loginFrequency),
      uniqueUsernames: data.usernames.size,
      peakHour: parseInt(peakHour)
    };
  });
  
  return features;
}

export function normalizeFeatures(features) {
  const ipArray = Object.values(features);
  
  const stats = {
    totalAttempts: { min: 0, max: 0 },
    failedAttempts: { min: 0, max: 0 },
    failureRatio: { min: 0, max: 0 },
    loginFrequency: { min: 0, max: 0 },
    uniqueUsernames: { min: 0, max: 0 }
  };
  
  Object.keys(stats).forEach(key => {
    const values = ipArray.map(f => f[key]);
    stats[key].min = Math.min(...values);
    stats[key].max = Math.max(...values);
  });
  
  const normalized = {};
  
  ipArray.forEach(feature => {
    const normalizedFeature = {};
    Object.keys(stats).forEach(key => {
      const { min, max } = stats[key];
      const range = max - min || 1;
      normalizedFeature[key] = (feature[key] - min) / range;
    });
    normalized[feature.ip] = normalizedFeature;
  });
  
  return { normalized, original: features, stats };
}

export function createFeatureMatrix(normalizedFeatures) {
  const keys = Object.keys(normalizedFeatures);
  const featureList = [
    'failureRatio',
    'loginFrequency',
    'totalAttempts',
    'uniqueUsernames'
  ];
  
  const matrix = keys.map(ip => 
    featureList.map(f => normalizedFeatures[ip][f])
  );
  
  return { matrix, ips: keys, featureNames: featureList };
}
