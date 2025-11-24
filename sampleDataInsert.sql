-- Insert into ObjectTypes
INSERT INTO ObjectTypes (TypeName) VALUES
('Star'),
('Galaxy'),
('Nebula'),
('Exoplanet'),
('Black Hole');

-- Insert into Constellations
INSERT INTO Constellations (Name, Abbreviation, Description) VALUES
('Orion', 'Ori', 'A prominent constellation located on the celestial equator, known for the Orion Nebula and the Belt stars.'),
('Andromeda', 'And', 'Named after the princess in Greek mythology, home to the Andromeda Galaxy.'),
('Ursa Major', 'UMa', 'Contains the Big Dipper asterism, one of the most recognizable patterns in the sky.'),
('Cassiopeia', 'Cas', 'A W-shaped constellation in the northern sky, named after a queen in Greek mythology.'),
('Centaurus', 'Cen', 'A southern constellation containing Alpha Centauri, the closest star system to Earth.');

-- Insert into CelestialObjects
INSERT INTO CelestialObjects (Name, TypeID, ConstellationID, RightAscension, Declination, DistanceLightYears, ApparentMagnitude) VALUES
('Betelgeuse', 1, 1, 5.92, 7.41, 642.50, 0.45), 
('Andromeda Galaxy', 2, 2, 0.71, 41.27, 2537000.00, 3.44), 
('Orion Nebula', 3, 1, 5.59, -5.23, 1344.00, 4.00), 
('Kepler-452b', 4, NULL, 19.74, 44.28, 1402.00, NULL), 
('Proxima Centauri', 1, 5, 14.49, -62.68, 4.24, 11.13), 
('Messier 57', 3, NULL, 18.89, 33.03, 2300.00, 8.80), 
('Sagittarius A*', 5, NULL, 17.76, -29.01, 26000.00, NULL), 
('Sirius', 1, NULL, 6.75, -16.72, 8.60, -1.46), 
('Vega', 1, NULL, 18.62, 38.78, 25.04, 0.03), 
('Rigel', 1, 1, 5.24, -8.20, 860.00, 0.13), 
('TRAPPIST-1', 1, NULL, 23.11, -5.04, 39.46, 18.80), 
('TRAPPIST-1e', 4, NULL, 23.11, -5.04, 39.46, NULL), 
('HD 209458', 1, NULL, 22.05, 18.88, 159.00, 7.65), 
('HD 209458 b', 4, NULL, 22.05, 18.88, 159.00, NULL),
('WASP-12', 1, NULL, 6.51, 29.67, 1410.00, 11.69),
('WASP-12b', 4, NULL, 6.51, 29.67, 1410.00, NULL), 
('55 Cancri', 1, NULL, 8.66, 28.33, 40.30, 5.95), 
('55 Cancri e', 4, NULL, 8.66, 28.33, 40.30, NULL); 

-- Insert into StarDetails
INSERT INTO StarDetails (StarID, SpectralClass, LuminosityClass, Temperature, MassSolar) VALUES
(1, 'M2', 'Ia', 3600, 16.00), 
(5, 'M5', 'V', 3100, 0.12), 
(8, 'A1', 'V', 9940, 2.02),
(9, 'A0', 'V', 9600, 2.14), 
(10, 'B8', 'Ia', 12100, 23.00); 

-- Insert into ExoplanetDetails
INSERT INTO ExoplanetDetails (ExoplanetID, HostStarID, OrbitalPeriodDays, SemiMajorAxisAU, Eccentricity) VALUES
(4, 5, 384.84, 1.05, 0.07), 
(12, 11, 6.10, 0.03, 0.08), 
(14, 13, 3.52, 0.05, 0.00), 
(16, 15, 1.09, 0.02, 0.04), 
(18, 17, 0.74, 0.02, 0.06); 

-- Insert into Users
INSERT INTO Users (Username, Email, Pass_word, CreatedAt) VALUES
('Ammar Armstrong', 'armstrong@cosmicvault.com', 'hashedpass123', '2025-01-15 10:30:00'),
('Haroon', 'stargazer@google.com', 'hashedpass456', '2025-02-20 14:45:00'),
('Khan', 'khan@live.com', 'hashedpass789', '2025-03-10 09:15:00'),
('Asim', 'fieldmarshal@pakistan.com', 'hashedpass101', '2025-04-05 16:20:00'),
('Ali', 'ali@nasa.com', 'hashedpass202', '2025-05-12 11:00:00');

-- Insert into ObservationLogs
INSERT INTO ObservationLogs (UserID, ObjectID, ObservationDate, Notes, EquipmentUsed, SeeingConditions) VALUES
(1, 1, '2025-06-01 22:00:00', 'Bright red star, visible with naked eye.', 'Celestron 8SE', 'Clear, stable'), 
(2, 2, '2025-06-02 23:30:00', 'Faint spiral arms observed with long exposure.', 'Meade LX200 10"', 'Slight haze'), 
(3, 3, '2025-06-03 21:45:00', 'Stunning nebula details, greenish glow.', 'Orion SkyQuest 12"', 'Excellent'), 
(4, 5, '2025-06-04 20:15:00', 'Faint star, required precise alignment.', 'Sky-Watcher 130P', 'Moderate'), 
(5, 6, '2025-06-05 22:30:00', 'Ring structure clearly visible.', 'Celestron NexStar 6SE', 'Very clear'); 
GO
