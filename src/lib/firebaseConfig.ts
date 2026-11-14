export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const FIREBASE_COLLECTIONS = {
  events: 'events',
  gallery: 'gallery',
  inquiries: 'inquiries',
  experiences: 'experiences',
  resources: 'resources',
} as const;

export function getFirebaseConfig(): FirebaseWebConfig {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  };
}

export const FIREBASE_ENABLED = false;

export function isFirebaseConfigured(): boolean {
  if (!FIREBASE_ENABLED) return false;
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
}

export function getFirebaseSetupSummary() {
  const cfg = getFirebaseConfig();
  return {
    configured: isFirebaseConfigured(),
    projectId: cfg.projectId || 'Not configured yet',
    envKeys: [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
    ],
    collections: Object.values(FIREBASE_COLLECTIONS),
  };
}
