export function parseCSV(fileContent) {
  const lines = fileContent.trim().split('\n').filter(l => l.length);
  if (!lines.length) return [];
  
  const isCSV = lines[0].includes(',');
  const records = isCSV ? parseCSVFormat(lines) : parseAuthlogFormat(lines);
  
  return records;
}

function parseCSVFormat(lines) {
  const [header, ...rows] = lines;
  const keys = header.split(',').map(k => k.trim().toLowerCase());
  
  return rows.map(row => {
    const values = row.split(',').map(v => v.trim());
    const obj = {};
    keys.forEach((key, i) => {
      obj[key] = values[i] || '';
    });
    return {
      ip: obj.ip,
      timestamp: obj.timestamp,
      username: obj.username,
      status: obj.status
    };
  }).filter(r => r.ip && r.timestamp && r.username && r.status);
}

function parseAuthlogFormat(lines) {
  const records = [];
  const authlogRegex = /(\w+\s+\d+\s+[\d:]+).*sshd\[\d+\]:\s*(?:Failed|Accepted).*(?:invalid user|rhost=)([\d.]+).*user=(\w+)/;
  
  lines.forEach(line => {
    const match = line.match(authlogRegex);
    if (match) {
      records.push({
        timestamp: match[1],
        ip: match[2],
        username: match[3],
        status: line.includes('Failed') ? 'failed' : 'success'
      });
    }
  });
  return records;
}

export function calculateStats(records) {
  const uniqueIPs = new Set(records.map(r => r.ip));
  const failedCount = records.filter(r => r.status === 'failed').length;
  
  return {
    totalRows: records.length,
    uniqueIPs: uniqueIPs.size,
    failedAttempts: failedCount
  };
}
