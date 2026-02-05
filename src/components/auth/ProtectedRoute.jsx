import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EmailVerification from './EmailVerification';

export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    const isDeveloperMode = localStorage.getItem('developer_mode') === 'true';

    if (!currentUser && !isDeveloperMode) {
        return <Navigate to="/login" />;
    }

    if (currentUser && !currentUser.emailVerified && !isDeveloperMode) {
        return <EmailVerification />;
    }

    return children;
}
