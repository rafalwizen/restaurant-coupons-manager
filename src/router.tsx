import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import CouponListPage from './pages/CouponListPage';
import CouponDetailPage from './pages/CouponDetailPage';
import CreateCouponPage from './pages/CreateCouponPage';
import EditCouponPage from './pages/EditCouponPage';
import ImageManagerPage from './pages/ImageManagerPage';

const router = createBrowserRouter([
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
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/unauthorized',
                element: <UnauthorizedPage />,
            },

            // Admin routes
            {
                path: '/admin/coupons',
                element: (
                    <ProtectedRoute requiredRole="ADMIN">
                        <CouponListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin/coupons/new',
                element: (
                    <ProtectedRoute requiredRole="ADMIN">
                        <CreateCouponPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin/coupons/:id',
                element: (
                    <ProtectedRoute requiredRole="ADMIN">
                        <CouponDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin/coupons/:id/edit',
                element: (
                    <ProtectedRoute requiredRole="ADMIN">
                        <EditCouponPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin/images',
                element: (
                    <ProtectedRoute requiredRole="ADMIN">
                        {/*<AppLayout>*/}
                            <ImageManagerPage />
                        {/*</AppLayout>*/}
                    </ProtectedRoute>
                ),
            },

            // 404 route
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;