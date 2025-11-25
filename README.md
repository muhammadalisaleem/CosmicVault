# 🌌 CosmicVault 

# CosmicVault – Key Features

CosmicVault is a structured astronomy logging system designed for storing celestial objects, managing observations, and maintaining accurate astronomical data.

---

## 1. Celestial Object Management
- Add and categorize celestial objects (Stars, Galaxies, Nebulae, Exoplanets).
- Store precise astronomical details: Right Ascension, Declination, Magnitude, Distance (LY).

---

## 2. Constellation Database
- Maintain a detailed registry of constellations.
- Each celestial object is linked to its parent constellation.

---

## 3. Object Type Classification
- Centralized object-type table ensures consistent classification.
- Prevents duplication of common astronomical categories.

---

## 4. User Account System
- Store user profiles with unique usernames and emails.
- Supports personalized observation tracking.

---

## 5. Observation Logging
- Users can record observations, equipment used, and personal notes.
- Each log connects to both the user and the observed celestial object.

---

## Normalized Database Structure (BCNF)

### **ObjectTypes**
- TypeID (PK)  
- TypeName (UNIQUE)

### **Constellations**
- ConstellationID (PK)  
- Name (UNIQUE)  
- Abbreviation  
- Description  

### **CelestialObjects**
- ObjectID (PK)  
- Name  
- TypeID (FK → ObjectTypes)  
- ConstellationID (FK → Constellations)  
- RightAscension  
- Declination  
- ApparentMagnitude  
- DistanceLightYears  

### **StarDetails**
- StarID (PK, FK → CelestialObjects)  
- SpectralClass  
- LuminosityClass  
- Temperature  
- MassSolar  

### **ExoplanetDetails**
- ExoplanetID (PK, FK → CelestialObjects)  
- HostStarID (FK → CelestialObjects)  
- OrbitalPeriodDays  
- SemiMajorAxisAU  
- Eccentricity  

### **Users**
- UserID (PK)  
- Username  
- Email (UNIQUE)  
- Pass_word  

### **ObservationLogs**
- LogID (PK)  
- UserID (FK → Users)  
- ObjectID (FK → CelestialObjects)  
- ObservationDate  
- EquipmentUsed  
- Notes  

---


