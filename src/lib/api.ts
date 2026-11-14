import type {
  AssetKey,
  AuthUser,
  EventCategory,
  EventItem,
  GalleryItem,
  InquiryItem,
  InquiryStatus,
  SiteDataResponse,
} from '../shared/types';

const TOKEN_STORAGE_KEY = 'es_auth_token';

function getStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota / iframe restrictions
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(path, {
    ...init,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Request failed (${res.status})`) as Error & {
      errors?: Record<string, string>;
      status?: number;
    };
    error.errors = data.errors;
    error.status = res.status;
    throw error;
  }
  return data as T;
}

export async function fetchSiteData(): Promise<SiteDataResponse> {
  return request<SiteDataResponse>('/api/site-data');
}

export async function submitInquiry(payload: {
  name: string;
  phone: string;
  message: string;
}): Promise<{ inquiry: InquiryItem }> {
  return request<{ inquiry: InquiryItem }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchInquiries(): Promise<{ inquiries: InquiryItem[] }> {
  return request<{ inquiries: InquiryItem[] }>('/api/inquiries');
}

export async function updateInquiryStatusApi(
  id: string,
  status: InquiryStatus,
): Promise<{ inquiry: InquiryItem }> {
  return request<{ inquiry: InquiryItem }>(`/api/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function createEventApi(payload: {
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  guests: number;
  summary: string;
  highlights: string[];
  imageKey: AssetKey;
  customImageUrl?: string;
  featured?: boolean;
}): Promise<{ event: EventItem }> {
  return request<{ event: EventItem }>('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteEventApi(id: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/api/events/${id}`, {
    method: 'DELETE',
  });
}

export async function createGalleryItemApi(payload: {
  title: string;
  category: EventCategory;
  venue: string;
  imageKey: AssetKey;
  customImageUrl?: string;
  aspect: 'tall' | 'wide' | 'square';
}): Promise<{ item: GalleryItem }> {
  return request<{ item: GalleryItem }>('/api/gallery', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signInApi(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  const result = await request<{ token: string; user: AuthUser }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(result.token);
  return result;
}

export async function signUpApi(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  const result = await request<{ token: string; user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setStoredToken(result.token);
  return result;
}

export async function demoSignInApi(): Promise<{ token: string; user: AuthUser }> {
  const result = await request<{ token: string; user: AuthUser }>('/api/auth/demo', {
    method: 'POST',
  });
  setStoredToken(result.token);
  return result;
}

export async function fetchCurrentUser(): Promise<{ user: AuthUser | null }> {
  return request<{ user: AuthUser | null }>('/api/auth/me');
}

export async function signOutApi(): Promise<void> {
  await request<{ ok: boolean }>('/api/auth/signout', { method: 'POST' }).catch(() => {});
  setStoredToken(null);
}
