-- =============================================
-- CosmicVault Database Query Script
-- =============================================

USE CosmicVault;
GO

-- =============================================
-- USERS TABLE
-- =============================================
PRINT '==================== USERS ====================';
SELECT COUNT(*) AS TotalUsers FROM Users;
SELECT TOP 100 * FROM Users ORDER BY UserID;
PRINT '';

-- =============================================
-- OBJECT TYPES TABLE
-- =============================================
PRINT '================= OBJECT TYPES ================';
SELECT COUNT(*) AS TotalObjectTypes FROM ObjectTypes;
SELECT TOP 100 * FROM ObjectTypes ORDER BY TypeID;
PRINT '';

-- =============================================
-- CONSTELLATIONS TABLE
-- =============================================
PRINT '================ CONSTELLATIONS ===============';
SELECT COUNT(*) AS TotalConstellations FROM Constellations;
SELECT TOP 100 * FROM Constellations ORDER BY ConstellationID;
PRINT '';

-- =============================================
-- CELESTIAL OBJECTS TABLE
-- =============================================
PRINT '============== CELESTIAL OBJECTS ==============';
SELECT COUNT(*) AS TotalCelestialObjects FROM CelestialObjects;
SELECT TOP 100 * FROM CelestialObjects ORDER BY ObjectID;
PRINT '';

-- =============================================
-- STAR DETAILS TABLE
-- =============================================
PRINT '================ STAR DETAILS =================';
SELECT COUNT(*) AS TotalStars FROM StarDetails;
SELECT TOP 100 * FROM StarDetails ORDER BY StarID;
PRINT '';

-- =============================================
-- EXOPLANET DETAILS TABLE
-- =============================================
PRINT '============== EXOPLANET DETAILS ==============';
SELECT COUNT(*) AS TotalExoplanets FROM ExoplanetDetails;
SELECT TOP 100 * FROM ExoplanetDetails ORDER BY ExoplanetID;
PRINT '';

-- =============================================
-- OBSERVATION LOGS TABLE
-- =============================================
PRINT '============== OBSERVATION LOGS ===============';
SELECT COUNT(*) AS TotalObservationLogs FROM ObservationLogs;
SELECT TOP 100 * FROM ObservationLogs ORDER BY LogID DESC;
PRINT '';

-- =============================================
-- USER STATISTICS TABLE (TRIGGER-MAINTAINED)
-- =============================================
PRINT '============== USER STATISTICS ================';
SELECT COUNT(*) AS TotalUserStats FROM UserStatistics;
SELECT TOP 100 * FROM UserStatistics ORDER BY TotalObservations DESC;
PRINT '';

-- =============================================
-- AUDIT LOG TABLE (TRIGGER-MAINTAINED)
-- =============================================
PRINT '================= AUDIT LOG ===================';
SELECT COUNT(*) AS TotalAuditRecords FROM AuditLog;
SELECT TOP 100 * FROM AuditLog ORDER BY ChangeDate DESC;
PRINT '';

-- =============================================
-- OBSERVATION STREAKS TABLE (TRIGGER-MAINTAINED)
-- =============================================
PRINT '============ OBSERVATION STREAKS ==============';
SELECT COUNT(*) AS TotalStreakRecords FROM ObservationStreaks;
SELECT TOP 100 * FROM ObservationStreaks ORDER BY UserID, StreakDate DESC;
PRINT '';

-- =============================================
-- SUMMARY STATISTICS
-- =============================================
PRINT '=============== SUMMARY STATS =================';
SELECT 
    (SELECT COUNT(*) FROM Users) AS Users,
    (SELECT COUNT(*) FROM ObjectTypes) AS ObjectTypes,
    (SELECT COUNT(*) FROM Constellations) AS Constellations,
    (SELECT COUNT(*) FROM CelestialObjects) AS CelestialObjects,
    (SELECT COUNT(*) FROM StarDetails) AS Stars,
    (SELECT COUNT(*) FROM ExoplanetDetails) AS Exoplanets,
    (SELECT COUNT(*) FROM ObservationLogs) AS ObservationLogs,
    (SELECT COUNT(*) FROM UserStatistics) AS UserStatistics,
    (SELECT COUNT(*) FROM AuditLog) AS AuditRecords,
    (SELECT COUNT(*) FROM ObservationStreaks) AS StreakRecords;
PRINT '';
PRINT '==============================================';
