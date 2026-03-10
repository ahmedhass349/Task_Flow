import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';

const rootEl = document.getElementById('react-app')!;
const root = createRoot(rootEl);
root.render(<App />);