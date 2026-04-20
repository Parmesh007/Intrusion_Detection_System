import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Target, Crosshair, BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  getOverallMetrics,
  getPerClassMetrics,
  getHistoricalMetrics,
  getConfusionMatrix,
  getROCData,
} from '@/lib/ml-metrics-data';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, AreaChart, Area, CartesianGrid,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: 'hsl(222, 44%, 8%)',
  border: '1px solid hsl(222, 30%, 16%)',
  borderRadius: '8px',
  fontSize: '11px',
  color: 'hsl(210, 40%, 92%)',
};

const tickStyle = { fill: 'hsl(215, 20%, 50%)', fontSize: 10 };

function MetricGauge({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = value * 100;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(222, 30%, 16%)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono text-foreground">
          {pct.toFixed(1)}%
        </span>
      </div>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Analytics() {
  const overall = getOverallMetrics();
  const perClass = getPerClassMetrics();
  const historical = getHistoricalMetrics();
  const cm = getConfusionMatrix();
  const rocData = getROCData();

  const maxVal = Math.max(...cm.matrix.flat());

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="scan-line pointer-events-none fixed inset-0 z-50 h-[200%]" />
      <Sidebar />
      <main className="ml-16 lg:ml-56 p-4 lg:p-6">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-foreground">ML Model Analytics</h1>
          <p className="text-xs text-muted-foreground font-mono">
            Random Forest v2.4 • Trained on CICIDS2017 • Last retrained: Mar 28, 2026
          </p>
        </header>

        {/* Overall Metrics Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
          <StatsCard title="Accuracy" value={`${(overall.accuracy * 100).toFixed(1)}%`} change="↑ 0.3% from last week" changeType="down" icon={Target} variant="success" />
          <StatsCard title="Precision" value={`${(overall.precision * 100).toFixed(1)}%`} change="Low false positive rate" changeType="down" icon={Crosshair} variant="success" />
          <StatsCard title="Recall" value={`${(overall.recall * 100).toFixed(1)}%`} change={`FNR: ${(overall.falseNegativeRate * 100).toFixed(1)}%`} changeType="neutral" icon={ShieldCheck} />
          <StatsCard title="F1-Score" value={`${(overall.f1Score * 100).toFixed(1)}%`} change="Harmonic mean" changeType="neutral" icon={BarChart3} />
        </div>

        {/* Gauges + ROC */}
        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Model Performance</h3>
            <p className="text-xs text-muted-foreground mb-4">Key metric gauges</p>
            <div className="flex justify-around">
              <MetricGauge label="Precision" value={overall.precision} color="hsl(187, 100%, 50%)" />
              <MetricGauge label="Recall" value={overall.recall} color="hsl(142, 70%, 45%)" />
              <MetricGauge label="F1-Score" value={overall.f1Score} color="hsl(38, 92%, 55%)" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">ROC Curve</h3>
            <p className="text-xs text-muted-foreground mb-2">AUC = 0.987</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="fpr" tick={tickStyle} axisLine={false} tickLine={false} label={{ value: 'FPR', position: 'insideBottom', offset: -2, style: { ...tickStyle, fontSize: 9 } }} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} label={{ value: 'TPR', angle: -90, position: 'insideLeft', offset: 10, style: { ...tickStyle, fontSize: 9 } }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="tpr" stroke="hsl(187, 100%, 50%)" fill="hsl(187, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} dot={false} />
                <Line type="linear" dataKey="fpr" stroke="hsl(215, 20%, 30%)" strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Historical Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-lg border border-border bg-card p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Historical Performance Trends</h3>
          <p className="text-xs text-muted-foreground mb-2">30-day rolling metrics</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={historical}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="date" tick={tickStyle} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[0.9, 1]} tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(210, 60%, 55%)" strokeWidth={2} dot={false} name="Accuracy" />
              <Line type="monotone" dataKey="precision" stroke="hsl(187, 100%, 50%)" strokeWidth={2} dot={false} name="Precision" />
              <Line type="monotone" dataKey="recall" stroke="hsl(142, 70%, 45%)" strokeWidth={2} dot={false} name="Recall" />
              <Line type="monotone" dataKey="f1Score" stroke="hsl(38, 92%, 55%)" strokeWidth={2} dot={false} name="F1-Score" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            {[
              { label: 'Accuracy', color: 'hsl(210, 60%, 55%)' },
              { label: 'Precision', color: 'hsl(187, 100%, 50%)' },
              { label: 'Recall', color: 'hsl(142, 70%, 45%)' },
              { label: 'F1-Score', color: 'hsl(38, 92%, 55%)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Per-Class Metrics + Confusion Matrix */}
        <div className="grid gap-4 lg:grid-cols-2 mb-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">Per-Class F1-Score</h3>
            <p className="text-xs text-muted-foreground mb-2">Detection quality by attack type</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perClass} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" domain={[0.7, 1]} tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <YAxis type="category" dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} width={85} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                <Bar dataKey="f1Score" radius={[0, 4, 4, 0]} barSize={14} fill="hsl(187, 100%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">Confusion Matrix</h3>
            <p className="text-xs text-muted-foreground mb-3">Prediction vs actual classification</p>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-[9px] text-muted-foreground p-1" />
                    {cm.labels.map(l => (
                      <th key={l} className="text-[9px] text-muted-foreground p-1 font-mono">{l.slice(0, 4)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cm.matrix.map((row, i) => (
                    <tr key={cm.labels[i]}>
                      <td className="text-[9px] text-muted-foreground p-1 font-mono text-right pr-2">{cm.labels[i].slice(0, 4)}</td>
                      {row.map((val, j) => {
                        const intensity = val / maxVal;
                        const isDiag = i === j;
                        return (
                          <td key={j} className="p-0.5">
                            <div
                              className="rounded text-[9px] font-mono py-1.5 px-1"
                              style={{
                                backgroundColor: isDiag
                                  ? `hsl(187 100% 50% / ${0.1 + intensity * 0.5})`
                                  : `hsl(0 85% 55% / ${intensity * 0.4})`,
                                color: intensity > 0.3 ? 'hsl(210, 40%, 92%)' : 'hsl(215, 20%, 50%)',
                              }}
                            >
                              {val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Per-class detail table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Classification Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Class</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Precision</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Recall</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">F1-Score</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Support</th>
                </tr>
              </thead>
              <tbody>
                {perClass.map(c => (
                  <tr key={c.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-2 px-3 text-foreground">{c.name}</td>
                    <td className="text-right py-2 px-3 text-foreground">{(c.precision * 100).toFixed(1)}%</td>
                    <td className="text-right py-2 px-3 text-foreground">{(c.recall * 100).toFixed(1)}%</td>
                    <td className="text-right py-2 px-3">
                      <span className={c.f1Score >= 0.93 ? 'text-success' : c.f1Score >= 0.88 ? 'text-warning' : 'text-destructive'}>
                        {(c.f1Score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-2 px-3 text-muted-foreground">{c.support.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
