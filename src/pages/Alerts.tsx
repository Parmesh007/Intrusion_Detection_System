import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ShieldAlert, ShieldX, Check, Search, Download, FileText, Filter, X } from 'lucide-react';
import jsPDF from 'jspdf';
import { Sidebar } from '@/components/dashboard/Sidebar';
import {
  generateInitialData, generateTrafficEntry, generateAlert,
  type Alert, type Severity,
} from '@/lib/mock-data';
import { loadAlertsFromStorage, saveAlertsToStorage } from '@/lib/storage';

const severityConfig: Record<Severity, { icon: typeof Shield; color: string; bg: string; border: string }> = {
  low: { icon: Shield, color: 'text-threat-low', bg: 'bg-threat-low/10', border: 'border-threat-low/30' },
  medium: { icon: AlertTriangle, color: 'text-threat-medium', bg: 'bg-threat-medium/10', border: 'border-threat-medium/30' },
  high: { icon: ShieldAlert, color: 'text-threat-high', bg: 'bg-threat-high/10', border: 'border-threat-high/30' },
  critical: { icon: ShieldX, color: 'text-threat-critical', bg: 'bg-threat-critical/10', border: 'border-threat-critical/30' },
};

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

function exportCSV(alerts: Alert[]) {
  const header = 'ID,Timestamp,Title,Description,Severity,Source IP,Attack Type,Resolved\n';
  const rows = alerts.map(a =>
    `"${a.id}","${a.timestamp.toISOString()}","${a.title}","${a.description}","${a.severity}","${a.srcIp}","${a.attackType}","${a.resolved}"`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sentinel-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportPDF(alerts: Alert[]) {
  const doc = new jsPDF();
  
  // Set up document
  doc.setFontSize(20);
  doc.setTextColor(34, 211, 238); // Cyan color for title
  doc.text('SENTINEL IDS', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Gray color
  doc.text(`Alert Report • Generated ${new Date().toLocaleString()} • ${alerts.length} alerts`, 20, 45);
  
  // Table headers
  const headers = ['Time', 'Alert', 'Severity', 'Source IP', 'Type', 'Status'];
  let yPosition = 60;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFillColor(30, 41, 59); // Dark header background
  doc.rect(20, yPosition - 5, 170, 8, 'F');
  
  headers.forEach((header, index) => {
    doc.text(header.toUpperCase(), 25 + (index * 28), yPosition);
  });
  
  yPosition += 10;
  
  // Table data
  doc.setFontSize(8);
  alerts.forEach((alert, index) => {
    if (yPosition > 270) { // New page if needed
      doc.addPage();
      yPosition = 30;
    }
    
    const time = alert.timestamp.toLocaleString();
    const title = alert.title.length > 20 ? alert.title.substring(0, 17) + '...' : alert.title;
    const severity = alert.severity.toUpperCase();
    const srcIp = alert.srcIp;
    const attackType = alert.attackType;
    const status = alert.resolved ? 'RESOLVED' : 'ACTIVE';
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(15, 23, 42); // Dark row
      doc.rect(20, yPosition - 3, 170, 6, 'F');
    }
    
    // Set text colors based on severity
    let severityColor = [147, 197, 253]; // Blue for low
    if (alert.severity === 'critical') severityColor = [252, 165, 165]; // Red
    else if (alert.severity === 'high') severityColor = [252, 165, 165]; // Red
    else if (alert.severity === 'medium') severityColor = [251, 191, 36]; // Yellow
    
    const statusColor = alert.resolved ? [74, 222, 128] : [248, 113, 113]; // Green or red
    
    doc.setTextColor(203, 213, 225); // Light text
    doc.text(time.length > 15 ? time.substring(0, 12) + '...' : time, 25, yPosition);
    doc.text(title, 53, yPosition);
    
    doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.text(severity, 81, yPosition);
    
    doc.setTextColor(148, 163, 184); // Gray for IP
    doc.text(srcIp, 109, yPosition);
    
    doc.setTextColor(203, 213, 225); // Light text
    doc.text(attackType.length > 12 ? attackType.substring(0, 9) + '...' : attackType, 137, yPosition);
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(status, 165, yPosition);
    
    yPosition += 8;
  });
  
  // Save the PDF
  doc.save(`sentinel-alerts-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const stored = loadAlertsFromStorage();
    return stored.length ? stored : [];
  });
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Set<Severity>>(new Set(SEVERITIES));
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    if (alerts.length === 0) {
      const { alerts: init } = generateInitialData(300);
      setAlerts(init);
    }
  }, []);

  useEffect(() => {
    saveAlertsToStorage(alerts);
  }, [alerts]);

  useEffect(() => {
    const handleAlertsUpdated = (event: Event) => {
      const detail = (event as CustomEvent<Alert[]>).detail;
      setAlerts(detail);
    };

    window.addEventListener('sentinelAlertsUpdated', handleAlertsUpdated as EventListener);
    return () => window.removeEventListener('sentinelAlertsUpdated', handleAlertsUpdated as EventListener);
  }, []);

  const addEntry = useCallback(() => {
    const entry = generateTrafficEntry();
    if (entry.flagged) {
      setAlerts(prev => [...prev.slice(-500), generateAlert(entry)]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(addEntry, 2000);
    return () => clearInterval(interval);
  }, [addEntry]);

  const toggleSeverity = (s: Severity) => {
    setSeverityFilter(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: !a.resolved } : a));
  };

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      if (!severityFilter.has(a.severity)) return false;
      if (statusFilter === 'active' && a.resolved) return false;
      if (statusFilter === 'resolved' && !a.resolved) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.srcIp.includes(q) || a.attackType.toLowerCase().includes(q);
      }
      return true;
    }).reverse();
  }, [alerts, severityFilter, statusFilter, search]);

  const counts = useMemo(() => ({
    total: alerts.length,
    active: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.resolved).length,
  }), [alerts]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="scan-line pointer-events-none fixed inset-0 z-50 h-[200%]" />
      <Sidebar />
      <main className="ml-16 lg:ml-56 p-4 lg:p-6">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Alert Management</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {counts.active} active alerts • {counts.critical} critical • {counts.high} high
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => exportCSV(filtered)} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            <button onClick={() => exportPDF(filtered)} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Alerts', value: counts.total, variant: 'default' as const },
            { label: 'Active', value: counts.active, variant: 'danger' as const },
            { label: 'Critical', value: counts.critical, variant: 'danger' as const },
            { label: 'High', value: counts.high, variant: 'warning' as const },
          ].map(c => (
            <div key={c.label} className={`rounded-lg border p-3 ${
              c.variant === 'danger' ? 'border-destructive/30 bg-destructive/5' :
              c.variant === 'warning' ? 'border-warning/30 bg-warning/5' :
              'border-border bg-card'
            }`}>
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold font-mono mt-1">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts by title, IP, or type..."
              className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {SEVERITIES.map(s => (
              <button
                key={s}
                onClick={() => toggleSeverity(s)}
                className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase transition-all ${
                  severityFilter.has(s)
                    ? `${severityConfig[s].bg} ${severityConfig[s].color} ${severityConfig[s].border} border`
                    : 'bg-secondary/30 text-muted-foreground border border-transparent opacity-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {(['all', 'active', 'resolved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[10px] font-medium uppercase transition-colors ${
                  statusFilter === s ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Alert list */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Shield className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No alerts match your filters</p>
                </div>
              )}
              {filtered.map(alert => {
                const config = severityConfig[alert.severity];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`border-b border-border/50 p-4 hover:bg-secondary/20 transition-colors ${alert.resolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-md p-1.5 mt-0.5 shrink-0 ${config.bg}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${alert.resolved ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {alert.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">{alert.description}</p>
                          </div>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className={`shrink-0 flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${
                              alert.resolved
                                ? 'border-success/30 bg-success/10 text-success'
                                : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                          >
                            {alert.resolved ? <><Check className="h-3 w-3" /> Resolved</> : <><X className="h-3 w-3" /> Resolve</>}
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${config.color} ${config.bg}`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">{alert.srcIp}</span>
                          <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">{alert.attackType}</span>
                          <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                            {alert.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="border-t border-border px-4 py-2 flex items-center justify-between bg-secondary/30">
            <span className="text-[10px] text-muted-foreground font-mono">
              Showing {filtered.length} of {alerts.length} alerts
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
