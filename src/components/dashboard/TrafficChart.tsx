import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficChartProps {
  data: { time: string; normal: number; suspicious: number; attack: number }[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Network Traffic Analysis</h3>
          <p className="text-xs text-muted-foreground">Real-time packet flow monitoring</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" /> Suspicious
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Attack
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
          <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 50%)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 20%, 50%)', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 44%, 8%)',
              border: '1px solid hsl(222, 30%, 16%)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'hsl(210, 40%, 92%)',
            }}
          />
          <Area type="monotone" dataKey="normal" stroke="hsl(187, 100%, 50%)" fill="url(#colorNormal)" strokeWidth={2} />
          <Area type="monotone" dataKey="suspicious" stroke="hsl(38, 92%, 55%)" fill="url(#colorSuspicious)" strokeWidth={2} />
          <Area type="monotone" dataKey="attack" stroke="hsl(0, 85%, 55%)" fill="url(#colorAttack)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
