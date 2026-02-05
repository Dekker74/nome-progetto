import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EmailVerification from './EmailVerification';

export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (!currentUser.emailVerified) {
        return <EmailVerification />;
    }

    return children;
}
