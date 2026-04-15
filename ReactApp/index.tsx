import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { initializeApi, refreshEndpoints } from './config/api';

const rootEl = document.getElementById('react-app')!;
const root = createRoot(rootEl);

// Initialize API configuration (handles Electron backend URL resolution)
// refreshEndpoints() re-builds ENDPOINTS with the resolved base URL before
// React renders so every component gets the correct fully-qualified URL.
initializeApi().then(() => {
  refreshEndpoints();
  root.render(<App />);
}).catch(() => {
  refreshEndpoints(); // still rebuild even on error so relative URLs are used
  root.render(<App />);
});