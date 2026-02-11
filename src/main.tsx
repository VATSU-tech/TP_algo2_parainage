import { StrictMode } from 'react' // Active des vérifications supplémentaires en dev.
import { createRoot } from 'react-dom/client' // Point d'entrée React 18.
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // Routing côté client.
import './index.css' // CSS global (tailwind + daisyUI).
import App from './App.tsx' // Page principale.
import Login from './pages/login.tsx' // Page de connexion.
import Inscription from './pages/Inscription.tsx' // Page d'inscription.
import NotFound from './pages/NotFound.tsx' // Page 404.
import Profil from './pages/Profil.tsx' // Page profil.

// Définition des routes de l'application.
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
// Rendu racine de l'app React + injection du router.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

/*
Résumé pédagogique du fichier:
- Ce fichier est le point d'entrée React.
- Il déclare les routes principales (/, /login, /inscription, /profil, *).
- Il rend l'application dans #root en utilisant React 18 et React Router.
*/
