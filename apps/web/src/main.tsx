import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/h-d_boutique">
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFF8F0',
            color: '#2B2B2B',
            border: '1px solid #A83279',
          },
          success: {
            iconTheme: {
              primary: '#A83279',
              secondary: '#FFF8F0',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
