# Sample API Test Requests

## Test File for Postman or REST Client

### ✅ Health Check
```http
GET http://localhost:3000/health
```

---

## 👥 Users Module Tests

### Create User
```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "username": "john_astronomer",
  "email": "john@cosmicvault.app",
  "password": "stargazer123"
}
```

### Get All Users
```http
GET http://localhost:3000/users
```

### Get User by ID
```http
GET http://localhost:3000/users/1
```

### Update User
```http
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "username": "john_astronomer_updated",
  "email": "john.updated@cosmicvault.app",
  "password": "newpassword456"
}
```

### Delete User
```http
DELETE http://localhost:3000/users/1
```

---

## 🔭 Object Types Module Tests

### Create Object Type
```http
POST http://localhost:3000/types
Content-Type: application/json

{
  "typeName": "Star",
  "description": "A massive luminous sphere held together by gravity"
}
```

### Create Another Type
```http
POST http://localhost:3000/types
Content-Type: application/json

{
  "typeName": "Exoplanet",
  "description": "A planet outside our solar system"
}
```

### Get All Object Types
```http
GET http://localhost:3000/types
```

### Delete Object Type
```http
DELETE http://localhost:3000/types/1
```

---

## 🌟 Constellations Module Tests

### Create Constellation
```http
POST http://localhost:3000/constellations
Content-Type: application/json

{
  "name": "Orion",
  "description": "The Hunter - One of the most recognizable constellations",
  "rightAscension": "05h 55m",
  "declination": "+5° 23'"
}
```

### Create Multiple Constellations
```http
POST http://localhost:3000/constellations
Content-Type: application/json

{
  "name": "Ursa Major",
  "description": "The Great Bear",
  "rightAscension": "11h 00m",
  "declination": "+60° 00'"
}
```

```http
POST http://localhost:3000/constellations
Content-Type: application/json

{
  "name": "Canis Major",
  "description": "The Great Dog",
  "rightAscension": "07h 00m",
  "declination": "-20° 00'"
}
```

### Get All Constellations
```http
GET http://localhost:3000/constellations
```

### Get Constellation by ID
```http
GET http://localhost:3000/constellations/1
```

### Update Constellation
```http
PUT http://localhost:3000/constellations/1
Content-Type: application/json

{
  "name": "Orion",
  "description": "The Hunter - Updated description",
  "rightAscension": "05h 55m",
  "declination": "+5° 23'"
}
```

### Delete Constellation
```http
DELETE http://localhost:3000/constellations/1
```

---

## 🪐 Celestial Objects Module Tests

### Create Star Object
```http
POST http://localhost:3000/objects
Content-Type: application/json

{
  "name": "Sirius A",
  "typeId": 1,
  "constellationId": 3,
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

### Create Exoplanet Object
```http
POST http://localhost:3000/objects
Content-Type: application/json

