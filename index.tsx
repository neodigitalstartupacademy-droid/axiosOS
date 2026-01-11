import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  
  // Render immediately to start lifecycle
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Fast cleanup of the loader
  const hideLoader = () => {
    const loader = document.getElementById('stark-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        loader.remove();
      }, 400);
    }
  };

  // Monitor the mount point
  let checkCount = 0;
  const checkMount = setInterval(() => {
    checkCount++;
    if (container.children.length > 0 || checkCount > 50) {
      hideLoader();
      clearInterval(checkMount);
    }
  }, 50);
}