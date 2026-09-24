import type {
  FinancialProfile,
  DashboardData,
  AIAnalysis,
  ProgressData
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('ca_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const data = await response.json();
      errorMsg = data.detail || data.message || errorMsg;
    } catch {
      errorMsg = `Server error: ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse<{ access_token: string; user_name: string; user_email: string }>(res);
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ access_token: string; user_name: string; user_email: string }>(res);
  },

  demoLogin: async () => {
    const res = await fetch(`${API_BASE}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ access_token: string; user_name: string; user_email: string }>(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ id: number; name: string; email: string; created_at: string }>(res);
  },

  // Financial Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/financial-profile`, {
      headers: getAuthHeader(),
    });
    return handleResponse<FinancialProfile>(res);
  },

  saveProfile: async (profileData: FinancialProfile, isEdit: boolean = false) => {
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(`${API_BASE}/financial-profile`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse<FinancialProfile>(res);
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeader(),
    });
    return handleResponse<DashboardData>(res);
  },

  // Progress
  getProgress: async () => {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ProgressData>(res);
  },

  // AI Advisor
  getAIAnalysis: async (forceRefresh: boolean = false) => {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ force_refresh: forceRefresh }),
    });
    return handleResponse<AIAnalysis>(res);
  },

  askAIChat: async (question: string) => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ question }),
    });
    return handleResponse<{ question: string; answer: string }>(res);
  },
};
