import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './Router/Router.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './AuthProvider/AuthProvider.jsx'
import { HelmetProvider } from 'react-helmet-async'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <HelmetProvider>
   <QueryClientProvider client={queryClient}>
<AuthProvider>
      <RouterProvider router={router}></RouterProvider>

</AuthProvider>
  </QueryClientProvider>
 </HelmetProvider>
  </StrictMode>
)
