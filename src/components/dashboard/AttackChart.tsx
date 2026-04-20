import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AttackChartProps {
  data: { name: string; value: number }[];
}

export function AttackChart({ data }: AttackChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Attack Classification</h3>
      <p className="text-xs text-muted-foreground mb-2">Detected threat categories</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 50%)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215, 20%, 50%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 44%, 8%)',
              border: '1px solid hsl(222, 30%, 16%)',
              borderRadius: '8px',
              fontSize: '11px',
              color: 'hsl(210, 40%, 92%)',
            }}
          />
          <Bar dataKey="value" fill="hsl(0, 85%, 55%)" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
