const { getPool, sql } = require("../config/database");

// GET all celestial objects with joins
const getAllCelestialObjects = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT 
      co.ObjectID,
      co.Name,
      co.TypeID,
      ot.TypeName,
      co.ConstellationID,
      c.Name as ConstellationName,
      co.RightAscension,
      co.Declination,
      co.DistanceLightYears as Distance,
      co.ApparentMagnitude,
      sd.StarID,
      sd.SpectralClass,
      sd.LuminosityClass,
      sd.Temperature,
      sd.MassSolar as Mass,
      ed.ExoplanetID,
      ed.HostStarID,
      ed.OrbitalPeriodDays as OrbitalPeriod,
      ed.SemiMajorAxisAU as SemiMajorAxis,
      ed.Eccentricity
    FROM CelestialObjects co
    LEFT JOIN ObjectTypes ot ON co.TypeID = ot.TypeID
    LEFT JOIN Constellations c ON co.ConstellationID = c.ConstellationID
    LEFT JOIN StarDetails sd ON co.ObjectID = sd.StarID
    LEFT JOIN ExoplanetDetails ed ON co.ObjectID = ed.ExoplanetID
    ORDER BY co.ObjectID DESC
  `);
  return result.recordset;
};

// GET celestial object by ID with joins
const getCelestialObjectById = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .query(`
      SELECT 
        co.ObjectID,
        co.Name,
        co.TypeID,
        ot.TypeName,
        co.ConstellationID,
        c.Name as ConstellationName,
        co.RightAscension,
        co.Declination,
        co.DistanceLightYears as Distance,
        co.ApparentMagnitude,
        sd.StarID,
        sd.SpectralClass,
        sd.LuminosityClass,
        sd.Temperature,
        sd.MassSolar as Mass,
        ed.ExoplanetID,
        ed.HostStarID,
        ed.OrbitalPeriodDays as OrbitalPeriod,
        ed.SemiMajorAxisAU as SemiMajorAxis,
        ed.Eccentricity
      FROM CelestialObjects co
      LEFT JOIN ObjectTypes ot ON co.TypeID = ot.TypeID
      LEFT JOIN Constellations c ON co.ConstellationID = c.ConstellationID
      LEFT JOIN StarDetails sd ON co.ObjectID = sd.StarID
      LEFT JOIN ExoplanetDetails ed ON co.ObjectID = ed.ObjectID
      WHERE co.ObjectID = @ObjectID
    `);
  return result.recordset[0];
};

// CREATE celestial object
const createCelestialObject = async (name, typeId, constellationId, ra, dec, magnitude, distance) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("Name", sql.VarChar, name)
    .input("TypeID", sql.Int, typeId)
    .input("ConstellationID", sql.Int, constellationId)
    .input("RightAscension", sql.Decimal, parseFloat(ra) || 0)
    .input("Declination", sql.Decimal, parseFloat(dec) || 0)
    .input("ApparentMagnitude", sql.Decimal, parseFloat(magnitude) || null)
    .input("DistanceLightYears", sql.Decimal, parseFloat(distance) || null)
    .query(
      "INSERT INTO CelestialObjects (Name, TypeID, ConstellationID, RightAscension, Declination, ApparentMagnitude, DistanceLightYears) VALUES (@Name, @TypeID, @ConstellationID, @RightAscension, @Declination, @ApparentMagnitude, @DistanceLightYears); SELECT SCOPE_IDENTITY() as ObjectID"
    );
  return result.recordset[0].ObjectID;
};

// CREATE star details
const createStarDetails = async (objectId, spectralClass, luminosityClass, temperature, mass) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("StarID", sql.Int, objectId)
    .input("SpectralClass", sql.VarChar, spectralClass)
    .input("LuminosityClass", sql.VarChar, luminosityClass)
    .input("Temperature", sql.Int, parseInt(temperature) || null)
    .input("MassSolar", sql.Decimal, parseFloat(mass) || null)
    .query(
      "INSERT INTO StarDetails (StarID, SpectralClass, LuminosityClass, Temperature, MassSolar) VALUES (@StarID, @SpectralClass, @LuminosityClass, @Temperature, @MassSolar); SELECT SCOPE_IDENTITY() as StarID"
    );
  return result.recordset[0].StarID;
};

// CREATE exoplanet details
const createExoplanetDetails = async (objectId, hostStarId, orbitalPeriod, semiMajorAxis, eccentricity) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ExoplanetID", sql.Int, objectId)
    .input("HostStarID", sql.Int, hostStarId)
    .input("OrbitalPeriodDays", sql.Decimal, parseFloat(orbitalPeriod) || null)
    .input("SemiMajorAxisAU", sql.Decimal, parseFloat(semiMajorAxis) || null)
    .input("Eccentricity", sql.Decimal, parseFloat(eccentricity) || null)
    .query(
      "INSERT INTO ExoplanetDetails (ExoplanetID, HostStarID, OrbitalPeriodDays, SemiMajorAxisAU, Eccentricity) VALUES (@ExoplanetID, @HostStarID, @OrbitalPeriodDays, @SemiMajorAxisAU, @Eccentricity); SELECT SCOPE_IDENTITY() as ExoplanetID"
    );
  return result.recordset[0].ExoplanetID;
};

// UPDATE celestial object
const updateCelestialObject = async (objectId, name, typeId, constellationId, ra, dec, magnitude, distance) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .input("Name", sql.VarChar, name)
    .input("TypeID", sql.Int, typeId)
    .input("ConstellationID", sql.Int, constellationId)
    .input("RightAscension", sql.Decimal, parseFloat(ra) || 0)
    .input("Declination", sql.Decimal, parseFloat(dec) || 0)
    .input("ApparentMagnitude", sql.Decimal, parseFloat(magnitude) || null)
    .input("DistanceLightYears", sql.Decimal, parseFloat(distance) || null)
    .query(
      "UPDATE CelestialObjects SET Name = @Name, TypeID = @TypeID, ConstellationID = @ConstellationID, RightAscension = @RightAscension, Declination = @Declination, ApparentMagnitude = @ApparentMagnitude, DistanceLightYears = @DistanceLightYears WHERE ObjectID = @ObjectID"
    );
  return result.rowsAffected[0];
};

// UPDATE star details
const updateStarDetails = async (starId, surfaceTemp, luminosity, radius, mass) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("StarID", sql.Int, starId)
    .input("SurfaceTemperature", sql.Float, surfaceTemp)
    .input("Luminosity", sql.Float, luminosity)
    .input("Radius", sql.Float, radius)
    .input("Mass", sql.Float, mass)
    .query(
      "UPDATE StarDetails SET SurfaceTemperature = @SurfaceTemperature, Luminosity = @Luminosity, Radius = @Radius, Mass = @Mass WHERE StarID = @StarID"
    );
  return result.rowsAffected[0];
};

// UPDATE exoplanet details
const updateExoplanetDetails = async (exoplanetId, hostStarName, discoveryYear, orbitalPeriod, planetRadius) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ExoplanetID", sql.Int, exoplanetId)
    .input("HostStarName", sql.VarChar, hostStarName)
    .input("DiscoveryYear", sql.Int, discoveryYear)
    .input("OrbitalPeriod", sql.Float, orbitalPeriod)
    .input("Radius", sql.Float, planetRadius)
    .query(
      "UPDATE ExoplanetDetails SET HostStarName = @HostStarName, DiscoveryYear = @DiscoveryYear, OrbitalPeriod = @OrbitalPeriod, Radius = @Radius WHERE ExoplanetID = @ExoplanetID"
    );
  return result.rowsAffected[0];
};

// DELETE celestial object (cascades to star/exoplanet details)
const deleteCelestialObject = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .query("DELETE FROM CelestialObjects WHERE ObjectID = @ObjectID");
  return result.rowsAffected[0];
};

// Get star details by object ID
const getStarDetailsByObjectId = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .query("SELECT * FROM StarDetails WHERE ObjectID = @ObjectID");
  return result.recordset[0];
};

// Get exoplanet details by object ID
const getExoplanetDetailsByObjectId = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .query("SELECT * FROM ExoplanetDetails WHERE ObjectID = @ObjectID");
  return result.recordset[0];
};

module.exports = {
  getAllCelestialObjects,
  getCelestialObjectById,
  createCelestialObject,
  createStarDetails,
  createExoplanetDetails,
  updateCelestialObject,
  updateStarDetails,
  updateExoplanetDetails,
  deleteCelestialObject,
  getStarDetailsByObjectId,
  getExoplanetDetailsByObjectId,
};
