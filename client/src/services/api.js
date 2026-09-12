/**
 * API Service Client for ATP Score Management System
 * Connects to the Express backend via REST API
 */

const BASE_URL = '/api/atp';

export const apiService = {
  /**
   * Check backend health and database connectivity
   */
  checkHealth: async () => {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Backend health check failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using fallback client mode:', err.message);
      return { status: 'offline', databaseConnected: false };
    }
  },

  /**
   * Get configured parameter specifications and weights
   */
  getSpecs: async () => {
    const res = await fetch(`${BASE_URL}/specs`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch parameter specifications');
    }
    return await res.json();
  },

  /**
   * Calculate ATP score preview (does not persist to DB)
   */
  calculatePreview: async (parameters) => {
    const res = await fetch(`${BASE_URL}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.errors ? data.errors.join(' ') : data.message;
      throw new Error(errorMsg || 'Score calculation failed');
    }
    return data;
  },

  /**
   * Calculate and save student ATP record
   */
  createRecord: async (recordData) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.errors ? data.errors.join(' ') : data.message;
      throw new Error(errorMsg || 'Failed to save ATP record');
    }
    return data;
  },

  /**
   * Get all ATP records with optional search query & grade filter
   */
  getAllRecords: async ({ search = '', grade = 'ALL' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (grade && grade !== 'ALL') params.append('grade', grade);

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch score history');
    }
    return data;
  },

  /**
   * Get single ATP record by ID
   */
  getRecordById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch ATP record');
    }
    return data;
  },

  /**
   * Delete ATP record by ID
   */
  deleteRecord: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete record');
    }
    return data;
  },
};
