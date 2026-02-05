import React from 'react';
import { Moon, Sun, LogOut, UtensilsCrossed } from 'lucide-react';

export default function Layout({ children, darkMode, toggleDarkMode, onLogout, currentUser }) {
    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                {/* Animated background blobs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Header */}
                <header className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                    <UtensilsCrossed className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                        Gestione Dispensa
                                    </h1>
                                    {currentUser && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {currentUser.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                                    aria-label="Toggle dark mode"
                                >
                                    {darkMode ? (
                                        <Sun className="w-5 h-5 text-yellow-500" />
                                    ) : (
                                        <Moon className="w-5 h-5 text-gray-700" />
                                    )}
                                </button>

                                {onLogout && (
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
