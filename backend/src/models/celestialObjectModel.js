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
      co.Magnitude,
      co.Distance,
      sd.StarID,
      sd.SurfaceTemperature,
      sd.Luminosity,
      sd.Radius,
      sd.Mass,
      ed.ExoplanetID,
      ed.HostStarName,
      ed.DiscoveryYear,
      ed.OrbitalPeriod,
      ed.Radius as PlanetRadius
    FROM CelestialObjects co
    LEFT JOIN ObjectTypes ot ON co.TypeID = ot.TypeID
    LEFT JOIN Constellations c ON co.ConstellationID = c.ConstellationID
    LEFT JOIN StarDetails sd ON co.ObjectID = sd.ObjectID
    LEFT JOIN ExoplanetDetails ed ON co.ObjectID = ed.ObjectID
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
        co.Magnitude,
        co.Distance,
        sd.StarID,
        sd.SurfaceTemperature,
        sd.Luminosity,
        sd.Radius,
        sd.Mass,
        ed.ExoplanetID,
        ed.HostStarName,
        ed.DiscoveryYear,
        ed.OrbitalPeriod,
        ed.Radius as PlanetRadius
      FROM CelestialObjects co
      LEFT JOIN ObjectTypes ot ON co.TypeID = ot.TypeID
      LEFT JOIN Constellations c ON co.ConstellationID = c.ConstellationID
      LEFT JOIN StarDetails sd ON co.ObjectID = sd.ObjectID
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
    .input("RightAscension", sql.VarChar, ra)
    .input("Declination", sql.VarChar, dec)
    .input("Magnitude", sql.Float, magnitude)
    .input("Distance", sql.Float, distance)
    .query(
      "INSERT INTO CelestialObjects (Name, TypeID, ConstellationID, RightAscension, Declination, Magnitude, Distance) VALUES (@Name, @TypeID, @ConstellationID, @RightAscension, @Declination, @Magnitude, @Distance); SELECT SCOPE_IDENTITY() as ObjectID"
    );
  return result.recordset[0].ObjectID;
};

// CREATE star details
const createStarDetails = async (objectId, surfaceTemp, luminosity, radius, mass) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .input("SurfaceTemperature", sql.Float, surfaceTemp)
    .input("Luminosity", sql.Float, luminosity)
    .input("Radius", sql.Float, radius)
    .input("Mass", sql.Float, mass)
    .query(
      "INSERT INTO StarDetails (ObjectID, SurfaceTemperature, Luminosity, Radius, Mass) VALUES (@ObjectID, @SurfaceTemperature, @Luminosity, @Radius, @Mass); SELECT SCOPE_IDENTITY() as StarID"
    );
  return result.recordset[0].StarID;
};

// CREATE exoplanet details
const createExoplanetDetails = async (objectId, hostStarName, discoveryYear, orbitalPeriod, planetRadius) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ObjectID", sql.Int, objectId)
    .input("HostStarName", sql.VarChar, hostStarName)
    .input("DiscoveryYear", sql.Int, discoveryYear)
    .input("OrbitalPeriod", sql.Float, orbitalPeriod)
    .input("Radius", sql.Float, planetRadius)
    .query(
      "INSERT INTO ExoplanetDetails (ObjectID, HostStarName, DiscoveryYear, OrbitalPeriod, Radius) VALUES (@ObjectID, @HostStarName, @DiscoveryYear, @OrbitalPeriod, @Radius); SELECT SCOPE_IDENTITY() as ExoplanetID"
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
    .input("RightAscension", sql.VarChar, ra)
    .input("Declination", sql.VarChar, dec)
    .input("Magnitude", sql.Float, magnitude)
    .input("Distance", sql.Float, distance)
    .query(
      "UPDATE CelestialObjects SET Name = @Name, TypeID = @TypeID, ConstellationID = @ConstellationID, RightAscension = @RightAscension, Declination = @Declination, Magnitude = @Magnitude, Distance = @Distance WHERE ObjectID = @ObjectID"
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
