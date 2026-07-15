import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// First-run flag so the tour auto-starts only once per browser. Replaying via
// the "?" button always works regardless of this flag.
const TOUR_KEY = 'fdc_tour_seen';

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(TOUR_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(TOUR_KEY, '1');
  } catch {
    /* ignore */
  }
}

// Walks newcomers through the main features by highlighting the real UI.
export function startTour() {
  const d = driver({
    popoverClass: 'fdc-tour',
    showProgress: true,
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Done',
    onDestroyed: markSeen,
    steps: [
      {
        popover: {
          title: '👋 Welcome to the FDC Tracker',
          description:
            'Track your Magic draft results — wins, colors, ranks and rewards over time. Here is a quick tour. You can replay it anytime from the “?” button.',
        },
      },
      {
        element: '#btn-new-event',
        popover: {
          title: '➕ Log a draft',
          description:
            'Add a single draft result by hand — set, format, record, colors and notes.',
        },
      },
      {
        element: '#btn-import',
        popover: {
          title: '⬆ Import from 17Lands',
          description:
            'Already track on 17Lands? Copy rows from your draft history table and paste them here to bulk-import. Duplicates are skipped automatically.',
        },
      },
      {
        element: '#filters-section',
        popover: {
          title: '🔎 Filter your history',
          description:
            'Narrow events down by set, format or date range. The stats below update to match.',
        },
      },
      {
        element: '.tab-bar',
        popover: {
          title: '📊 Stats & rewards',
          description:
            'Switch between your Event List, Performance trends, and the Rewards breakdown.',
        },
      },
      {
        popover: {
          title: "🎉 You're all set!",
          description:
            'Log your first draft or import your 17Lands history to get started. Happy drafting!',
        },
      },
    ],
  });
  d.drive();
}

// Auto-start on first visit, after the DOM has settled so targets exist.
export function maybeAutoStartTour() {
  if (hasSeenTour()) return;
  window.setTimeout(startTour, 600);
}
