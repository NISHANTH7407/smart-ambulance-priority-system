# 🚀 QUICK START GUIDE

## Start the System (Windows)

### Method 1: Double-click
```
start.bat
```

### Method 2: Manual
```bash
# Terminal 1
cd backend
mvn spring-boot:run

# Terminal 2  
cd frontend
npm run dev
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api/signals |
| H2 Console | http://localhost:8080/h2-console |
| WebSocket Test | Open test-websocket.html |

---

## H2 Database Login

```
JDBC URL: jdbc:h2:mem:ambulance_db
Username: sa
Password: (empty)
```

---

## Test Commands

### Get Signals
```bash
curl http://localhost:8080/api/signals
```

### Send Location
```bash
curl -X POST http://localhost:8080/api/ambulance/location ^
  -H "Content-Type: application/json" ^
  -d "{\"lat\":12.9716,\"lng\":77.5946,\"speed\":45}"
```

---

## Demo Flow

1. ✅ Start backend (wait for "Started AmbulanceApplication")
2. ✅ Start frontend (opens at localhost:5173)
3. ✅ Click "START EMERGENCY" button
4. ✅ Allow location access
5. ✅ Watch signals turn GREEN when < 300m
6. ✅ Show alert popup
7. ✅ Open H2 console to show database
8. ✅ Open test-websocket.html to show real-time updates

---

## Override Location (Chrome DevTools)

1. Press F12
2. Press Ctrl+Shift+P
3. Type "Sensors"
4. Set custom location:
   - **Signal 1:** 12.9716, 77.5946
   - **Signal 2:** 12.9750, 77.5980
   - **Signal 3:** 12.9800, 77.6000

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | `netstat -ano \| findstr :8080` then kill process |
| Frontend won't start | `cd frontend && npm install` |
| Map not showing | Check internet connection (needs OpenStreetMap) |
| WebSocket error | Restart backend, clear browser cache |

---

## Key Features to Highlight

✅ Real-time tracking (3-second intervals)  
✅ Automatic GREEN signal < 300m  
✅ WebSocket live updates  
✅ AI time estimation (peak hours)  
✅ Interactive map with markers  
✅ Emergency alert popup  
✅ Responsive dashboard  
✅ H2 in-memory database  

---

## Tech Stack

**Backend:** Java 17, Spring Boot, WebSocket, JPA, H2  
**Frontend:** React, TypeScript, Leaflet, Tailwind, Vite  
**Real-time:** SockJS + STOMP  

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/signals | Get all signals |
| POST | /api/ambulance/location | Update location |
| WS | /ws → /topic/signals | Real-time updates |

---

## Project Structure

```
thooral-hacathon/
├── backend/          # Spring Boot
├── frontend/         # React + Vite
├── README.md         # Full documentation
├── FIXES.md          # All fixes applied
├── start.bat         # Quick start script
└── test-websocket.html  # WebSocket tester
```

---

## Distance Calculation

**Haversine Formula** - Accurate to meters
```
If distance < 300m → Signal = GREEN
Else → Signal = RED
```

---

## AI Time Estimation

```
Base delay: 2 minutes
Peak hours (5PM-9PM): Traffic factor = 2
Off-peak: Traffic factor = 1
Time saved = Base + Traffic factor
```

---

## Demo Script

**"This is a Smart Ambulance Priority System that automatically turns traffic signals GREEN when an ambulance is within 300 meters."**

1. Show backend running
2. Show frontend dashboard
3. Click START EMERGENCY
4. Show map tracking
5. Show signal turning GREEN
6. Show alert popup
7. Show H2 database updates
8. Show WebSocket test page
9. Explain AI time estimation
10. Show responsive design

---

## Winning Points

🏆 **Real-time WebSocket** - Not just polling  
🏆 **Accurate distance** - Haversine formula  
🏆 **AI intelligence** - Traffic-aware estimation  
🏆 **Production-ready** - Clean code, proper structure  
🏆 **Full-stack** - Backend + Frontend + Database  
🏆 **Live demo** - Actually works!  

---

**Ready to win! 🚀**
