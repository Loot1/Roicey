import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import './config/i18n'
import { App } from './App'
import { ThemeProvider } from './contexts/ThemeContext'

const router = createBrowserRouter([
    {
        path: '*',
        element: (
            <ThemeProvider>
                <App />
            </ThemeProvider>
        ),
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)