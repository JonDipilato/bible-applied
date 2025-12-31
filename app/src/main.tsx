import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Debug: Check Tauri availability at startup
const checkTauri = () => {
  const w = window as unknown as Record<string, unknown>;
  console.log('=== TAURI STATUS ===');
  console.log('__TAURI__:', '__TAURI__' in window, w.__TAURI__);
  console.log('__TAURI_INTERNALS__:', '__TAURI_INTERNALS__' in window, w.__TAURI_INTERNALS__);
  console.log('__TAURI_IPC__:', '__TAURI_IPC__' in window, w.__TAURI_IPC__);
  console.log('====================');
};

// Check immediately and after delays
checkTauri();
setTimeout(checkTauri, 100);
setTimeout(checkTauri, 500);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
