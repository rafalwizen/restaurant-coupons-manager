import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <RouterProvider router={router} />
                <ToastContainer />
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;