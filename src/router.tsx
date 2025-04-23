import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppLayout />,
        children: [
            // Public routes
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'unauthorized',
                element: <UnauthorizedPage />,
            },

            // Protected routes (require auth)
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'dashboard',
                        element: <DashboardPage />,
                    },
                ],
            },

            // Protected admin routes (require admin role)
            {
                element: <ProtectedRoute requireAdmin={true} />,
                children: [
                    // Admin routes will go here when implementing coupon management
                ],
            },

            // 404 route
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);