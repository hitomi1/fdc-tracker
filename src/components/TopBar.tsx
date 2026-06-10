import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function TopBar({ onNewEvent, onInstalled }: { onNewEvent: () => void; onInstalled: () => void }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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
          id="btn-new-event"
          className="btn btn-primary"
          onClick={onNewEvent}
          aria-label="Add a new draft event"
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">+</span> New Event
        </button>
      </nav>
    </header>
  );
}
