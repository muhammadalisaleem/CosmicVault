# 🚀 START HERE - Cosmic Vault Backend Setup

Welcome to the Cosmic Vault backend! This guide will get you up and running in minutes.

---

## 📋 Pre-Requirements

Before you start, make sure you have:

1. **Node.js** installed (v14 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **Microsoft SQL Server** running locally
   - MSSQL Server Express
   - Or SQL Server Developer Edition
   - Check: Services → SQL Server

3. **MSSQL Management Studio** (optional but helpful)
   - For creating database manually
   - https://docs.microsoft.com/en-us/sql/ssms/

4. **Database file**: `CosmicVault_DDL.sql`
   - Should be in parent folder: `d:\workspace\CosmicVault_v3.0\`

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Navigate to Backend Folder

```powershell
cd d:\workspace\CosmicVault_v3.0\backend
```

### Step 2: Install npm Dependencies

```powershell
npm install
```

This will install:
- `express` - Web server framework
- `mssql` - Database driver for SQL Server
- `dotenv` - Environment variable management
- `cors` - Cross-origin request handling

### Step 3: Configure Database Connection

Edit the `.env` file in this folder:

```env
DB_SERVER=localhost
DB_USER=sa
DB_PASS=YourPassword123!
DB_NAME=CosmicVault
PORT=3000
```

**Replace with your actual MSSQL credentials:**
- `DB_USER`: Your SQL Server login (default: `sa`)
- `DB_PASS`: Your SQL Server password
- `DB_SERVER`: Server name (usually `localhost` for local setup)

### Step 4: Create MSSQL Database

Open **MSSQL Management Studio** and:

1. Run this SQL to create the database:
```sql
CREATE DATABASE CosmicVault;
```

2. Then execute the full DDL script:
   - File: `d:\workspace\CosmicVault_v3.0\CosmicVault_DDL.sql`
   - This creates all required tables

OR use command line:
```powershell
# If you have sqlcmd installed
sqlcmd -S localhost -U sa -P YourPassword123! -i "d:\workspace\CosmicVault_v3.0\CosmicVault_DDL.sql"
```

### Step 5: Start the Backend Server

```powershell
npm start
```

You should see:
```
✨ Cosmic Vault Backend running on http://localhost:3000
📚 Database: CosmicVault (MSSQL)
```

---

## ✅ Verify It's Working

### Health Check

Open a new PowerShell window and test:

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

### Test Creating a User

```powershell
$body = @{
    username = "test_user"
    email = "test@space.com"
    password = "testpass123"
} | ConvertTo-Json

curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -Body $body
```

You should get a response with the created user ID.

---

## 📁 Project Structure

```
backend/
├── index.js                    # Main server file - START HERE
├── package.json                # Dependencies
├── .env                        # Your database credentials
├── .env.example                # Template for .env
├── .gitignore                  # Files to ignore in git
├── START_HERE.md              # This file!
├── QUICK_START.md             # Quick reference guide
├── README.md                  # Full API documentation
├── API_TESTS.md               # Testing examples
├── SUMMARY.md                 # Project overview
│
└── src/
    ├── config/
    │   └── database.js        # Database connection setup
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

## 🎯 Core API Endpoints

### Users
- `POST /users` - Create user
- `GET /users` - Get all users
- `GET /users/:id` - Get one user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Celestial Objects
- `POST /objects` - Create object (with star/planet details)
- `GET /objects` - Get all objects (with JOINs)
- `GET /objects/:id` - Get one object
- `PUT /objects/:id` - Update object
- `DELETE /objects/:id` - Delete object

### Constellations
- `POST /constellations` - Create constellation
- `GET /constellations` - Get all constellations
- `GET /constellations/:id` - Get one constellation
- `PUT /constellations/:id` - Update constellation
- `DELETE /constellations/:id` - Delete constellation

### Observation Logs
- `POST /logs` - Create observation log
- `GET /logs` - Get all logs (with user & object names)
- `GET /logs/:id` - Get one log
- `PUT /logs/:id` - Update log
- `DELETE /logs/:id` - Delete log

### Object Types
- `POST /types` - Create object type
- `GET /types` - Get all types
- `DELETE /types/:id` - Delete type

---

## 🧪 First API Call

### Create a constellation:

```powershell
$body = @{
    name = "Orion"
    description = "The Hunter constellation"
    rightAscension = "05h 55m"
    declination = "+5° 23'"
} | ConvertTo-Json

curl -X POST http://localhost:3000/constellations `
  -H "Content-Type: application/json" `
  -Body $body
```

Response:
```json
{
  "success": true,
  "data": {
    "ConstellationID": 1,
    "name": "Orion",
    "description": "The Hunter constellation",
    "rightAscension": "05h 55m",
    "declination": "+5° 23'"
  },
  "message": "Constellation created successfully"
}
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | This file - Getting started guide |
| **QUICK_START.md** | Quick reference for common tasks |
| **README.md** | Full API documentation with all endpoints |
| **API_TESTS.md** | 50+ complete test examples |
| **SUMMARY.md** | Project overview and features |

---

## 🔧 Troubleshooting

### ❌ "Connection failed: Could not connect to server"

**Solution:**
1. Check MSSQL is running: `services.msc`
2. Verify credentials in `.env`
3. Ensure server name is correct (usually `localhost`)

### ❌ "Database CosmicVault does not exist"

**Solution:**
1. Create database: `CREATE DATABASE CosmicVault;`
2. Run the DDL script to create tables
3. Verify in MSSQL Management Studio

### ❌ "Port 3000 already in use"

**Solution:**
1. Change PORT in `.env` file
2. Or kill existing process: `Get-Process node | Stop-Process -Force`

### ❌ "npm command not found"

**Solution:**
1. Install Node.js: https://nodejs.org/
2. Restart PowerShell
3. Verify: `npm --version`

---

## 💡 Next Steps

### 1. Read Full Documentation
Open `README.md` for complete API documentation

### 2. Test All Endpoints
See `API_TESTS.md` for 50+ test examples

### 3. Connect Frontend
Update React app to use `http://localhost:3000`

### 4. Explore Database
Open tables in MSSQL Management Studio

### 5. Modify Code
Edit files in `src/` folder to customize behavior

---

## 🎓 For Database Course

This backend demonstrates:
- ✅ **CREATE**: Insert operations with IDENTITY
- ✅ **READ**: SELECT queries with JOINs
- ✅ **UPDATE**: Modify existing records
- ✅ **DELETE**: Remove records with cascading
- ✅ **JOINS**: Combining multiple tables
- ✅ **Parameterized Queries**: Safe SQL execution
- ✅ **Relationships**: Foreign keys and constraints
- ✅ **Transactions**: Atomic operations

---

## 🚀 Running Everything

### Terminal 1 - Backend Server
```powershell
cd d:\workspace\CosmicVault_v3.0\backend
npm start
```

### Terminal 2 - Test API
```powershell
curl http://localhost:3000/health
```

### Terminal 3 (Optional) - Frontend
```powershell
cd d:\workspace\CosmicVault_v3.0
npm run dev
```

---

## 📞 Common Commands

### Start server
```powershell
npm start
```

### Stop server
```
Ctrl + C
```

### Install dependencies again
```powershell
npm install
```

### Check if server is running
```powershell
curl http://localhost:3000/health
```

### View database tables
```powershell
# In MSSQL Management Studio
USE CosmicVault;
SELECT * FROM Users;
SELECT * FROM CelestialObjects;
SELECT * FROM ObservationLogs;
```

---

## 🎯 Success Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MSSQL running (check Services)
- [ ] `.env` file configured with your credentials
- [ ] Database `CosmicVault` created
- [ ] DDL script executed (tables created)
- [ ] `npm install` completed without errors
- [ ] `npm start` runs successfully
- [ ] Health check works (`curl http://localhost:3000/health`)
- [ ] Can create a user via POST
- [ ] Can retrieve users via GET

**If all checked ✓ - You're ready to go! 🚀**

---

## 🌟 Key Features

✨ **Full CRUD** - All operations covered
✨ **Database JOINs** - Complex queries included
✨ **Parameterized Queries** - SQL injection safe
✨ **Error Handling** - Proper HTTP status codes
✨ **Async/Await** - Modern JavaScript
✨ **JSON API** - RESTful responses
✨ **CORS Enabled** - Frontend friendly
✨ **Environment Config** - Secure credentials

---

## ✍️ Example: Create & Get Objects

```powershell
# 1. Create a constellation first
$const = @{
    name = "Canis Major"
    description = "The Great Dog"
    rightAscension = "07h"
    declination = "-20°"
} | ConvertTo-Json

curl -X POST http://localhost:3000/constellations `
  -H "Content-Type: application/json" `
  -Body $const

# 2. Create a star object
$star = @{
    name = "Sirius A"
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
  -Body $star

# 3. Get all objects (with details)
curl http://localhost:3000/objects
```

---

## 🎓 Learning Path

1. **Understand the structure** → Read SUMMARY.md
2. **Set up locally** → Follow this guide
3. **Test endpoints** → Use API_TESTS.md examples
4. **Read full docs** → Check README.md
5. **Modify code** → Edit src/ files
6. **Connect frontend** → Point React to localhost:3000

---

## 📖 File Descriptions

| File | Description |
|------|-------------|
| `index.js` | Express server setup, routes, middleware |
| `.env` | Database credentials (DON'T COMMIT) |
| `package.json` | npm dependencies and scripts |
| `src/config/database.js` | MSSQL connection pool |
| `src/controllers/*` | Business logic for each module |
| `src/routes/*` | Express route definitions |
| `src/models/*` | Database query functions |

---

## 🚨 Important Notes

⚠️ **No Authentication**
- This is a demo for DB courses
- All endpoints are public
- No password hashing (plain text)
- Not suitable for production

✅ **Parameterized Queries**
- All queries use `@Parameter` syntax
- Protected against SQL injection
- Safe for demo use

✅ **Database Changes**
- Changes persist in MSSQL
- You can query directly in SSMS
- All tables can be viewed and modified

---

## 🎉 You're All Set!

Everything is ready to go. Start the server and begin testing!

```powershell
npm start
```

Then visit: **http://localhost:3000/health**

**Happy coding! 🌌✨**

---

**Questions? Check:**
- 📖 README.md - Full API docs
- 🧪 API_TESTS.md - Test examples
- 📋 QUICK_START.md - Quick reference
- 🎯 SUMMARY.md - Project overview
