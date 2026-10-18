import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { applyContentOverride } from '@/lib/content-override';
import { router } from '@/router';
import '@/index.css';

applyContentOverride();

const container = document.getElementById('root');

if (!container) {
  throw new Error('找不到 #root 挂载点');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
