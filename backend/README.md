# Cosmic Vault Backend - Setup & API Documentation

## 📋 Project Overview

Complete Node.js + Express + MSSQL backend for Cosmic Vault astronomy management system. All CRUD operations demonstrated with parameterized queries and proper error handling.

**Key Features:**
- ✅ Async/await with parameterized SQL queries
- ✅ No authentication/hashing (demonstration only)
- ✅ Clean MVC folder structure
- ✅ Full CRUD endpoints for all modules
- ✅ Database JOINs in GET responses
- ✅ Plain text password storage for demo purposes

---

## 🚀 Setup Instructions

### 1. Prerequisites

- **Node.js** (v14+)
- **Microsoft SQL Server** (MSSQL) running locally
- **MSSQL Management Studio** or SQL Server Express

### 2. Install Dependencies

Navigate to the backend folder and install npm packages:

```bash
cd d:\workspace\CosmicVault_v3.0\backend
npm install
```

### 3. Configure Database Connection

Edit `.env` file with your MSSQL credentials:

```env
DB_SERVER=localhost
DB_USER=sa
DB_PASS=YourPassword123!
DB_NAME=CosmicVault
PORT=3000
NODE_ENV=development
```

**Note:** Update `DB_USER` and `DB_PASS` to match your MSSQL setup.

### 4. Create MSSQL Database

Execute the DDL script in MSSQL Management Studio:

```sql
-- Run CosmicVault_DDL.sql to create database and tables
```

Ensure the database `CosmicVault` exists and contains all required tables:
- `ObjectTypes`
- `Constellations`
- `CelestialObjects`
- `StarDetails`
- `ExoplanetDetails`
- `Users`
- `ObservationLogs`

### 5. Start the Server

```bash
npm start
```

Expected output:
```
✨ Cosmic Vault Backend running on http://localhost:3000
📚 Database: CosmicVault (MSSQL)
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

---

## 👥 Users Module

### GET All Users
```
GET /users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "UserID": 1,
      "Username": "john_doe",
      "Email": "john@cosmicvault.app",
      "Pass_word": "password123",
      "CreatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Users retrieved successfully"
}
```

### GET User by ID
```
GET /users/:id
```

Example: `GET /users/1`

### CREATE User
```
POST /users
Content-Type: application/json

{
  "username": "jane_doe",
  "email": "jane@cosmicvault.app",
  "password": "securepass456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "UserID": 2,
    "username": "jane_doe",
    "email": "jane@cosmicvault.app"
  },
  "message": "User created successfully"
}
```

### UPDATE User
```
PUT /users/:id
Content-Type: application/json

{
  "username": "jane_smith",
  "email": "jane.smith@cosmicvault.app",
  "password": "newpassword789"
}
```

### DELETE User
```
DELETE /users/:id
```

Example: `DELETE /users/2`

---

## 🔭 Object Types Module

### GET All Object Types
```
GET /types
```

### CREATE Object Type
```
POST /types
Content-Type: application/json

{
  "typeName": "Star",
  "description": "A massive celestial body"
}
```

### DELETE Object Type
```
DELETE /types/:id
```

---

## 🌟 Constellations Module

### GET All Constellations
```
GET /constellations
```

### GET Constellation by ID
```
GET /constellations/:id
```

### CREATE Constellation
```
POST /constellations
Content-Type: application/json

{
  "name": "Orion",
  "description": "The Hunter constellation",
  "rightAscension": "05h 55m",
  "declination": "+5° 23'"
}
```

### UPDATE Constellation
```
PUT /constellations/:id
Content-Type: application/json

{
  "name": "Orion",
  "description": "The Hunter constellation - Updated",
  "rightAscension": "05h 55m",
  "declination": "+5° 23'"
}
```

### DELETE Constellation
```
DELETE /constellations/:id
```

---

## 🪐 Celestial Objects Module

### GET All Celestial Objects (with JOINs)
```
GET /objects
```

**Response includes:**
- Object type name
- Constellation name
- StarDetails (if type=Star)
- ExoplanetDetails (if type=Exoplanet)

```json
{
  "success": true,
  "data": [
    {
      "ObjectID": 1,
      "Name": "Sirius A",
      "TypeID": 1,
      "TypeName": "Star",
      "ConstellationID": 1,
      "ConstellationName": "Canis Major",
      "RightAscension": "06h 45m 08.917s",
      "Declination": "-16° 42' 46.296\"",
      "Magnitude": -1.46,
      "Distance": 2.64,
      "StarID": 1,
      "SurfaceTemperature": 10000,
      "Luminosity": 26.0,
      "Radius": 1.71,
      "Mass": 2.063,
      "ExoplanetID": null,
      "HostStarName": null,
      "DiscoveryYear": null,
      "OrbitalPeriod": null,
      "PlanetRadius": null
    }
  ]
}
```

### GET Celestial Object by ID
```
GET /objects/:id
```

### CREATE Celestial Object with Star Details
```
POST /objects
Content-Type: application/json

