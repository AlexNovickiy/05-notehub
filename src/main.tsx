// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
// Нормалізація стилів
import 'modern-normalize';
// Глобальні стилі
import './global.css';
// src/main.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
