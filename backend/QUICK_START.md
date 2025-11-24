# Quick Start Guide - Cosmic Vault Backend

## ⚡ 5-Minute Setup

### Step 1: Navigate to Backend Folder
```powershell
cd d:\workspace\CosmicVault_v3.0\backend
```

### Step 2: Install Dependencies
```powershell
npm install
```

This installs:
- `express` - Web framework
- `mssql` - Database driver
- `dotenv` - Environment variables
- `cors` - Cross-origin requests

### Step 3: Configure Environment
Edit `.env` with your MSSQL credentials:
```env
DB_SERVER=localhost
DB_USER=sa
DB_PASS=YourPassword123!
DB_NAME=CosmicVault
PORT=3000
```

### Step 4: Ensure Database Exists
In MSSQL Management Studio, run:
```sql
CREATE DATABASE CosmicVault;
```

Then run the DDL script `CosmicVault_DDL.sql` to create all tables.

### Step 5: Start Server
```powershell
npm start
```

Expected output:
```
✨ Cosmic Vault Backend running on http://localhost:3000
📚 Database: CosmicVault (MSSQL)
```

---

## 🧪 Quick Test

Open PowerShell and test the health endpoint:

```powershell
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "🚀 Cosmic Vault Backend is running!",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

---

## 📡 Common API Calls

### 1. Create a User
```powershell
$body = @{
    username = "astronomer1"
    email = "astronomer1@space.com"
    password = "mypassword123"
} | ConvertTo-Json

curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -Body $body
```

### 2. Get All Users
```powershell
curl http://localhost:3000/users
```

### 3. Create a Constellation
```powershell
$body = @{
    name = "Orion"
    description = "The Hunter"
    rightAscension = "05h 55m"
    declination = "+5° 23'"
} | ConvertTo-Json

curl -X POST http://localhost:3000/constellations `
  -H "Content-Type: application/json" `
  -Body $body
```

### 4. Create a Star Object
```powershell
$body = @{
    name = "Sirius"
    typeId = 1
    constellationId = 1
    rightAscension = "06h 45m"
    declination = "-16° 42'"
    magnitude = -1.46
    distance = 2.64
    starDetails = @{
        surfaceTemperature = 10000
        luminosity = 26.0
        radius = 1.71
        mass = 2.063
    }
} | ConvertTo-Json

curl -X POST http://localhost:3000/objects `
  -H "Content-Type: application/json" `
  -Body $body
```

### 5. Create Observation Log
```powershell
$body = @{
    userId = 1
    objectId = 1
    observationDate = "2024-01-20T22:30:00Z"
    notes = "Excellent night for stargazing"
    equipment = "8 inch telescope"
    seeingCondition = "5/5"
} | ConvertTo-Json

curl -X POST http://localhost:3000/logs `
  -H "Content-Type: application/json" `
  -Body $body
```

---

## 📦 Folder Structure

```
backend/
├── index.js                          # Main server file
├── package.json                      # Dependencies
├── .env                              # Configuration
├── .gitignore                        # Git ignore
├── README.md                         # Full documentation
├── API_TESTS.md                      # Test examples
├── QUICK_START.md                    # This file
└── src/
    ├── config/
    │   └── database.js               # MSSQL connection
    ├── routes/
    │   ├── userRoutes.js
    │   ├── objectTypeRoutes.js
    │   ├── constellationRoutes.js
    │   ├── celestialObjectRoutes.js
    │   └── observationLogRoutes.js
    ├── controllers/
    │   ├── userController.js
    │   ├── objectTypeController.js
    │   ├── constellationController.js
    │   ├── celestialObjectController.js
    │   └── observationLogController.js
    └── models/
        ├── userModel.js
        ├── objectTypeModel.js
        ├── constellationModel.js
        ├── celestialObjectModel.js
        └── observationLogModel.js
```

---

## 🔑 API Endpoint Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server health check |
| GET | `/users` | Get all users |
| POST | `/users` | Create user |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/types` | Get object types |
| POST | `/types` | Create object type |
| DELETE | `/types/:id` | Delete object type |
| GET | `/constellations` | Get constellations |
| POST | `/constellations` | Create constellation |
| GET | `/constellations/:id` | Get constellation by ID |
| PUT | `/constellations/:id` | Update constellation |
| DELETE | `/constellations/:id` | Delete constellation |
| GET | `/objects` | Get celestial objects |
| POST | `/objects` | Create celestial object |
| GET | `/objects/:id` | Get object by ID |
| PUT | `/objects/:id` | Update object |
| DELETE | `/objects/:id` | Delete object |
| GET | `/logs` | Get observation logs |
| POST | `/logs` | Create observation log |
| GET | `/logs/:id` | Get log by ID |
| PUT | `/logs/:id` | Update log |
| DELETE | `/logs/:id` | Delete log |

---

## 🛠️ Database Tables

The backend expects these tables (created by DDL script):

1. **Users** - User accounts (no auth)
2. **ObjectTypes** - Star, Exoplanet, etc.
3. **Constellations** - Constellation data
4. **CelestialObjects** - Stars and planets
5. **StarDetails** - Star properties
6. **ExoplanetDetails** - Exoplanet properties
7. **ObservationLogs** - Observation records

---

## 🐛 Troubleshooting

**Server won't start**
- Check if port 3000 is in use: `netstat -ano | findstr :3000`
- Kill process: `Get-Process -Id <PID> | Stop-Process -Force`
- Or change PORT in `.env`

**Database connection error**
- Verify MSSQL is running
- Check credentials in `.env`
- Ensure database `CosmicVault` exists
- Run DDL script to create tables

**Parameterized query errors**
- Ensure all inputs match SQL data types
- Check `@ParameterName` syntax in queries

---

## 📚 Next Steps

1. **Read full documentation**: `README.md`
2. **Test API endpoints**: `API_TESTS.md`
3. **Connect frontend**: Update API base URL to `http://localhost:3000`
4. **Explore database**: Open `CosmicVault_DDL.sql`

---

## ✨ Features Implemented

✅ Full CRUD for all 5 modules
✅ Parameterized queries (SQL injection safe)
✅ Database JOINs in GET responses
✅ Cascade deletes (Star/Exoplanet details)
✅ Async/await pattern
✅ JSON responses
✅ Error handling
✅ CORS enabled for frontend
✅ Environment variables
✅ No authentication (demo mode)

---

**Happy Coding! 🚀🌌**