{
  "name": "Sirius A",
  "typeId": 1,
  "constellationId": 1,
  "rightAscension": "06h 45m 08.917s",
  "declination": "-16° 42' 46.296\"",
  "magnitude": -1.46,
  "distance": 2.64,
  "starDetails": {
    "surfaceTemperature": 10000,
    "luminosity": 26.0,
    "radius": 1.71,
    "mass": 2.063
  }
}
```

### CREATE Celestial Object with Exoplanet Details
```
POST /objects
Content-Type: application/json

{
  "name": "Proxima Centauri b",
  "typeId": 2,
  "constellationId": 5,
  "rightAscension": "14h 29m 42.9s",
  "declination": "-62° 40' 46\"",
  "magnitude": 11.0,
  "distance": 1.3,
  "exoplanetDetails": {
    "hostStarName": "Proxima Centauri",
    "discoveryYear": 2016,
    "orbitalPeriod": 11.186,
    "radius": 1.1
  }
}
```

### UPDATE Celestial Object
```
PUT /objects/:id
Content-Type: application/json

{
  "name": "Sirius A",
  "typeId": 1,
  "constellationId": 1,
  "rightAscension": "06h 45m 08.917s",
  "declination": "-16° 42' 46.296\"",
  "magnitude": -1.46,
  "distance": 2.64,
  "starDetails": {
    "surfaceTemperature": 10000,
    "luminosity": 26.0,
    "radius": 1.71,
    "mass": 2.063
  }
}
```

### DELETE Celestial Object
```
DELETE /objects/:id
```

---

## 📝 Observation Logs Module

### GET All Observation Logs (with JOINs)
```
GET /logs
```

**Response includes:**
- Username (from Users table)
- Object name (from CelestialObjects table)

```json
{
  "success": true,
  "data": [
    {
      "LogID": 1,
      "UserID": 1,
      "Username": "john_doe",
      "ObjectID": 1,
      "ObjectName": "Sirius A",
      "ObservationDate": "2024-01-20T22:30:00.000Z",
      "Notes": "Clear sky, excellent visibility",
      "Equipment": "Telescope - 8 inch reflector",
      "SeeingCondition": "5/5 - Excellent"
    }
  ]
}
```

### GET Observation Log by ID
```
GET /logs/:id
```

### CREATE Observation Log
```
POST /logs
Content-Type: application/json

{
  "userId": 1,
  "objectId": 1,
  "observationDate": "2024-01-20T22:30:00Z",
  "notes": "Clear sky, excellent visibility",
  "equipment": "Telescope - 8 inch reflector",
  "seeingCondition": "5/5 - Excellent"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "LogID": 2,
    "userId": 1,
    "objectId": 1,
    "observationDate": "2024-01-20T22:30:00.000Z"
  },
  "message": "Observation log created successfully"
}
```

### UPDATE Observation Log
```
PUT /logs/:id
Content-Type: application/json

{
  "userId": 1,
  "objectId": 1,
  "observationDate": "2024-01-20T23:00:00Z",
  "notes": "Updated notes - even better visibility later",
  "equipment": "Telescope - 8 inch reflector",
  "seeingCondition": "5/5 - Excellent"
}
```

### DELETE Observation Log
```
DELETE /logs/:id
```

---

## 🧪 Testing Examples

### Using fetch (JavaScript/Node.js)

```javascript
// Create a new user
fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'astronomer_john',
    email: 'john@example.com',
    password: 'mypassword123'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Get all celestial objects
fetch('http://localhost:3000/objects')
  .then(res => res.json())
  .then(data => console.log(data));

