import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ShieldAlert, ShieldX } from 'lucide-react';
import type { Alert, Severity } from '@/lib/mock-data';

const severityConfig: Record<Severity, { icon: typeof Shield; color: string; bg: string }> = {
  low: { icon: Shield, color: 'text-threat-low', bg: 'bg-threat-low/10' },
  medium: { icon: AlertTriangle, color: 'text-threat-medium', bg: 'bg-threat-medium/10' },
  high: { icon: ShieldAlert, color: 'text-threat-high', bg: 'bg-threat-high/10' },
  critical: { icon: ShieldX, color: 'text-threat-critical', bg: 'bg-threat-critical/10' },
};

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const recent = alerts.slice(-8).reverse();

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Threat Alerts</h3>
          <p className="text-xs text-muted-foreground">{alerts.filter(a => !a.resolved).length} unresolved</p>
        </div>
        <div className="flex h-6 items-center rounded-full border border-destructive/30 bg-destructive/10 px-2">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-glow" />
          <span className="text-[10px] font-mono text-destructive">LIVE</span>
        </div>
      </div>
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {recent.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-md border border-border p-3 ${config.bg}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{alert.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground font-mono truncate">{alert.description}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${config.color} ${config.bg}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
