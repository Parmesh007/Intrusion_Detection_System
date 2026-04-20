# Sentinel AI - Real-Time Network Traffic Monitor

A comprehensive network intrusion detection and monitoring system with real-time packet capture and analysis.

## Features

- **Real-Time Packet Capture**: Captures live network traffic from your network interface
- **Protocol Analysis**: Supports TCP, UDP, ICMP, and other network protocols
- **Threat Detection**: Basic anomaly detection and threat classification
- **Live Dashboard**: Real-time visualization of network traffic and alerts
- **WebSocket Streaming**: Live data streaming from backend to frontend

## Architecture

- **Frontend**: React + TypeScript + Vite (Dashboard UI)
- **Backend**: Go + gopacket (Packet capture and analysis)
- **Communication**: WebSocket for real-time data streaming

## Prerequisites

- **Go 1.19+** (for backend)
- **Node.js 18+** (for frontend)
- **Administrator/Root privileges** (required for packet capture, but demo mode works without)

## Installation

### Backend Setup

```bash
cd backend
go mod tidy
go build -o sentinel-backend.exe main.go
```

### Frontend Setup

```bash
npm install
# or
bun install
```

## Running the Application

### Important Note
**The backend server stops when VS Code is closed.** You must restart it each time you reopen the project using `npm run start`.

### Step 1: Start Both Backend and Frontend

```bash
npm run start
```

This command will:
- Start the Go backend server on `http://localhost:8080`
- Start the React frontend on `http://localhost:5173` (or next available port)

### Step 2: Open Your Browser

Navigate to the frontend URL displayed in the terminal (usually `http://localhost:5173`).

### Alternative: Start Components Separately

- **Frontend only**: `npm run dev`
- **Backend only**: `npm run backend:run`

## Development

- Run tests: `npm test`
- Build for production: `npm run build`
.\run-server.ps1
```

**Linux/macOS:**
```bash
cd backend
sudo ./sentinel-backend
```

The backend will start on `http://localhost:8090` with WebSocket endpoint at `ws://localhost:8090/ws`.

### Step 2: Start the Frontend

In a new terminal:

```bash
npm run dev
# or
bun run dev
```

The frontend will be available at `http://localhost:5173`.

## Usage

1. **Start Backend**: Run the backend server with administrator privileges
2. **Start Frontend**: Launch the React dashboard
3. **Monitor Traffic**: The dashboard will automatically connect and display real network traffic
4. **View Analytics**: Check the Traffic Monitor page for detailed packet analysis

## Security & Permissions

⚠️ **Important Security Notes:**

- Packet capture requires elevated system privileges
- Only captures packet headers (no payload data)
- Designed for network monitoring and analysis
- Test in isolated environments first
- Not recommended for production use without additional security measures

## Development

### Backend Development
- Modify `backend/main.go` for packet processing logic
- Add custom threat detection algorithms
- Extend protocol support

### Frontend Development
- Dashboard components in `src/components/dashboard/`
- Real-time updates via WebSocket
- Charts and visualizations in `src/pages/`

## Troubleshooting

### Backend Issues
- **"Permission denied"**: Run with administrator/root privileges
- **"No devices found"**: Check network interfaces with `ipconfig` (Windows) or `ifconfig` (Linux)
- **WebSocket connection failed**: Ensure backend is running on port 8080

### Frontend Issues
- **WebSocket connection failed**: Check if backend is running
- **No data displayed**: Verify backend is capturing packets
- **Build errors**: Run `npm install` to install dependencies

## Network Interface Selection

The backend automatically selects the first available network interface. To monitor a specific interface:

```go
// In main.go, modify the device selection
devices, err := pcap.FindAllDevs()
if err != nil {
    log.Fatal(err)
}

// Print available devices
for i, device := range devices {
    fmt.Printf("%d: %s\n", i, device.Name)
}

// Select specific device
device := devices[1].Name // Change index as needed
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with real network traffic
5. Submit a pull request

## License

This project is for educational and research purposes. Use responsibly and in compliance with applicable laws and regulations.
