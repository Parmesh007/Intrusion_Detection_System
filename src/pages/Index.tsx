import { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Activity, Eye } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { TrafficTable } from '@/components/dashboard/TrafficTable';
import { ProtocolChart } from '@/components/dashboard/ProtocolChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import {
  generateAlert,
  getTrafficTimeSeries,
  getProtocolDistribution,
  getAttackTypeDistribution,
  type TrafficEntry,
  type Alert,
} from '@/lib/mock-data';
import { loadAlertsFromStorage, saveAlertsToStorage } from '@/lib/storage';

const Dashboard = () => {
  const [entries, setEntries] = useState<TrafficEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(() => loadAlertsFromStorage());
  const [isConnected, setIsConnected] = useState(false);
  const [totalPackets, setTotalPackets] = useState(0);
  const [totalThreats, setTotalThreats] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
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

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Dashboard connected to traffic monitoring server');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const entry: TrafficEntry = JSON.parse(event.data);
          // Convert timestamp string to Date object
          entry.timestamp = new Date(entry.timestamp);
          setEntries(prev => [...prev.slice(-500), entry]);
          
          // Update cumulative counters
          setTotalPackets(prev => prev + 1);
          
          if (entry.flagged) {
            setTotalThreats(prev => prev + 1);
            const alert = generateAlert(entry);
            setAlerts(prev => [...prev.slice(-100), alert]);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Dashboard disconnected from traffic monitoring server');
        setIsConnected(false);
        // Try to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      // Try to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    }
  };

  const threats = entries.filter(e => e.flagged).length;
  const criticalAlerts = entries.filter(
    e => e.flagged && (e.severity === 'high' || e.severity === 'critical')
  ).length;
  const timeSeries = getTrafficTimeSeries(entries, 20);
  const protocolData = getProtocolDistribution(entries);
  const attackData = getAttackTypeDistribution(entries);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="scan-line pointer-events-none fixed inset-0 z-50 h-[200%]" />
      <Sidebar />
      <main className="ml-16 lg:ml-56 p-4 lg:p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Threat Dashboard</h1>
            <p className="text-xs text-muted-foreground font-mono">
              Last updated: {new Date().toLocaleTimeString()} • Model: Real-time Packet Analysis
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive animate-pulse'}`} />
            <span className="text-xs font-mono text-primary">
              {isConnected ? 'LIVE MONITORING' : 'CONNECTING...'}
            </span>
          </div>
        </header>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
          <StatsCard
            title="Total Packets"
            value={totalPackets.toLocaleString()}
            change="+12.5% from last hour"
            changeType="neutral"
            icon={Activity}
          />
          <StatsCard
            title="Threats Detected"
            value={threats}
            change={`${((threats / totalPackets) * 100).toFixed(1)}% of traffic`}
            changeType="up"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Critical Alerts"
            value={criticalAlerts}
            change="Requires attention"
            changeType="up"
            icon={Shield}
            variant="danger"
          />
          <StatsCard
            title="Active Monitors"
            value="8 / 8"
            change="All systems operational"
            changeType="down"
            icon={Eye}
            variant="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          <div className="lg:col-span-2">
            <TrafficChart data={timeSeries} />
          </div>
          <AlertPanel alerts={alerts} />
        </div>

        <div className="grid gap-4 lg:grid-cols-4 mb-4">
          <div className="lg:col-span-2">
            <ProtocolChart data={protocolData} />
          </div>
          <div className="lg:col-span-2">
            <AttackChart data={attackData} />
          </div>
        </div>

        <TrafficTable entries={entries} />
      </main>
    </div>
  );
};

export default Dashboard;
