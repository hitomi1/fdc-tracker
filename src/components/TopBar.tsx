import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function TopBar({
  onNewEvent,
  onImport,
  onHelp,
  onInstalled,
  showFreshStart,
  onFreshStart,
  authEnabled,
  userEmail,
  syncing,
  onSignIn,
  onSignOut,
}: {
  onNewEvent: () => void;
  onImport: () => void;
  onHelp: () => void;
  onInstalled: () => void;
  showFreshStart: boolean;
  onFreshStart: () => void;
  authEnabled: boolean;
  userEmail: string | null;
  syncing: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstallPrompt(null);
      onInstalled();
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [onInstalled]);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <header id="topbar" role="banner">
      <a href="#" className="brand" aria-label="Fora da Caixa Event Tracker home">
        <img src="logofdc.png" className="logo-img" alt="Fora da Caixa logo" />
        <span className="brand-sub">Event History</span>
      </a>

      <nav className="nav-actions" aria-label="Top actions">
        {showFreshStart && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onFreshStart}
            aria-label="Clear the sample data and start with an empty history"
          >
            ✨ Fresh start
          </button>
        )}
        {installPrompt && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={triggerInstall}
            aria-label="Install app for offline use"
          >
            ⬇ Install
          </button>
        )}
        <button
          id="btn-import"
          className="btn btn-ghost btn-sm"
          onClick={onImport}
          aria-label="Import events from 17Lands"
          aria-haspopup="dialog"
        >
          ⬆ Import
        </button>
        <button
          id="btn-help"
          className="btn btn-icon btn-ghost"
          onClick={onHelp}
          aria-label="How to use the app — take a tour"
          title="How to use the app"
        >
          ?
        </button>
        <button
          id="btn-new-event"
          className="btn btn-primary"
          onClick={onNewEvent}
          aria-label="Add a new draft event"
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">+</span> New Event
        </button>

        {authEnabled && !userEmail && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onSignIn}
            aria-label="Sign in to sync your data across devices"
          >
            Sign in
          </button>
        )}

        {authEnabled && userEmail && (
          <div className="account-wrap">
            <button
              className="btn btn-icon btn-ghost account-btn"
              onClick={() => setAccountOpen(o => !o)}
              aria-label={`Account: ${userEmail}`}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              title={syncing ? 'Syncing…' : userEmail}
            >
              {userEmail[0]?.toUpperCase() ?? '?'}
              {syncing && <span className="sync-dot" aria-hidden="true" />}
            </button>
            {accountOpen && (
              <>
                <div className="account-backdrop" onClick={() => setAccountOpen(false)} />
                <div className="account-menu" role="menu">
                  <div className="account-email" title={userEmail}>{userEmail}</div>
                  <div className="account-status">{syncing ? 'Syncing…' : 'Synced'}</div>
                  <button
                    className="btn btn-ghost btn-sm btn-block"
                    role="menuitem"
                    onClick={() => { setAccountOpen(false); onSignOut(); }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
