import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import type { TrafficEntry, Protocol } from '@/lib/mock-data';

interface TrafficTableProps {
  entries: TrafficEntry[];
}

export function TrafficTable({ entries }: TrafficTableProps) {
  const [search, setSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<Protocol | 'ALL'>('ALL');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const filtered = entries.filter(e => {
    if (search && !e.srcIp.includes(search) && !e.dstIp.includes(search) && !e.classification.toLowerCase().includes(search.toLowerCase())) return false;
    if (protocolFilter !== 'ALL' && e.protocol !== protocolFilter) return false;
    if (showFlaggedOnly && !e.flagged) return false;
    return true;
  }).slice(-100).reverse();

  const exportCSV = (data: TrafficEntry[]) => {
    const header = 'Time,Source IP,Source Port,Destination IP,Destination Port,Protocol,Packet Size,Classification,Confidence,Severity,Flagged\n';
    const rows = data.map(e =>
      `"${e.timestamp.toISOString()}","${e.srcIp}","${e.srcPort}","${e.dstIp}","${e.dstPort}","${e.protocol}","${e.packetSize}","${e.classification}","${(e.confidence * 100).toFixed(1)}%","${e.severity}","${e.flagged}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentinel-traffic-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = (data: TrafficEntry[]) => {
    const doc = new jsPDF();
    
    // Set up document
    doc.setFontSize(20);
    doc.setTextColor(34, 211, 238); // Cyan color for title
    doc.text('SENTINEL IDS', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Gray color
    doc.text(`Traffic Report • Generated ${new Date().toLocaleString()} • ${data.length} entries`, 20, 45);
    
    // Table headers
    const headers = ['Time', 'Source', 'Dest', 'Proto', 'Size', 'Class', 'Conf', 'Sev'];
    let yPosition = 60;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFillColor(30, 41, 59); // Dark header background
    doc.rect(20, yPosition - 5, 170, 8, 'F');
    
    headers.forEach((header, index) => {
      const xPos = 25 + (index * 20);
      doc.text(header, xPos, yPosition);
    });
    
    yPosition += 10;
    
    // Table data
    doc.setFontSize(8);
    data.forEach((entry, index) => {
      if (yPosition > 270) { // New page if needed
        doc.addPage();
        yPosition = 30;
      }
      
      const time = entry.timestamp.toLocaleTimeString();
      const source = `${entry.srcIp}:${entry.srcPort}`;
      const dest = `${entry.dstIp}:${entry.dstPort}`;
      const proto = entry.protocol;
      const size = `${entry.packetSize}B`;
      const classification = entry.classification.length > 12 ? entry.classification.substring(0, 9) + '...' : entry.classification;
      const confidence = `${(entry.confidence * 100).toFixed(0)}%`;
      const severity = entry.severity.toUpperCase();
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(15, 23, 42); // Dark row
        doc.rect(20, yPosition - 3, 170, 6, 'F');
      }
      
      // Set text colors
      const severityColor = entry.severity === 'critical' ? [252, 165, 165] :
                           entry.severity === 'high' ? [252, 165, 165] :
                           entry.severity === 'medium' ? [251, 191, 36] : [147, 197, 253];
      
      const classColor = entry.flagged ? [248, 113, 113] : [74, 222, 128];
      
      doc.setTextColor(203, 213, 225); // Light text
      doc.text(time, 25, yPosition);
      doc.text(source.length > 15 ? source.substring(0, 12) + '...' : source, 45, yPosition);
      doc.text(dest.length > 15 ? dest.substring(0, 12) + '...' : dest, 65, yPosition);
      doc.text(proto, 85, yPosition);
      doc.text(size, 105, yPosition);
      
      doc.setTextColor(classColor[0], classColor[1], classColor[2]);
      doc.text(classification, 125, yPosition);
      
      doc.setTextColor(203, 213, 225);
      doc.text(confidence, 145, yPosition);
      
      doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
      doc.text(severity, 165, yPosition);
      
      yPosition += 8;
    });
    
    // Save the PDF
    doc.save(`sentinel-traffic-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const severityDot = (s: string) => {
    const colors: Record<string, string> = { low: 'bg-threat-low', medium: 'bg-threat-medium', high: 'bg-threat-high', critical: 'bg-threat-critical' };
    return colors[s] || 'bg-muted-foreground';
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search IP, classification..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <select
          value={protocolFilter}
          onChange={e => setProtocolFilter(e.target.value as Protocol | 'ALL')}
          className="rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground outline-none"
        >
          <option value="ALL">All Protocols</option>
          {['TCP','UDP','ICMP','HTTP','HTTPS','DNS','SSH','FTP'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            showFlaggedOnly ? 'border-destructive/50 bg-destructive/10 text-destructive' : 'border-border bg-secondary text-muted-foreground'
          }`}
        >
          <Filter className="h-3 w-3" />
          Flagged Only
        </button>
        <button onClick={() => exportCSV(filtered)} className="ml-auto flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-3 w-3" />
          CSV
        </button>
        <button onClick={() => exportPDF(filtered)} className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-3 w-3" />
          PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Time</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">Destination</th>
              <th className="px-4 py-2.5 font-medium">Protocol</th>
              <th className="px-4 py-2.5 font-medium">Size</th>
              <th className="px-4 py-2.5 font-medium">Classification</th>
              <th className="px-4 py-2.5 font-medium">Confidence</th>
              <th className="px-4 py-2.5 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <motion.tr
                key={entry.id}
                initial={i < 3 ? { opacity: 0, backgroundColor: 'hsl(187, 100%, 50%, 0.05)' } : {}}
                animate={{ opacity: 1, backgroundColor: 'transparent' }}
                className={`border-b border-border/50 font-mono transition-colors hover:bg-secondary/50 ${
                  entry.flagged ? 'bg-destructive/[0.02]' : ''
                }`}
              >
                <td className="px-4 py-2 text-muted-foreground">{entry.timestamp.toLocaleTimeString()}</td>
                <td className="px-4 py-2">{entry.srcIp}<span className="text-muted-foreground">:{entry.srcPort}</span></td>
                <td className="px-4 py-2">{entry.dstIp}<span className="text-muted-foreground">:{entry.dstPort}</span></td>
                <td className="px-4 py-2">
                  <span className="rounded bg-secondary px-1.5 py-0.5">{entry.protocol}</span>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{entry.packetSize}B</td>
                <td className="px-4 py-2">
                  <span className={entry.flagged ? 'text-destructive font-semibold' : 'text-success'}>
                    {entry.classification}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-12 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${entry.flagged ? 'bg-destructive' : 'bg-primary'}`}
                        style={{ width: `${entry.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground">{(entry.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${severityDot(entry.severity)}`} />
                    <span className="capitalize text-muted-foreground">{entry.severity}</span>
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
