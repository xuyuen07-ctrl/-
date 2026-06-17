import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign ResizeObserver loop limit errors
if (typeof window !== 'undefined') {
  const preventResizeObserverError = (e: ErrorEvent) => {
    if (e.message && (
      e.message.includes('ResizeObserver') ||
      e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message === 'ResizeObserver loop limit exceeded'
    )) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };
  window.addEventListener('error', preventResizeObserverError);
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    if (e.reason && e.reason.message && (
      e.reason.message.includes('ResizeObserver') ||
      e.reason.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.reason.message === 'ResizeObserver loop limit exceeded'
    )) {
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

