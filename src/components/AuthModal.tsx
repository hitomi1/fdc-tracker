import { useState } from 'react';
import type { AuthState } from '../lib/useAuth';

type Mode = 'signin' | 'signup';

export function AuthModal({
  auth,
  onClose,
  onSignedIn,
}: {
  auth: AuthState;
  onClose: () => void;
  onSignedIn?: () => void;
}) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    // Redirects away on success; only returns here on failure.
    const { error } = await auth.signInWithGoogle();
    if (error) {
      setError(error);
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    if (mode === 'signin') {
      const { error } = await auth.signInWithPassword(email.trim(), password);
      if (error) setError(error);
      else onSignedIn?.();
    } else {
      const { error, needsConfirmation } = await auth.signUpWithPassword(email.trim(), password);
      if (error) setError(error);
      else if (needsConfirmation) {
        setNotice('Check your email to confirm your account, then sign in.');
        setMode('signin');
      } else onSignedIn?.();
    }
    setBusy(false);
  };

  return (
    <div
      id="modal-overlay"
      className="visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal modal-narrow">
        <div className="modal-handle" aria-hidden="true" />

        <div className="modal-header">
          <h2 id="auth-title">{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
          <button className="btn btn-icon btn-ghost" aria-label="Close dialog" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="auth-intro">
            Sign in to save your event history and sync it across your devices.
          </p>

          <button
            type="button"
            className="btn btn-ghost btn-google"
            onClick={handleGoogle}
            disabled={busy}
          >
            <span className="g-mark" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <form noValidate autoComplete="on" onSubmit={handleSubmit}>
            <div className="field full">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="field full">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={busy}
              />
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-notice" role="status">{notice}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="link-btn"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setNotice(null); }}
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
