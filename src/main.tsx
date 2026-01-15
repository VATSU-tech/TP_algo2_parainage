import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/login.tsx'
import Inscription from './pages/Inscription.tsx'
import NotFound from './pages/NotFound.tsx'
import Profil from './pages/Profil.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/inscription',
        element: <Inscription />,
    },
    {
        path: '/profil',
        element: <Profil />,
    },
    {
      path:"*",
      element: <NotFound />
    }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
