import type { User, MenuItem, Order, Reservation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = (): string | null => {
  return localStorage.getItem('ember_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('ember_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('ember_token');
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const authApi = {
  login: async (credentials: { email: string; password: string}) => {
    const res = await apiFetch<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const res = await apiFetch<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  googleLogin: async (idToken: string, isStaff = false) => {
    const res = await apiFetch<{ success: boolean; token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: idToken, isStaff }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  getMe: async () => {
    return apiFetch<{ success: boolean; data: User }>('/auth/me');
  },
};

export const menuApi = {
  getMenuItems: async (category?: string) => {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return apiFetch<{ success: boolean; data: MenuItem[] }>(`/menu${query}`);
  },
};

export const orderApi = {
  createOrder: async (orderData: Partial<Order>) => {
    return apiFetch<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  getMyOrders: async () => {
    return apiFetch<{ success: boolean; data: Order[] }>('/orders/my-orders');
  },
};

export const reservationApi = {
  createReservation: async (reservationData: Partial<Reservation>) => {
    return apiFetch<{ success: boolean; data: Reservation }>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },
};
