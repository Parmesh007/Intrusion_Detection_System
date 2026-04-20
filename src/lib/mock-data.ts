// Simulated network traffic and IDS data

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH' | 'FTP';
export type AttackType = 'Normal' | 'DoS' | 'Probe' | 'R2L' | 'U2R' | 'DDoS' | 'Brute Force' | 'SQL Injection' | 'XSS';

export interface TrafficEntry {
  id: string;
  timestamp: Date;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: Protocol;
  packetSize: number;
  classification: AttackType;
  confidence: number;
  severity: Severity;
  flagged: boolean;
}

export interface Alert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  severity: Severity;
  srcIp: string;
  attackType: AttackType;
  resolved: boolean;
}

const IPS = [
  '192.168.1.10', '192.168.1.25', '10.0.0.5', '10.0.0.12', '172.16.0.3',
  '45.33.32.156', '104.26.10.78', '185.199.108.153', '93.184.216.34',
  '203.0.113.42', '198.51.100.7', '23.94.12.88', '91.189.88.142',
  '142.250.190.14', '151.101.1.140', '8.8.8.8', '1.1.1.1',
];

const PROTOCOLS: Protocol[] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP'];
const ATTACKS: AttackType[] = ['Normal', 'DoS', 'Probe', 'R2L', 'U2R', 'DDoS', 'Brute Force', 'SQL Injection', 'XSS'];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];

let idCounter = 0;

export function generateTrafficEntry(timestamp?: Date): TrafficEntry {
  const isAttack = Math.random() < 0.15;
  const classification = isAttack ? pick(ATTACKS.filter(a => a !== 'Normal')) : 'Normal';
  const severity: Severity = !isAttack ? 'low' : pick(['medium', 'high', 'critical'] as Severity[]);
  
  return {
    id: `traffic-${++idCounter}`,
    timestamp: timestamp || new Date(),
    srcIp: pick(IPS),
    dstIp: pick(IPS),
    srcPort: rand(1024, 65535),
    dstPort: pick([22, 53, 80, 443, 8080, 3306, 5432, 21, 25]),
    protocol: pick(PROTOCOLS),
    packetSize: rand(64, 65535),
    classification,
    confidence: isAttack ? rand(65, 99) / 100 : rand(85, 99) / 100,
    severity,
    flagged: isAttack,
  };
}

export function generateAlert(entry: TrafficEntry): Alert {
  const titles: Record<string, string> = {
    'DoS': 'Denial of Service Attack Detected',
    'DDoS': 'Distributed DoS Attack in Progress',
    'Probe': 'Network Probe/Scan Detected',
    'R2L': 'Remote to Local Attack Detected',
    'U2R': 'Privilege Escalation Attempt',
    'Brute Force': 'Brute Force Login Attempt',
    'SQL Injection': 'SQL Injection Attempt Detected',
    'XSS': 'Cross-Site Scripting Attempt',
  };

  return {
    id: `alert-${++idCounter}`,
    timestamp: entry.timestamp,
    title: titles[entry.classification] || 'Suspicious Activity Detected',
    description: `${entry.classification} from ${entry.srcIp}:${entry.srcPort} → ${entry.dstIp}:${entry.dstPort} via ${entry.protocol}`,
    severity: entry.severity,
    srcIp: entry.srcIp,
    attackType: entry.classification,
    resolved: false,
  };
}

export function generateInitialData(count: number = 200) {
  const entries: TrafficEntry[] = [];
  const alerts: Alert[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - (count - i) * 3000);
    const entry = generateTrafficEntry(timestamp);
    entries.push(entry);
    if (entry.flagged) {
      alerts.push(generateAlert(entry));
    }
  }

  return { entries, alerts };
}

export function getTrafficTimeSeries(entries: TrafficEntry[], minutes: number = 30) {
  const now = Date.now();
  const buckets: { time: string; normal: number; suspicious: number; attack: number }[] = [];
  
  for (let i = minutes; i >= 0; i--) {
    const bucketStart = now - i * 60000;
    const bucketEnd = bucketStart + 60000;
    const bucket = entries.filter(e => {
      const t = e.timestamp.getTime();
      return t >= bucketStart && t < bucketEnd;
    });
    
    buckets.push({
      time: new Date(bucketStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      normal: bucket.filter(e => !e.flagged).length,
      suspicious: bucket.filter(e => e.flagged && e.severity === 'medium').length,
      attack: bucket.filter(e => e.flagged && (e.severity === 'high' || e.severity === 'critical')).length,
    });
  }
  
  return buckets;
}

export function getProtocolDistribution(entries: TrafficEntry[]) {
  const counts: Record<string, number> = {};
  entries.forEach(e => { counts[e.protocol] = (counts[e.protocol] || 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getAttackTypeDistribution(entries: TrafficEntry[]) {
  const counts: Record<string, number> = {};
  entries.filter(e => e.flagged).forEach(e => { counts[e.classification] = (counts[e.classification] || 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}