// Create an observation log
fetch('http://localhost:3000/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    objectId: 1,
    observationDate: '2024-01-20T22:30:00Z',
    notes: 'Great observation session',
    equipment: 'Telescope 8 inch',
    seeingCondition: '5/5'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Using curl (PowerShell)

```powershell
# Get all users
curl -X GET http://localhost:3000/users -H "Content-Type: application/json"

# Create a user
$body = @{
    username = "astronomer_jane"
    email = "jane@example.com"
    password = "mypassword456"
} | ConvertTo-Json

curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -Body $body

# Get all celestial objects
curl -X GET http://localhost:3000/objects -H "Content-Type: application/json"

# Create a constellation
$body = @{
    name = "Ursa Major"
    description = "The Great Bear"
    rightAscension = "11h"
    declination = "+55°"
} | ConvertTo-Json

curl -X POST http://localhost:3000/constellations `
  -H "Content-Type: application/json" `
  -Body $body
```

---

## 📊 Database Schema Reference

### Users Table
```
UserID (PK, Int)
Username (VarChar)
Email (VarChar)
Pass_word (VarChar)
CreatedAt (DateTime)
```

### ObjectTypes Table
```
TypeID (PK, Int)
TypeName (VarChar)
Description (VarChar)
```

### Constellations Table
```
ConstellationID (PK, Int)
Name (VarChar)
Description (VarChar)
RightAscension (VarChar)
Declination (VarChar)
```

### CelestialObjects Table
```
ObjectID (PK, Int)
Name (VarChar)
TypeID (FK)
ConstellationID (FK)
RightAscension (VarChar)
Declination (VarChar)
Magnitude (Float)
Distance (Float)
```

### StarDetails Table
```
StarID (PK, Int)
ObjectID (FK)
SurfaceTemperature (Float)
Luminosity (Float)
Radius (Float)
Mass (Float)
```

### ExoplanetDetails Table
```
ExoplanetID (PK, Int)
ObjectID (FK)
HostStarName (VarChar)
DiscoveryYear (Int)
OrbitalPeriod (Float)
Radius (Float)
```

### ObservationLogs Table
```
LogID (PK, Int)
UserID (FK)
ObjectID (FK)
ObservationDate (DateTime)
Notes (VarChar)
Equipment (VarChar)
SeeingCondition (VarChar)
```

---

## 🔍 Query Examples

### Get star with all details
```sql
SELECT 
  co.ObjectID, co.Name, ot.TypeName,
  c.Name as ConstellationName,
  sd.SurfaceTemperature, sd.Luminosity, sd.Radius, sd.Mass
FROM CelestialObjects co
LEFT JOIN ObjectTypes ot ON co.TypeID = ot.TypeID
LEFT JOIN Constellations c ON co.ConstellationID = c.ConstellationID
LEFT JOIN StarDetails sd ON co.ObjectID = sd.ObjectID
WHERE co.ObjectID = 1;
```

### Get observation logs for a user
```sql
SELECT ol.LogID, ol.ObservationDate, co.Name as ObjectName, 
       ol.Notes, ol.Equipment, ol.SeeingCondition
FROM ObservationLogs ol
JOIN Users u ON ol.UserID = u.UserID
JOIN CelestialObjects co ON ol.ObjectID = co.ObjectID
WHERE u.UserID = 1
ORDER BY ol.ObservationDate DESC;
```

---

## 🛠️ Folder Structure

```
backend/
├── index.js                          # Main Express server
├── package.json                      # Dependencies
├── .env                              # Environment variables
├── .gitignore                        # Git ignore file
└── src/
    ├── config/
    │   └── database.js              # MSSQL connection pool
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

## ⚙️ Parameterized Query Example

All queries use parameterized inputs to prevent SQL injection:

```javascript
const result = await pool
  .request()
  .input("Name", sql.VarChar, name)
  .input("TypeID", sql.Int, typeId)
  .query("INSERT INTO CelestialObjects (Name, TypeID) VALUES (@Name, @TypeID)");
```

---

## 📌 Important Notes

- ✅ **No password hashing** - Plain text for demo purposes only
- ✅ **No JWT tokens** - Simple CRUD demonstration
- ✅ **No authentication middleware** - All endpoints are public
- ✅ **Parameterized queries** - Protection against SQL injection
- ✅ **Async/await** - Modern JavaScript async pattern
- ✅ **CORS enabled** - Frontend can connect from any origin

---

## 🚨 Troubleshooting

**Connection Error: "❌ Database connection failed"**
- Check MSSQL is running: `services.msc` → SQL Server Agent
- Verify credentials in `.env`
- Ensure database `CosmicVault` exists

**Port Already in Use**
- Change `PORT` in `.env` file
- Or kill existing process: `Get-Process node | Stop-Process -Force`

**Parameterized Query Error**
- Ensure data types match (e.g., `sql.Int` for integers)
- Check query syntax and parameter names

---

## 📞 Support

For questions, check:
- `/health` endpoint to verify server is running
- Console logs for detailed error messages
- Database logs in MSSQL Management Studio

---

**Happy Stargazing! 🌌✨**
