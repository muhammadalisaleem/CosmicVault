CREATE DATABASE CosmicVault
GO
USE CosmicVault
GO

-- Table for celestial object types (Star, Galaxy, Nebula, Exoplanet)
CREATE TABLE ObjectTypes (
    TypeID INT PRIMARY KEY IDENTITY(1,1),
    TypeName VARCHAR(50) NOT NULL UNIQUE 
);

-- Table for constellations
CREATE TABLE Constellations (
    ConstellationID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL UNIQUE,
    Abbreviation VARCHAR(10) NOT NULL,
    Description TEXT
);

-- Table for celestial objects (stars, galaxies, nebulae, exoplanets)
CREATE TABLE CelestialObjects (
    ObjectID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    TypeID INT NOT NULL,
    ConstellationID INT,
    RightAscension DECIMAL(10, 2), 
    Declination DECIMAL(10, 2),    
    DistanceLightYears DECIMAL(15, 2),
    ApparentMagnitude DECIMAL(5, 2), 
    FOREIGN KEY (TypeID) REFERENCES ObjectTypes(TypeID),
    FOREIGN KEY (ConstellationID) REFERENCES Constellations(ConstellationID)
);

-- Table for star-specific data 
CREATE TABLE StarDetails (
    StarID INT PRIMARY KEY,
    SpectralClass VARCHAR(10), 
    LuminosityClass VARCHAR(20), 
    Temperature INT, 
    MassSolar DECIMAL(10, 2), 
    FOREIGN KEY (StarID) REFERENCES CelestialObjects(ObjectID)
);

-- Table for exoplanet-specific data 
CREATE TABLE ExoplanetDetails (
    ExoplanetID INT PRIMARY KEY,
    HostStarID INT, 
    OrbitalPeriodDays DECIMAL(10, 2), 
    SemiMajorAxisAU DECIMAL(10, 2), 
    Eccentricity DECIMAL(5, 2), 
    FOREIGN KEY (ExoplanetID) REFERENCES CelestialObjects(ObjectID),
    FOREIGN KEY (HostStarID) REFERENCES CelestialObjects(ObjectID)
);

-- Table for users
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Pass_word VARCHAR(256) NOT NULL, 
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Table for user observation logs
CREATE TABLE ObservationLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ObjectID INT NOT NULL,
    ObservationDate DATETIME NOT NULL,
    Notes TEXT,
    EquipmentUsed VARCHAR(200), 
    SeeingConditions VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ObjectID) REFERENCES CelestialObjects(ObjectID)
);