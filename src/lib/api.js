const API_BASE_URL = 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    // Check for token in both possible keys for backward compatibility
    this.token = localStorage.getItem('authToken') || localStorage.getItem('token');
    // Ensure we use the consistent key
    if (this.token && !localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', this.token);
      localStorage.removeItem('token');
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          this.logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(username, email, password, role = 'staff') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async verifyToken() {
    if (!this.token) {
      throw new Error('No token available');
    }
    
    return await this.request('/auth/verify');
  }

  logout() {
    this.setToken(null);
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats() {
    return await this.request('/auth/stats');
  }

  // HTTP method helpers
  async get(endpoint, options = {}) {
    return await this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post(endpoint, data = null, options = {}) {
    return await this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return await this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return await this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

export const apiClient = new ApiClient();