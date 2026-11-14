import { useState, type FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import { demoSignInApi, signInApi, signUpApi } from '../lib/api';
import type { AuthUser } from '../shared/types';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export function AuthModal({ open, onClose, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === 'signin'
          ? await signInApi(email, password)
          : await signUpApi(name, email, password);
      onAuthenticated(res.user);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoSignIn() {
    setError(null);
    setLoading(true);
    try {
      const res = await demoSignInApi();
      onAuthenticated(res.user);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Unable to sign in with demo account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Organizer Sign In"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close sign in dialog"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-bold text-slate-900">
          {mode === 'signin' ? 'Organizer Sign In' : 'Create Organizer Account'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage events, gallery showcases, and incoming client inquiries.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="block text-xs font-semibold text-slate-800 mb-1"
              >
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nabilaevents.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B93FF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#141D42] hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium text-[#1E40AF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            Continue as Lead Producer
          </button>

          <p className="text-center text-xs text-slate-600">
            {mode === 'signin' ? 'Need a new organizer login?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="font-semibold text-[#4B93FF] hover:underline cursor-pointer"
            >
              {mode === 'signin' ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
