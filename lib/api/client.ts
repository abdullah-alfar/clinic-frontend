import axios from 'axios';
import { toast } from 'sonner';
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

/** Clears auth state and redirects to /login with an optional toast message. */
function forceLogout(message?: string) {
  useAuthStore.getState().logout();
  if (message) {
    // Delay slightly so the toast renders before navigation tears down the provider.
    setTimeout(() => toast.error(message, { duration: 5000 }), 50);
  }
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ─── Request interceptor — inject access token ────────────────────────────────

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

// ─── Response interceptor — handle 401 with silent refresh ───────────────────

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Only handle 401s that haven't already been retried.
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Determine the specific auth failure reason from the API error code.
    const errorCode: string | undefined = error.response?.data?.error?.code;

    // ── If another refresh is already in flight, queue this request ──────────
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

    const { refreshToken, setTokens } = useAuthStore.getState();

    // ── No refresh token available — force logout immediately ────────────────
    if (!refreshToken) {
      processQueue(error, null);
      isRefreshing = false;
      forceLogout(
        errorCode === 'TOKEN_EXPIRED'
          ? 'Your session has expired. Please log in again.'
          : 'You have been logged out. Please log in again.',
      );
      return Promise.reject(error);
    }

    // ── Attempt silent token refresh ─────────────────────────────────────────
    try {
      const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
        refresh_token: refreshToken,
      });
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
      // Refresh token itself has expired or is invalid — full logout required.
      processQueue(refreshErr, null);
      forceLogout('Your session has expired. Please log in again.');
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);
