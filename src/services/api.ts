// API service for Cosmic Vault backend
// Base URL for the backend API

// Use the backend URL where the Express server is running
// (backend started on port 5173 in the current environment)
const API_URL = 'http://localhost:5173';

// ============ USERS ============

export const userAPI = {
  // Create a new user (signup)
  async create(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create user');
    return data.data;
  },

  // Login user
  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/users/login/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    return data.data;
  },

  // Get all users
  async getAll() {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data.data;
  },

  // Get user by ID
  async getById(id: number) {
    const response = await fetch(`${API_URL}/users/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  // Update user
  async update(id: number, username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user');
    return data.data;
  },

  // Delete user
  async delete(id: number) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  }
};

// ============ OBJECT TYPES ============

export const typeAPI = {
  // Get all object types
  async getAll() {
    const response = await fetch(`${API_URL}/types`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch types');
    return data.data;
  },

  // Create object type
  async create(typeName: string, description: string = '') {
    const response = await fetch(`${API_URL}/types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typeName, description })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create type');
    return data.data;
  },

  // Delete type
  async delete(id: number) {
    const response = await fetch(`${API_URL}/types/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete type');
    return data;
  }
};

// ============ CONSTELLATIONS ============

export const constellationAPI = {
  // Get all constellations
  async getAll() {
    const response = await fetch(`${API_URL}/constellations`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch constellations');
    return data.data;
  },

  // Get constellation by ID
  async getById(id: number) {
    const response = await fetch(`${API_URL}/constellations/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch constellation');
    return data.data;
  },

  // Create constellation
  async create(name: string, description: string = '', abbreviation: string = '') {
    const response = await fetch(`${API_URL}/constellations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, abbreviation })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create constellation');
    return data.data;
  },

  // Update constellation
  async update(id: number, name: string, description: string = '', abbreviation: string = '') {
    const response = await fetch(`${API_URL}/constellations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, abbreviation })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update constellation');
    return data.data;
  },

  // Delete constellation
  async delete(id: number) {
    const response = await fetch(`${API_URL}/constellations/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete constellation');
    return data;
  }
};

// ============ CELESTIAL OBJECTS ============

export interface CelestialObject {
  ObjectID?: number;
  Name?: string;
  TypeID?: number;
  TypeName?: string;
  ConstellationID?: number;
  ConstellationName?: string;
  RightAscension?: string;
  Declination?: string;
  Magnitude?: number;
  Distance?: number;
  StarID?: number;
  SpectralClass?: string;
  LuminosityClass?: string;
  Temperature?: number;
  Mass?: number;
  ExoplanetID?: number;
  HostStarID?: number;
  OrbitalPeriod?: number;
  SemiMajorAxis?: number;
  Eccentricity?: number;
}

export const objectAPI = {
  // Get all celestial objects (with JOINs)
  async getAll(): Promise<CelestialObject[]> {
    const response = await fetch(`${API_URL}/objects`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch objects');
    return data.data;
  },

  // Get celestial object by ID (with full details)
  async getById(id: number): Promise<CelestialObject> {
    const response = await fetch(`${API_URL}/objects/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch object');
    return data.data;
  },

  // Create celestial object with star/exoplanet details
  async create(obj: {
    name: string;
    typeId: number;
    constellationId?: number;
    rightAscension?: string;
    declination?: string;
    magnitude?: number;
    distance?: number;
    starDetails?: {
      spectralClass?: string;
      luminosityClass?: string;
      temperature?: number;
      mass?: number;
    };
    exoplanetDetails?: {
      hostStarId?: number;
      orbitalPeriod?: number;
      semiMajorAxis?: number;
      eccentricity?: number;
    };
  }) {
    const response = await fetch(`${API_URL}/objects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create object');
    return data.data;
  },

  // Update celestial object
  async update(id: number, obj: any) {
    const response = await fetch(`${API_URL}/objects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update object');
    return data.data;
  },

  // Delete celestial object
  async delete(id: number) {
    const response = await fetch(`${API_URL}/objects/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete object');
    return data;
  }
};

// ============ OBSERVATION LOGS ============

export interface ObservationLog {
  LogID?: number;
  UserID?: number;
  Username?: string;
  ObjectID?: number;
  ObjectName?: string;
  ObservationDate?: string;
  Notes?: string;
  Equipment?: string;
  SeeingCondition?: string;
}

export const logAPI = {
  // Get all observation logs (with JOINs)
  async getAll(): Promise<ObservationLog[]> {
    const response = await fetch(`${API_URL}/logs`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch logs');
    return data.data;
  },

  // Get observation logs for a specific user
  async getByUser(userId: number): Promise<ObservationLog[]> {
    const response = await fetch(`${API_URL}/logs/user/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user logs');
    return data.data;
  },

  // Get observation log by ID (with details)
  async getById(id: number): Promise<ObservationLog> {
    const response = await fetch(`${API_URL}/logs/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch log');
    return data.data;
  },

  // Create observation log
  async create(log: {
    UserID: number;
    ObjectID: number;
    ObservationDate: string;
    Notes?: string;
    Equipment?: string;
    SeeingCondition?: string;
    Location?: string;
  }) {
    const response = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create log');
    return data.data;
  },

  // Update observation log
  async update(id: number, log: any) {
    const response = await fetch(`${API_URL}/logs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update log');
    return data.data;
  },

  // Delete observation log
  async delete(id: number) {
    const response = await fetch(`${API_URL}/logs/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete log');
    return data;
  }
};
