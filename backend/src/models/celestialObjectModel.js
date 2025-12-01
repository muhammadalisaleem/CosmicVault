const { getPool, sql } = require("../config/database");

// GET all celestial objects with joins
const getAllCelestialObjects = async () => {
  const pool = getPool();
  try {
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
    console.log(`Fetched ${result.recordset.length} celestial objects`);
    return result.recordset;
  } catch (err) {
    console.error("Error in getAllCelestialObjects:", err.message);
    throw err;
  }
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
      LEFT JOIN ExoplanetDetails ed ON co.ObjectID = ed.ExoplanetID
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
const updateStarDetails = async (starId, spectralClass, luminosityClass, temperature, mass) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("StarID", sql.Int, starId)
    .input("SpectralClass", sql.VarChar, spectralClass)
    .input("LuminosityClass", sql.VarChar, luminosityClass)
    .input("Temperature", sql.Int, parseInt(temperature) || null)
    .input("MassSolar", sql.Decimal, parseFloat(mass) || null)
    .query(
      "UPDATE StarDetails SET SpectralClass = @SpectralClass, LuminosityClass = @LuminosityClass, Temperature = @Temperature, MassSolar = @MassSolar WHERE StarID = @StarID"
    );
  return result.rowsAffected[0];
};

// UPDATE exoplanet details
const updateExoplanetDetails = async (exoplanetId, hostStarId, orbitalPeriod, semiMajorAxis, eccentricity) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ExoplanetID", sql.Int, exoplanetId)
    .input("HostStarID", sql.Int, hostStarId)
    .input("OrbitalPeriodDays", sql.Decimal, parseFloat(orbitalPeriod) || null)
    .input("SemiMajorAxisAU", sql.Decimal, parseFloat(semiMajorAxis) || null)
    .input("Eccentricity", sql.Decimal, parseFloat(eccentricity) || null)
    .query(
      "UPDATE ExoplanetDetails SET HostStarID = @HostStarID, OrbitalPeriodDays = @OrbitalPeriodDays, SemiMajorAxisAU = @SemiMajorAxisAU, Eccentricity = @Eccentricity WHERE ExoplanetID = @ExoplanetID"
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
    .input("StarID", sql.Int, objectId)
    .query("SELECT * FROM StarDetails WHERE StarID = @StarID");
  return result.recordset[0];
};

// Get exoplanet details by object ID
const getExoplanetDetailsByObjectId = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ExoplanetID", sql.Int, objectId)
    .query("SELECT * FROM ExoplanetDetails WHERE ExoplanetID = @ExoplanetID");
  return result.recordset[0];
};

// Check if a celestial object is used as a host star
const isUsedAsHostStar = async (objectId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("HostStarID", sql.Int, objectId)
    .query("SELECT COUNT(*) as count FROM ExoplanetDetails WHERE HostStarID = @HostStarID");
  return result.recordset[0].count > 0;
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
  isUsedAsHostStar,
};
