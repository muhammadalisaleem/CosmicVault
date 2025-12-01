# 🌌 CosmicVault 

**A full-stack astronomy observation application for tracking celestial objects and managing astronomical observations.**

CosmicVault is a structured astronomy logging system designed for storing celestial objects, managing observations, and maintaining accurate astronomical data with React frontend and Node.js/Express backend connected to MSSQL database.

---

## 🚀 Key Features

### 1. Celestial Object Management
- Add and categorize celestial objects (Stars, Galaxies, Nebulae, Exoplanets, Black Holes)
- Store precise astronomical details: Right Ascension, Declination, Magnitude, Distance (LY)
- Browse 18+ pre-loaded celestial objects
- Advanced filtering and search functionality

### 2. Constellation Database
- Maintain a detailed registry of 88 official IAU constellations
- Each celestial object is linked to its parent constellation
- Browse complete constellation catalog with descriptions

### 3. Object Type Classification
- Centralized object-type table ensures consistent classification
- Prevents duplication of common astronomical categories
- Support for Stars, Galaxies, Nebulae, Exoplanets, and more

### 4. User Account System
- Secure user authentication with localStorage persistence
- Store user profiles with unique usernames and emails
- Personal statistics dashboard and activity tracking
- User-specific observation logs

### 5. Observation Logging
- Record observations with date, equipment, and seeing conditions
- Add personal notes and detailed observation records
- Each log connects to both the user and the observed celestial object
- Filter and search through observation history

### 6. Admin Panel
- Separate admin authentication (credentials: admin/admin123)
- System overview with real-time statistics
- User management: view details, delete users
- Object management: view all objects, delete entries
- Object type management: add/delete types
- View all 88 IAU constellations

---

## 🏗️ Architecture

### Frontend Components
- **LandingPage** - Marketing page with features showcase
- **LoginPage** - User authentication
- **SignupPage** - Account creation
- **AdminLoginPage** - Separate admin authentication
- **Dashboard** - User-specific statistics and recent observations
- **CelestialObjects** - Browse and manage celestial objects
- **CelestialObjectForm** - Add/edit celestial objects
- **ObservationLogs** - User's observation history
- **ObservationLogForm** - Create new observation logs
- **Constellations** - View 88 IAU constellations with local fallback
- **UserProfile** - User information, settings, and activity charts
- **AdminPanel** - Administrative dashboard with 5 tabs

### Backend Modules
- **Users** - Authentication and user management (6 endpoints)
- **Object Types** - Celestial object type management (3 endpoints)
- **Celestial Objects** - Object CRUD with complex JOINs (5 endpoints)
- **Constellations** - Constellation management (5 endpoints)
- **Observation Logs** - User-specific observation tracking (7 endpoints)

### Database Schema

#### **ObjectTypes**
- TypeID (PK)  
- TypeName (UNIQUE)

#### **Constellations**
- ConstellationID (PK)  
- Name (UNIQUE)  
- Abbreviation  
- Description  

#### **CelestialObjects**
- ObjectID (PK)  
- Name  
- TypeID (FK → ObjectTypes)  
- ConstellationID (FK → Constellations)  
- RightAscension  
- Declination  
- ApparentMagnitude  
- DistanceLightYears  

#### **StarDetails**
- StarID (PK, FK → CelestialObjects)  
- SpectralClass  
- LuminosityClass  
- Temperature  
- MassSolar  

#### **ExoplanetDetails**
- ExoplanetID (PK, FK → CelestialObjects)  
- HostStarID (FK → CelestialObjects)  
- OrbitalPeriodDays  
- SemiMajorAxisAU  
- Eccentricity  

#### **Users**
- UserID (PK)  
- Username (UNIQUE)
- Email (UNIQUE)  
- Pass_word  
- CreatedAt

#### **ObservationLogs**
- LogID (PK)  
- UserID (FK → Users)  
- ObjectID (FK → CelestialObjects)  
- ObservationDate  
- EquipmentUsed  
- SeeingConditions
- Notes  

---

## 📡 API Endpoints

### Authentication
- `POST /users` - Create account
- `POST /users/login/authenticate` - User login

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Object Types
- `GET /types` - Get all object types
- `POST /types` - Create new type
- `DELETE /types/:id` - Delete type

### Celestial Objects
- `GET /objects` - Get all celestial objects (with JOINs)
- `POST /objects` - Create new object
- `GET /objects/:id` - Get object by ID
- `PUT /objects/:id` - Update object
- `DELETE /objects/:id` - Delete object

### Constellations
- `GET /constellations` - Get all constellations
- `POST /constellations` - Create constellation
- `GET /constellations/:id` - Get constellation by ID
- `PUT /constellations/:id` - Update constellation
- `DELETE /constellations/:id` - Delete constellation

### Observation Logs
- `GET /logs` - Get all logs (admin)
- `GET /logs/user/:userId` - Get user's logs (user-specific)
- `POST /logs` - Create observation log
- `GET /logs/:id` - Get log by ID
- `PUT /logs/:id` - Update log
- `DELETE /logs/:id` - Delete log

---

## 💻 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Recharts** - Data visualization (pie charts)
- **Lucide React** - Icon library

