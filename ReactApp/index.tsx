import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { initializeApi } from './config/api';

const rootEl = document.getElementById('react-app')!;
const root = createRoot(rootEl);

// Initialize API configuration (handles Electron backend URL resolution)
initializeApi().then(() => {
  console.log('[App] API initialized, rendering...');
  root.render(<App />);
}).catch((error) => {
  console.error('[App] Failed to initialize API:', error);
  root.render(<App />);
});