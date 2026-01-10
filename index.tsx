
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Signaler au loader que l'application est prête
  const loader = document.getElementById('stark-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1000);
  }
} catch (error) {
  console.error("Critical mount error:", error);
  rootElement.innerHTML = `
    <div style="background:#000; color:#FFD700; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;">
      <h1>CRITICAL BOOT FAILURE</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="location.reload()">RETRY BOOT</button>
    </div>
  `;
}
