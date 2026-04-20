package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/gorilla/websocket"
)

type TrafficEntry struct {
	ID             string    `json:"id"`
	Timestamp      time.Time `json:"timestamp"`
	SrcIP          string    `json:"srcIp"`
	DstIP          string    `json:"dstIp"`
	SrcPort        int       `json:"srcPort"`
	DstPort        int       `json:"dstPort"`
	Protocol       string    `json:"protocol"`
	PacketSize     int       `json:"packetSize"`
	Classification string    `json:"classification"`
	Confidence     float64   `json:"confidence"`
	Severity       string    `json:"severity"`
	Flagged        bool      `json:"flagged"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin for development
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan TrafficEntry, 1000) // Increased buffer size

func generateDemoData() {
	// Wait 1 second for real packet capture to start
	time.Sleep(1 * time.Second)

	fmt.Println("Generating continuous demo traffic data...")

	// Demo IPs and traffic patterns
	ips := []string{"192.168.1.100", "10.0.0.50", "172.16.0.25", "8.8.8.8", "1.1.1.1", "203.0.113.42"}
	dstIPs := []string{"8.8.8.8", "1.1.1.1", "203.0.113.42", "151.101.1.140", "142.250.190.14"}
	protocols := []string{"TCP", "UDP", "ICMP"}

	demoCounter := 0
	for {
		// Generate data continuously at a slower, more natural rate
		demoCounter++

		srcIP := ips[demoCounter%len(ips)]
		dstIP := dstIPs[demoCounter%len(dstIPs)]
		protocol := protocols[demoCounter%len(protocols)]

		// Generate realistic packet sizes (mostly small, occasionally large)
		baseSize := 64 + (demoCounter * 13 % 400)
		packetSize := baseSize

		// Only 5% of packets are large
		if demoCounter%20 == 0 {
			packetSize = 1400 + (demoCounter % 200)
		}

		// Determine classification - about 3-5% are suspicious with occasional higher severity
		classification := "Normal"
		flagged := false
		severity := "low"
		confidence := 0.85 + (float64(demoCounter%15) / 100.0)

		if packetSize > 1300 {
			classification = "Large Packet"
			severity = "medium"
			flagged = true
			confidence = 0.78
		} else if demoCounter%50 == 0 {
			classification = "Suspicious"
			severity = "critical"
			flagged = true
			confidence = 0.68
		} else if demoCounter%30 == 0 {
			classification = "Suspicious"
			severity = "high"
			flagged = true
			confidence = 0.70
		} else if demoCounter%15 == 0 { // About 6.7% are suspicious (more natural rate)
			classification = "Suspicious"
			severity = "medium"
			flagged = true
			confidence = 0.72
		}

		entry := TrafficEntry{
			ID:             fmt.Sprintf("demo-%d", demoCounter),
			Timestamp:      time.Now(),
			SrcIP:          srcIP,
			DstIP:          dstIP,
			SrcPort:        1024 + (demoCounter*567)%60000,
			DstPort:        80 + (demoCounter % 443),
			Protocol:       protocol,
			PacketSize:     packetSize,
			Classification: classification,
			Confidence:     confidence,
			Severity:       severity,
			Flagged:        flagged,
		}

		select {
		case broadcast <- entry:
			if demoCounter%500 == 0 {
				fmt.Printf("Demo data: sent %d packets\n", demoCounter)
			}
		default:
			fmt.Println("Broadcast channel full, dropping packet")
		}

		// Send 1 packet every 250ms for natural, slow data flow
		time.Sleep(250 * time.Millisecond)
	}
}

func main() {
	// Start packet capture in a goroutine
	go capturePackets()

	// Start demo data generator (in case real packets aren't captured)
	go generateDemoData()

	// Start WebSocket server
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Sentinel Backend Server Running")
	})

	// Start broadcasting goroutine
	go handleBroadcast()

	fmt.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func capturePackets() {
	// Find all devices
	devices, err := pcap.FindAllDevs()
	if err != nil {
		log.Fatal(err)
	}

	if len(devices) == 0 {
		log.Fatal("No devices found")
	}

	// Use the first device (usually the main network interface)
	device := devices[0].Name
	fmt.Printf("Using device: %s\n", device)

	// Open device for live capture
	handle, err := pcap.OpenLive(device, 1600, true, pcap.BlockForever)
	if err != nil {
		log.Fatal(err)
	}
	defer handle.Close()

	// Try to set filter, but continue if it fails
	err = handle.SetBPFFilter("tcp or udp or icmp")
	if err != nil {
		fmt.Printf("Warning: BPF filter failed, capturing all packets: %v\n", err)
		// Continue without filter
	}

	fmt.Println("Starting packet capture...")
	fmt.Println("Waiting for packets...")

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	packets := packetSource.Packets()

	for packet := range packets {
		processPacket(packet)
	}
}

var packetCount int = 0

func processPacket(packet gopacket.Packet) {
	packetCount++
	var srcIP, dstIP string
	var srcPort, dstPort int
	var protocol string
	var packetSize int

	// Get packet size
	packetSize = len(packet.Data())

	// Parse IP layer (both IPv4 and IPv6)
	ipLayer := packet.Layer(layers.LayerTypeIPv4)
	if ipLayer != nil {
		ip, _ := ipLayer.(*layers.IPv4)
		srcIP = ip.SrcIP.String()
		dstIP = ip.DstIP.String()
	} else {
		ipLayer = packet.Layer(layers.LayerTypeIPv6)
		if ipLayer != nil {
			ip, _ := ipLayer.(*layers.IPv6)
			srcIP = ip.SrcIP.String()
			dstIP = ip.DstIP.String()
		}
	}

	// Default assignment
	if srcIP == "" {
		srcIP = "0.0.0.0"
	}
	if dstIP == "" {
		dstIP = "0.0.0.0"
	}

	// Parse transport layer
	if tcpLayer := packet.Layer(layers.LayerTypeTCP); tcpLayer != nil {
		tcp, _ := tcpLayer.(*layers.TCP)
		srcPort = int(tcp.SrcPort)
		dstPort = int(tcp.DstPort)
		protocol = "TCP"
	} else if udpLayer := packet.Layer(layers.LayerTypeUDP); udpLayer != nil {
		udp, _ := udpLayer.(*layers.UDP)
		srcPort = int(udp.SrcPort)
		dstPort = int(udp.DstPort)
		protocol = "UDP"
	} else if icmpLayer := packet.Layer(layers.LayerTypeICMPv4); icmpLayer != nil {
		protocol = "ICMP"
		srcPort = 0
		dstPort = 0
	} else {
		protocol = "Unknown"
	}

	// Simple threat detection (placeholder - you would implement ML here)
	classification := "Normal"
	severity := "low"
	flagged := false
	confidence := 0.95

	// Basic rules for demonstration
	if packetSize > 1400 {
		classification = "Large Packet"
		severity = "medium"
		flagged = true
		confidence = 0.75
	}

	entry := TrafficEntry{
		ID:             fmt.Sprintf("packet-%d", time.Now().UnixNano()),
		Timestamp:      time.Now(),
		SrcIP:          srcIP,
		DstIP:          dstIP,
		SrcPort:        srcPort,
		DstPort:        dstPort,
		Protocol:       protocol,
		PacketSize:     packetSize,
		Classification: classification,
		Confidence:     confidence,
		Severity:       severity,
		Flagged:        flagged,
	}

	// Log packet count every 10 packets
	if packetCount%10 == 0 {
		fmt.Printf("Processed %d packets\n", packetCount)
	}

	// Send to broadcast channel
	select {
	case broadcast <- entry:
	default:
		// Channel full, skip this packet
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	// Add client to clients map
	clients[conn] = true
	fmt.Println("New WebSocket client connected")

	// Remove client when function returns
	defer func() {
		delete(clients, conn)
		fmt.Println("WebSocket client disconnected")
	}()

	// Keep connection alive
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

func handleBroadcast() {
	for {
		entry := <-broadcast

		// Convert to JSON
		data, err := json.Marshal(entry)
		if err != nil {
			log.Println("JSON marshal error:", err)
			continue
		}

		// Send to all connected clients
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				log.Println("WebSocket write error:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
