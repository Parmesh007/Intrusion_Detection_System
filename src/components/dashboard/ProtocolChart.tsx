import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ProtocolChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(187, 100%, 50%)', 'hsl(210, 60%, 55%)', 'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 55%)', 'hsl(280, 60%, 55%)', 'hsl(0, 85%, 55%)',
  'hsl(330, 90%, 55%)', 'hsl(160, 60%, 45%)',
];

export function ProtocolChart({ data }: ProtocolChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Protocol Distribution</h3>
      <p className="text-xs text-muted-foreground mb-2">Traffic by protocol type</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 44%, 8%)',
              border: '1px solid hsl(222, 30%, 16%)',
              borderRadius: '8px',
              fontSize: '11px',
              color: 'hsl(210, 40%, 92%)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.slice(0, 6).map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-mono text-foreground">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
