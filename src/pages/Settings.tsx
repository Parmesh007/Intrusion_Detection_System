import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Database,
  Zap,
  User,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
  AlertTriangle,
  Clock,
  HardDrive,
  Wifi,
  Lock
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

type SettingsSection = {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
};

const settingsSections: SettingsSection[] = [
  { id: 'network', title: 'Network Monitoring', description: 'Configure network interfaces and monitoring settings', icon: Globe },
  { id: 'security', title: 'Security Policies', description: 'Define security rules and threat detection parameters', icon: Shield },
  { id: 'alerts', title: 'Alert Configuration', description: 'Customize alert thresholds and notification settings', icon: Bell },
  { id: 'performance', title: 'Performance', description: 'Optimize system performance and resource usage', icon: Zap },
  { id: 'data', title: 'Data Management', description: 'Configure data retention and storage settings', icon: Database },
  { id: 'system', title: 'System', description: 'General system settings and maintenance', icon: SettingsIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('network');
  const [settings, setSettings] = useState({
    // Network settings
    networkInterface: 'eth0',
    monitoringEnabled: true,
    promiscuousMode: false,
    captureFilter: 'tcp or udp',
    maxPacketSize: 1514,
    bufferSize: 1024,

    // Security settings
    signatureUpdates: true,
    autoBlockEnabled: false,
    blockDuration: 3600,
    threatLevelThreshold: 'medium',
    customRulesEnabled: false,
    anomalyDetection: true,

    // Alert settings
    emailNotifications: true,
    emailRecipient: 'admin@sentinel.local',
    smsNotifications: false,
    smsRecipient: '',
    alertRetentionDays: 30,
    criticalAlertsOnly: false,
    alertCooldown: 300,

    // Performance settings
    maxConnections: 10000,
    processingThreads: 4,
    memoryLimit: 2048,
    cpuLimit: 80,
    logLevel: 'info',
    compressionEnabled: true,

    // Data settings
    dataRetentionDays: 90,
    backupEnabled: true,
    backupFrequency: 'daily',
    exportFormat: 'json',
    encryptionEnabled: true,
    compressionLevel: 'medium',

    // System settings
    autoUpdates: true,
    maintenanceMode: false,
    debugMode: false,
    timezone: 'UTC',
    language: 'en',
    theme: 'dark',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Settings saved:', settings);
    // Show success message
  };

  const resetToDefaults = () => {
    // Reset to default values
    setSettings({
      networkInterface: 'eth0',
      monitoringEnabled: true,
      promiscuousMode: false,
      captureFilter: 'tcp or udp',
      maxPacketSize: 1514,
      bufferSize: 1024,
      signatureUpdates: true,
      autoBlockEnabled: false,
      blockDuration: 3600,
      threatLevelThreshold: 'medium',
      customRulesEnabled: false,
      anomalyDetection: true,
      emailNotifications: true,
      emailRecipient: 'admin@sentinel.local',
      smsNotifications: false,
      smsRecipient: '',
      alertRetentionDays: 30,
      criticalAlertsOnly: false,
      alertCooldown: 300,
      maxConnections: 10000,
      processingThreads: 4,
      memoryLimit: 2048,
      cpuLimit: 80,
      logLevel: 'info',
      compressionEnabled: true,
      dataRetentionDays: 90,
      backupEnabled: true,
      backupFrequency: 'daily',
      exportFormat: 'json',
      encryptionEnabled: true,
      compressionLevel: 'medium',
      autoUpdates: true,
      maintenanceMode: false,
      debugMode: false,
      timezone: 'UTC',
      language: 'en',
      theme: 'dark',
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-56 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <SettingsIcon className="h-6 w-6 text-primary" />
                System Settings
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Configure and customize your Sentinel IDS system
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefaults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Network Settings */}
            <TabsContent value="network" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Network Monitoring Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure network interfaces and packet capture settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="networkInterface">Network Interface</Label>
                      <Select value={settings.networkInterface} onValueChange={(value) => updateSetting('networkInterface', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eth0">eth0</SelectItem>
                          <SelectItem value="eth1">eth1</SelectItem>
                          <SelectItem value="wlan0">wlan0</SelectItem>
                          <SelectItem value="any">any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPacketSize">Max Packet Size (bytes)</Label>
                      <Input
                        id="maxPacketSize"
                        type="number"
                        value={settings.maxPacketSize}
                        onChange={(e) => updateSetting('maxPacketSize', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captureFilter">Capture Filter</Label>
                    <Input
                      id="captureFilter"
                      value={settings.captureFilter}
                      onChange={(e) => updateSetting('captureFilter', e.target.value)}
                      placeholder="tcp or udp"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monitoring Enabled</Label>
                      <p className="text-sm text-muted-foreground">Enable real-time network monitoring</p>
                    </div>
                    <Switch
                      checked={settings.monitoringEnabled}
                      onCheckedChange={(checked) => updateSetting('monitoringEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Promiscuous Mode</Label>
                      <p className="text-sm text-muted-foreground">Capture all packets on the network</p>
                    </div>
                    <Switch
                      checked={settings.promiscuousMode}
                      onCheckedChange={(checked) => updateSetting('promiscuousMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Policies
                  </CardTitle>
                  <CardDescription>
                    Configure threat detection and response policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="threatLevelThreshold">Threat Level Threshold</Label>
                      <Select value={settings.threatLevelThreshold} onValueChange={(value) => updateSetting('threatLevelThreshold', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blockDuration">Auto-Block Duration (seconds)</Label>
                      <Input
                        id="blockDuration"
                        type="number"
                        value={settings.blockDuration}
                        onChange={(e) => updateSetting('blockDuration', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Signature Updates</Label>
                      <p className="text-sm text-muted-foreground">Automatically download signature updates</p>
                    </div>
                    <Switch
                      checked={settings.signatureUpdates}
                      onCheckedChange={(checked) => updateSetting('signatureUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Block Threats</Label>
                      <p className="text-sm text-muted-foreground">Automatically block detected threats</p>
                    </div>
                    <Switch
                      checked={settings.autoBlockEnabled}
                      onCheckedChange={(checked) => updateSetting('autoBlockEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anomaly Detection</Label>
                      <p className="text-sm text-muted-foreground">Enable machine learning-based anomaly detection</p>
                    </div>
                    <Switch
                      checked={settings.anomalyDetection}
                      onCheckedChange={(checked) => updateSetting('anomalyDetection', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Custom Rules</Label>
                      <p className="text-sm text-muted-foreground">Enable custom detection rules</p>
                    </div>
                    <Switch
                      checked={settings.customRulesEnabled}
                      onCheckedChange={(checked) => updateSetting('customRulesEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alert Settings */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alert Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure alert thresholds and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emailRecipient">Email Notifications</Label>
                      <Input
                        id="emailRecipient"
                        type="email"
                        value={settings.emailRecipient}
                        onChange={(e) => updateSetting('emailRecipient', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smsRecipient">SMS Notifications</Label>
                      <Input
                        id="smsRecipient"
                        value={settings.smsRecipient}
                        onChange={(e) => updateSetting('smsRecipient', e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="alertRetentionDays">Alert Retention (days)</Label>
                      <Input
                        id="alertRetentionDays"
                        type="number"
                        value={settings.alertRetentionDays}
                        onChange={(e) => updateSetting('alertRetentionDays', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alertCooldown">Alert Cooldown (seconds)</Label>
                      <Input
                        id="alertCooldown"
                        type="number"
                        value={settings.alertCooldown}
                        onChange={(e) => updateSetting('alertCooldown', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alert notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alert notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Alerts Only</Label>
                      <p className="text-sm text-muted-foreground">Only send notifications for critical alerts</p>
                    </div>
                    <Switch
                      checked={settings.criticalAlertsOnly}
                      onCheckedChange={(checked) => updateSetting('criticalAlertsOnly', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Optimization
                  </CardTitle>
                  <CardDescription>
                    Configure system performance and resource limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxConnections">Max Connections</Label>
                      <Input
                        id="maxConnections"
                        type="number"
                        value={settings.maxConnections}
                        onChange={(e) => updateSetting('maxConnections', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingThreads">Processing Threads</Label>
                      <Input
                        id="processingThreads"
                        type="number"
                        value={settings.processingThreads}
                        onChange={(e) => updateSetting('processingThreads', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                      <Input
                        id="memoryLimit"
                        type="number"
                        value={settings.memoryLimit}
                        onChange={(e) => updateSetting('memoryLimit', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpuLimit">CPU Limit (%)</Label>
                      <Input
                        id="cpuLimit"
                        type="number"
                        value={settings.cpuLimit}
                        onChange={(e) => updateSetting('cpuLimit', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select value={settings.logLevel} onValueChange={(value) => updateSetting('logLevel', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Compression</Label>
                      <p className="text-sm text-muted-foreground">Compress data to save storage space</p>
                    </div>
                    <Switch
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) => updateSetting('compressionEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Settings */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Configure data retention, backups, and storage settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
                      <Input
                        id="dataRetentionDays"
                        type="number"
                        value={settings.dataRetentionDays}
                        onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="exportFormat">Export Format</Label>
                      <Select value={settings.exportFormat} onValueChange={(value) => updateSetting('exportFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="compressionLevel">Compression Level</Label>
                      <Select value={settings.compressionLevel} onValueChange={(value) => updateSetting('compressionLevel', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                    </div>
                    <Switch
                      checked={settings.backupEnabled}
                      onCheckedChange={(checked) => updateSetting('backupEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt stored data for security</p>
                    </div>
                    <Switch
                      checked={settings.encryptionEnabled}
                      onCheckedChange={(checked) => updateSetting('encryptionEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    General system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Updates</Label>
                      <p className="text-sm text-muted-foreground">Automatically download and install updates</p>
                    </div>
                    <Switch
                      checked={settings.autoUpdates}
                      onCheckedChange={(checked) => updateSetting('autoUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}