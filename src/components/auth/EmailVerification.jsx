import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function EmailVerification() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { currentUser, resendVerificationEmail, logout, verifyEmailAddress } = useAuth();
    const navigate = useNavigate();

    // Se l'utente è già verificato, reindirizza alla home
    React.useEffect(() => {
        if (currentUser?.emailVerified) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    async function handleResend() {
        try {
            setLoading(true);
            setError('');
            setMessage('');
            await resendVerificationEmail();
            setMessage('Email di verifica inviata! Controlla la tua casella di posta.');
        } catch (err) {
            setError('Errore durante l\'invio dell\'email. Riprova più tardi.');
        }
        setLoading(false);
    }

    // Funzione per DEMO: Simula la verifica istantanea
    function handleSimulateVerify() {
        verifyEmailAddress();
        // Non serve reload, il navigate nell'useEffect scatterà al cambio di stato
        // O forziamo per sicurezza:
        navigate('/');
    }

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            setError('Errore durante il logout');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg animate-pulse">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                            Verifica Email
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Controlla la tua casella di posta
                        </p>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Ti abbiamo inviato un'email di verifica a:
                        </p>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mt-1">
                            {currentUser?.email}
                        </p>
                        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">MODALITÀ DEMO LOCALE:</p>
                            <button
                                onClick={handleSimulateVerify}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Simula Click su Link Email
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="w-full py-3 px-6 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            {loading ? 'Invio in corso...' : 'Invia di nuovo l\'email'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
