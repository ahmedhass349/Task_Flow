import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { initializeApi, refreshEndpoints } from './config/api';

/*
  FILE: ReactApp/index.tsx
  PHASE: Phase 1
  MISSION: 3-Startup
  CHANGES:
    - P1.6: Removed the initializeApi() block on root.render().
      Previously the app waited for an Electron IPC round-trip before the
      first paint, causing a blank white screen for ~100–200ms.
      In production, index.html is served by the backend itself, so all
      relative API paths (/api/...) resolve correctly without an explicit
      base URL. initializeApi() still runs in the background and refreshes
      ENDPOINTS once the absolute URL is known.
*/

const rootEl = document.getElementById('react-app')!;
const root = createRoot(rootEl);

// Render immediately — do not block on the IPC round-trip.
root.render(<App />);

// Resolve the backend base URL in the background.
// refreshEndpoints() updates every ENDPOINTS string once the URL is known.
initializeApi()
  .then(() => refreshEndpoints())
  .catch(() => refreshEndpoints());