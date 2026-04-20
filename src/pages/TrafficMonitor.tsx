import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Wifi, WifiOff, ArrowUpDown, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TrafficTable } from '@/components/dashboard/TrafficTable';
import {
  type TrafficEntry, type Protocol,
} from '@/lib/mock-data';

export default function TrafficMonitor() {
  const [entries, setEntries] = useState<TrafficEntry[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isMonitoring) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isMonitoring]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to traffic monitoring server');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const entry: TrafficEntry = JSON.parse(event.data);
          // Convert timestamp string to Date object
          entry.timestamp = new Date(entry.timestamp);
          setEntries(prev => [entry, ...prev.slice(0, 199)]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from traffic monitoring server');
        setIsConnected(false);
        setIsMonitoring(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsMonitoring(false);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsMonitoring(false);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const stats = {
    totalPackets: entries.length,
    activeConnections: entries.filter(e => e.timestamp > new Date(Date.now() - 30000)).length,
    flaggedPackets: entries.filter(e => e.flagged).length,
    dataTransferred: entries.reduce((sum, e) => sum + e.packetSize, 0),
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
                <Globe className="h-6 w-6 text-primary" />
                Traffic Monitor
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time network traffic analysis and monitoring
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Connected to monitoring server' : 'Disconnected from server'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleMonitoring}
                disabled={!isConnected && isMonitoring}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMonitoring
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'bg-success/10 text-success hover:bg-success/20'
                }`}
              >
                {isMonitoring ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Packets</p>
                  <p className="text-lg font-semibold">{stats.totalPackets.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Wifi className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Connections</p>
                  <p className="text-lg font-semibold">{stats.activeConnections}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Filter className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flagged Packets</p>
                  <p className="text-lg font-semibold">{stats.flaggedPackets}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data Transferred</p>
                  <p className="text-lg font-semibold">{(stats.dataTransferred / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Traffic Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TrafficTable entries={entries} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}