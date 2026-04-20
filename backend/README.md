# Sentinel AI Backend

Real-time network traffic monitoring and analysis backend service.

## Requirements

- Go 1.19 or later
- Administrator privileges (required for packet capture)
- Windows/Linux/macOS

## Dependencies

```bash
go get github.com/google/gopacket/pcap
go get github.com/google/gopacket
go get github.com/google/gopacket/layers
go get github.com/gorilla/websocket
```

## Building

```bash
go build -o sentinel-backend.exe main.go
```

## Running

**IMPORTANT**: Packet capture requires administrator/root privileges.

### Windows (Run as Administrator)
```powershell
# Right-click the executable and "Run as administrator"
# Or from elevated command prompt:
.\sentinel-backend.exe
```

### Linux/macOS
```bash
sudo ./sentinel-backend
```

## API

### WebSocket Endpoint
- **URL**: `ws://localhost:8080/ws`
- **Protocol**: WebSocket
- **Data Format**: JSON

### Packet Data Structure
```json
{
  "id": "packet-1234567890",
  "timestamp": "2024-01-01T12:00:00Z",
  "srcIp": "192.168.1.100",
  "dstIp": "8.8.8.8",
  "srcPort": 54321,
  "dstPort": 53,
  "protocol": "UDP",
  "packetSize": 512,
  "classification": "Normal",
  "confidence": 0.95,
  "severity": "low",
  "flagged": false
}
```

## Features

- Real-time packet capture from network interface
- TCP/UDP/ICMP protocol parsing
- Basic threat detection (configurable)
- WebSocket streaming to frontend
- Cross-platform support

## Security Notes

- Only captures packet headers, not payload data
- Runs with minimal required privileges
- Designed for network monitoring/analysis purposes
- Not intended for production use without additional security measures