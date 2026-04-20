import { Shield, Activity, AlertTriangle, FileText, Settings, BarChart3, Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Activity, label: 'Dashboard', path: '/' },
  { icon: Globe, label: 'Traffic Monitor', path: '/traffic-monitor' },
  { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Logs', path: '/logs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-border bg-sidebar py-4 lg:w-56">
      <div className="flex items-center gap-2.5 px-4 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-primary">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <span className="hidden lg:block text-sm font-bold text-gradient-primary tracking-tight">SENTINEL IDS</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 w-full px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => path !== '#' && navigate(path)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all w-full ${
                active
                  ? 'bg-primary/10 text-primary glow-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 w-full">
        <div className="rounded-lg border border-border bg-secondary/50 p-3 hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
            <span className="text-[10px] font-mono text-success">SYSTEM ONLINE</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground font-mono">ML Engine v2.4.1</p>
        </div>
      </div>
    </aside>
  );
}
