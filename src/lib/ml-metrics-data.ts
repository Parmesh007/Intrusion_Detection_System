// Simulated ML model performance metrics

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

export interface ClassMetrics {
  name: string;
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export interface ConfusionMatrix {
  labels: string[];
  matrix: number[][];
}

export interface HistoricalPoint {
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export function getOverallMetrics(): ModelMetrics {
  return {
    accuracy: 0.964,
    precision: 0.951,
    recall: 0.938,
    f1Score: 0.944,
    falsePositiveRate: 0.032,
    falseNegativeRate: 0.062,
  };
}

export function getPerClassMetrics(): ClassMetrics[] {
  return [
    { name: 'Normal', precision: 0.98, recall: 0.97, f1Score: 0.975, support: 6742 },
    { name: 'DoS', precision: 0.96, recall: 0.95, f1Score: 0.955, support: 1284 },
    { name: 'DDoS', precision: 0.94, recall: 0.92, f1Score: 0.930, support: 876 },
    { name: 'Probe', precision: 0.93, recall: 0.91, f1Score: 0.920, support: 654 },
    { name: 'R2L', precision: 0.89, recall: 0.86, f1Score: 0.875, support: 312 },
    { name: 'U2R', precision: 0.85, recall: 0.82, f1Score: 0.835, support: 148 },
    { name: 'Brute Force', precision: 0.92, recall: 0.94, f1Score: 0.930, support: 523 },
    { name: 'SQL Injection', precision: 0.91, recall: 0.88, f1Score: 0.895, support: 267 },
    { name: 'XSS', precision: 0.90, recall: 0.87, f1Score: 0.885, support: 194 },
  ];
}

export function getConfusionMatrix(): ConfusionMatrix {
  const labels = ['Normal', 'DoS', 'DDoS', 'Probe', 'R2L', 'U2R'];
  const matrix = [
    [6540, 45, 32, 58, 42, 25],
    [28, 1220, 18, 8, 6, 4],
    [15, 22, 806, 18, 10, 5],
    [30, 12, 15, 596, 1, 0],
    [18, 5, 8, 2, 268, 11],
    [12, 3, 4, 1, 8, 120],
  ];
  return { labels, matrix };
}

export function getHistoricalMetrics(): HistoricalPoint[] {
  const points: HistoricalPoint[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const drift = Math.sin(i * 0.3) * 0.015;
    const improvement = i * 0.0008;

    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: Math.min(0.99, 0.94 + improvement + drift * 0.5),
      precision: Math.min(0.99, 0.93 + improvement + drift),
      recall: Math.min(0.99, 0.92 + improvement - drift * 0.3),
      f1Score: Math.min(0.99, 0.925 + improvement + drift * 0.2),
    });
  }
  return points;
}

export function getROCData() {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const fpr = i / 100;
    const tpr = 1 - Math.pow(1 - fpr, 3.5);
    points.push({ fpr: +fpr.toFixed(3), tpr: +tpr.toFixed(3) });
  }
  return points;
}
