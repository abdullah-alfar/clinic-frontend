import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

// Inject access token on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('clinic-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {}
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axios(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const stored = localStorage.getItem('clinic-auth');
        const refreshToken = stored ? JSON.parse(stored)?.state?.refreshToken : null;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken });
        const newAccess = data.data.access_token;
        const newRefresh = data.data.refresh_token;

        // Update zustand persisted store
        const current = JSON.parse(localStorage.getItem('clinic-auth') || '{}');
        if (current?.state) {
          current.state.accessToken = newAccess;
          current.state.refreshToken = newRefresh;
          localStorage.setItem('clinic-auth', JSON.stringify(current));
        }

        processQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return axios(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Force logout
        localStorage.removeItem('clinic-auth');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
