import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

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
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // If it's a 401 and not already a retry
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (original.headers && typeof original.headers.set === 'function') {
              original.headers.set('Authorization', `Bearer ${token}`);
            } else if (original.headers) {
              original.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient.request(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken });
        const { access_token: newAccess, refresh_token: newRefresh } = data.data;

        setTokens(newAccess, newRefresh);

        processQueue(null, newAccess);
        
        if (original.headers && typeof original.headers.set === 'function') {
          original.headers.set('Authorization', `Bearer ${newAccess}`);
        } else if (original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
        }

        return apiClient.request(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
