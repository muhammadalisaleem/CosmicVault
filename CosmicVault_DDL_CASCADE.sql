-- CosmicVault Database Schema with CASCADE DELETE Constraints
-- Run this script to update existing database with proper cascade operations

USE CosmicVault
GO

-- First, drop all existing foreign key constraints
DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
              ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys;

EXEC sp_executesql @sql;

-- Recreate foreign keys with CASCADE DELETE where appropriate

-- CelestialObjects -> ObjectTypes (ON DELETE RESTRICT - don't delete type if objects use it)
ALTER TABLE CelestialObjects
ADD CONSTRAINT FK_CelestialObjects_ObjectTypes 
FOREIGN KEY (TypeID) REFERENCES ObjectTypes(TypeID);

-- CelestialObjects -> Constellations (ON DELETE SET NULL - object can exist without constellation)
ALTER TABLE CelestialObjects
ADD CONSTRAINT FK_CelestialObjects_Constellations 
FOREIGN KEY (ConstellationID) REFERENCES Constellations(ConstellationID)
ON DELETE SET NULL;

-- StarDetails -> CelestialObjects (ON DELETE CASCADE - delete star details when object is deleted)
ALTER TABLE StarDetails
ADD CONSTRAINT FK_StarDetails_CelestialObjects 
FOREIGN KEY (StarID) REFERENCES CelestialObjects(ObjectID)
ON DELETE CASCADE;

-- ExoplanetDetails -> CelestialObjects (ON DELETE CASCADE - delete exoplanet details when object is deleted)
ALTER TABLE ExoplanetDetails
ADD CONSTRAINT FK_ExoplanetDetails_CelestialObjects 
FOREIGN KEY (ExoplanetID) REFERENCES CelestialObjects(ObjectID)
ON DELETE CASCADE;

-- ExoplanetDetails -> CelestialObjects (HostStarID) (ON DELETE NO ACTION - prevent cascade cycles)
-- Note: This must be NO ACTION to avoid multiple cascade paths from CelestialObjects
ALTER TABLE ExoplanetDetails
ADD CONSTRAINT FK_ExoplanetDetails_HostStar 
FOREIGN KEY (HostStarID) REFERENCES CelestialObjects(ObjectID)
ON DELETE NO ACTION;

-- ObservationLogs -> Users (ON DELETE CASCADE - delete logs when user is deleted)
ALTER TABLE ObservationLogs
ADD CONSTRAINT FK_ObservationLogs_Users 
FOREIGN KEY (UserID) REFERENCES Users(UserID)
ON DELETE CASCADE;

-- ObservationLogs -> CelestialObjects (ON DELETE CASCADE - delete logs when object is deleted)
ALTER TABLE ObservationLogs
ADD CONSTRAINT FK_ObservationLogs_CelestialObjects 
FOREIGN KEY (ObjectID) REFERENCES CelestialObjects(ObjectID)
ON DELETE CASCADE;

PRINT 'Foreign key constraints updated with CASCADE operations successfully!';
GO
