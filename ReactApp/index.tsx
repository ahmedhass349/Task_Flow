import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { initializeApi } from './config/api';

const rootEl = document.getElementById('react-app')!;
const root = createRoot(rootEl);

// Initialize API configuration (handles Electron backend URL resolution)
initializeApi().then(() => {
  root.render(<App />);
}).catch((error) => {
  root.render(<App />);
});