import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Filter, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import {
  generateInitialData, generateTrafficEntry, generateAlert,
  type Alert, type TrafficEntry,
} from '@/lib/mock-data';

type LogEntry = {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
  details?: string;
};

const logLevelConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  warning: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  useEffect(() => {
    // Generate initial logs
    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        level: 'info',
        source: 'Network Monitor',
        message: 'System initialization completed',
        details: 'All monitoring services started successfully'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        level: 'success',
        source: 'Alert Engine',
        message: 'Database connection established',
        details: 'Connected to alerts database on localhost:5432'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        level: 'warning',
        source: 'Traffic Analyzer',
        message: 'High traffic detected on port 80',
        details: 'Traffic volume exceeded threshold: 1500 packets/minute'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        level: 'error',
        source: 'Signature Engine',
        message: 'Failed to load signature database',
        details: 'Error: Connection timeout to signature server'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        level: 'info',
        source: 'Packet Processor',
        message: 'Processing queue cleared',
        details: 'Successfully processed 2500 packets in the last minute'
      }
    ];

    setLogs(initialLogs);

    // Add new logs periodically
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as LogEntry['level'],
        source: ['Network Monitor', 'Alert Engine', 'Traffic Analyzer', 'Signature Engine', 'Packet Processor'][Math.floor(Math.random() * 5)],
        message: [
          'System health check passed',
          'New connection established',
          'Traffic pattern analysis completed',
          'Signature update downloaded',
          'Memory usage optimized',
          'Configuration reloaded',
          'Backup completed successfully'
        ][Math.floor(Math.random() * 7)],
        details: Math.random() > 0.5 ? 'Additional details about this log entry' : undefined
      };

      setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (search && !log.message.toLowerCase().includes(search.toLowerCase()) &&
        !log.source.toLowerCase().includes(search.toLowerCase())) return false;
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    return true;
  });

  const exportLogs = () => {
    const header = 'Timestamp,Level,Source,Message,Details\n';
    const rows = filteredLogs.map(log =>
      `"${log.timestamp.toISOString()}","${log.level}","${log.source}","${log.message}","${log.details || ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentinel-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-56 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                System Logs
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time system logs and event monitoring
              </p>
            </div>
            <button
              onClick={exportLogs}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Logs
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search logs..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value as typeof levelFilter)}
              className="rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground outline-none"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>

          {/* Logs List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="max-h-[600px] overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs found matching your criteria</p>
                </div>
              ) : (
                filteredLogs.map((log, index) => {
                  const config = logLevelConfig[log.level];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`border-b border-border/50 p-4 hover:bg-secondary/20 transition-colors ${
                        index === 0 ? 'bg-secondary/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${config.bg} ${config.border} border`}>
                          <Icon className={`h-3 w-3 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">{log.source}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-1">{log.message}</p>
                          {log.details && (
                            <p className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded">
                              {log.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}