### Backend
- **Node.js** with Express.js
- **MSSQL** - Microsoft SQL Server integration
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

### Database
- **Microsoft SQL Server 2019+**
- 7 normalized tables (BCNF)
- Foreign key constraints
- Parameterized queries for security
- CASCADE delete operations

---

## 📂 Project Structure

```
CosmicVault/
├── backend/
│   ├── src/
│   │   ├── config/         (Database configuration)
│   │   ├── controllers/    (API business logic)
│   │   ├── models/         (Database queries)
│   │   └── routes/         (API route definitions)
│   ├── scripts/            (Seed and utility scripts)
│   ├── .env                (Environment variables)
│   ├── index.js            (Server entry point)
│   └── package.json
├── src/
│   ├── components/         (React components)
│   │   └── ui/            (shadcn/ui components)
│   ├── services/          (API service layer)
│   ├── data/              (Local JSON fallbacks)
│   ├── styles/            (Global CSS)
│   └── App.tsx            (Main app component)
├── CosmicVault_DDL.sql    (Database schema)
├── sampleDataInsert.sql   (88 IAU constellations)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 Features Implemented

### Database & Backend
- ✅ Created normalized MSSQL database schema (BCNF)
- ✅ Built 26 RESTful API endpoints
- ✅ Implemented all CRUD operations
- ✅ Added complex SQL JOINs for data aggregation
- ✅ Database seeding scripts for constellations

### Frontend Integration
- ✅ Created 13+ React TypeScript components
- ✅ Integrated comprehensive API service layer
- ✅ Added authentication flow with session persistence
- ✅ Implemented real-time data fetching
- ✅ Local JSON fallback for offline constellation data

### User Features
- ✅ Sign up/Login with validation
- ✅ Session persistence via localStorage
- ✅ User-specific observation tracking
- ✅ Personal statistics dashboard with charts
- ✅ Profile management (change password, delete account)
- ✅ Recent activity tracking

### Admin Features
- ✅ Separate admin authentication system
- ✅ System overview with live statistics
- ✅ User management (view details, delete users)
- ✅ Object management (CRUD operations)
- ✅ Object type management (add/delete types)
- ✅ View all 88 IAU constellations

### Bug Fixes & Optimizations
- ✅ Fixed celestial objects JOIN conditions
- ✅ Fixed constellation schema alignment
- ✅ Implemented user-specific observation filtering
- ✅ Optimized data loading with parallel API calls
- ✅ Added error handling and user feedback
- ✅ Fixed case sensitivity issues (CreatedAt vs created_at)

---

## 🧪 Testing Results

### CRUD Operations
✅ Users: CREATE, READ, UPDATE, DELETE  
✅ Types: CREATE, READ, DELETE  
✅ Objects: CREATE, READ, UPDATE, DELETE  
✅ Constellations: CREATE, READ, UPDATE, DELETE  
✅ Logs: CREATE, READ, UPDATE, DELETE

### API Endpoints
✅ 26 endpoints tested and operational  
✅ Database JOINs returning correct data  
✅ Error handling with proper HTTP status codes  
✅ Response validation and data formatting

### User Workflows
✅ User registration and authentication  
✅ Add/view/delete celestial objects  
✅ Create/view/delete observation logs  
✅ Browse constellations with local fallback  
✅ View statistics and activity charts  
✅ Admin panel full functionality

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Microsoft SQL Server 2019+
- npm or yarn

### Database Setup
1. Create the database using `CosmicVault_DDL.sql`
2. Seed constellations with `sampleDataInsert.sql`
3. Configure `.env` in backend folder:
   ```
   DB_SERVER=localhost
   DB_USER=sa
   DB_PASSWORD=YourPassword
   DB_NAME=CosmicVault
   PORT=5173
   ```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Admin Access
- Navigate to landing page
- Click "Admin Access"
- Login with:
  - **Username:** admin
  - **Password:** admin123

---

## 🛠️ Available Scripts

### Backend Scripts
- `npm start` - Start backend server (port 5173)
- `npm run seed` - Seed database with sample data
- `npm run seed:force-constellations` - Force-refresh 88 constellations
- `npm run check:counts` - Check table row counts

### Frontend Scripts
- `npm run dev` - Start Vite dev server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 📊 Database Statistics

- **Constellations:** 88 official IAU constellations
- **Celestial Objects:** 37+ pre-loaded objects
- **Object Types:** 5 categories (Star, Galaxy, Nebula, Exoplanet, Black Hole)
- **Users:** Dynamic user registration
- **Observation Logs:** User-generated content

---

## 🌟 Normalized Database Structure (BCNF)

The database follows Boyce-Codd Normal Form (BCNF) principles:
- No redundant data
- Atomic values only
- Proper foreign key relationships
- Cascade delete operations
- Referential integrity enforced

---

## 📞 Support

For issues or questions:
- Check terminal output for backend errors
- Check browser console for frontend errors
- Verify `.env` configuration
- Ensure SQL Server is running and accessible
- Check that both servers are on correct ports (backend: 5173, frontend: 3000)

---

## 📝 License

This project is created for educational purposes as a database management system demonstration.

---

**Built with ❤️ for astronomy enthusiasts and database learners**


