import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

const variantStyles = {
  default: 'border-border bg-card',
  danger: 'border-destructive/30 bg-destructive/5',
  warning: 'border-warning/30 bg-warning/5',
  success: 'border-success/30 bg-success/5',
};

const iconStyles = {
  default: 'text-primary bg-primary/10',
  danger: 'text-destructive bg-destructive/10',
  warning: 'text-warning bg-warning/10',
  success: 'text-success bg-success/10',
};

export function StatsCard({ title, value, change, changeType = 'neutral', icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-4 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={`rounded-md p-2 ${iconStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
        {change && (
          <p className={`mt-1 text-xs font-mono ${
            changeType === 'up' ? 'text-destructive' : changeType === 'down' ? 'text-success' : 'text-muted-foreground'
          }`}>
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
}