{
  "name": "Proxima Centauri b",
  "typeId": 2,
  "constellationId": 2,
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

### Create Another Star
```http
POST http://localhost:3000/objects
Content-Type: application/json

{
  "name": "Betelgeuse",
  "typeId": 1,
  "constellationId": 1,
  "rightAscension": "05h 55m 10.3s",
  "declination": "+7° 24' 25.4\"",
  "magnitude": 0.5,
  "distance": 548.9,
  "starDetails": {
    "surfaceTemperature": 3500,
    "luminosity": 126000,
    "radius": 700,
    "mass": 16.5
  }
}
```

### Get All Celestial Objects (with JOINs)
```http
GET http://localhost:3000/objects
```

### Get Celestial Object by ID
```http
GET http://localhost:3000/objects/1
```

### Update Celestial Object
```http
PUT http://localhost:3000/objects/1
Content-Type: application/json

{
  "name": "Sirius A",
  "typeId": 1,
  "constellationId": 3,
  "rightAscension": "06h 45m 08.917s",
  "declination": "-16° 42' 46.296\"",
  "magnitude": -1.46,
  "distance": 2.64,
  "starDetails": {
    "surfaceTemperature": 9950,
    "luminosity": 25.5,
    "radius": 1.70,
    "mass": 2.06
  }
}
```

### Delete Celestial Object
```http
DELETE http://localhost:3000/objects/1
```

---

## 📝 Observation Logs Module Tests

### Create Observation Log
```http
POST http://localhost:3000/logs
Content-Type: application/json

{
  "userId": 1,
  "objectId": 1,
  "observationDate": "2024-01-20T22:30:00Z",
  "notes": "Clear sky, excellent visibility. Sirius was particularly bright.",
  "equipment": "Telescope - 8 inch reflector",
  "seeingCondition": "5/5 - Excellent"
}
```

### Create Another Log
```http
POST http://localhost:3000/logs
Content-Type: application/json

{
  "userId": 1,
  "objectId": 2,
  "observationDate": "2024-01-21T23:15:00Z",
  "notes": "Detected Proxima Centauri b in search. Very dim object.",
  "equipment": "Telescope - 8 inch reflector",
  "seeingCondition": "4/5 - Good"
}
```

### Get All Observation Logs
```http
GET http://localhost:3000/logs
```

### Get Observation Log by ID
```http
GET http://localhost:3000/logs/1
```

### Update Observation Log
```http
PUT http://localhost:3000/logs/1
Content-Type: application/json

{
  "userId": 1,
  "objectId": 1,
  "observationDate": "2024-01-20T23:00:00Z",
  "notes": "Updated observation - Even clearer at 11 PM!",
  "equipment": "Telescope - 8 inch reflector with 25mm eyepiece",
  "seeingCondition": "5/5 - Excellent"
}
```

### Delete Observation Log
```http
DELETE http://localhost:3000/logs/1
```

---

## 🧪 PowerShell Testing Script

Save as `test-api.ps1`:

```powershell
# Test Cosmic Vault API Endpoints

$baseUrl = "http://localhost:3000"

Write-Host "🌌 Testing Cosmic Vault Backend API" -ForegroundColor Cyan

# Health Check
Write-Host "`n✅ Health Check" -ForegroundColor Green
curl -X GET "$baseUrl/health" | ConvertFrom-Json | ConvertTo-Json

# Create User
Write-Host "`n✅ Creating User" -ForegroundColor Green
$userBody = @{
    username = "test_astronomer"
    email = "test@cosmicvault.app"
    password = "testpass123"
} | ConvertTo-Json

curl -X POST "$baseUrl/users" `
  -H "Content-Type: application/json" `
  -Body $userBody | ConvertFrom-Json | ConvertTo-Json

# Get All Users
Write-Host "`n✅ Getting All Users" -ForegroundColor Green
curl -X GET "$baseUrl/users" | ConvertFrom-Json | ConvertTo-Json

# Create Constellation
Write-Host "`n✅ Creating Constellation" -ForegroundColor Green
$constBody = @{
    name = "Andromeda"
    description = "The Chained Maiden"
    rightAscension = "00h 40m"
    declination = "+41° 00'"
} | ConvertTo-Json

curl -X POST "$baseUrl/constellations" `
  -H "Content-Type: application/json" `
  -Body $constBody | ConvertFrom-Json | ConvertTo-Json

Write-Host "`n✨ Testing Complete!" -ForegroundColor Cyan
```

Run the script:
```powershell
. C:\path\to\test-api.ps1
```

---

## 🔗 Notes

- Replace `localhost:3000` with actual server URL if deployed
- Use proper date format: `YYYY-MM-DDTHH:MM:SSZ`
- All responses include `success` boolean and `message` field
- Errors include detailed error messages in `error` field
- HTTP Status Codes:
  - `200` - Success
  - `201` - Created
  - `400` - Bad Request
  - `404` - Not Found
  - `500` - Server Error
