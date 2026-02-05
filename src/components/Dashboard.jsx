import React from 'react';
import { Package, AlertTriangle, Leaf, TrendingUp, Calendar } from 'lucide-react';
import { getDaysUntilExpiration } from '../utils/productHelpers';

export default function Dashboard({ products }) {
    const totalProducts = products.length;

    // Calcolo statistiche
    let expiringSoon = 0;
    let expired = 0;
    let fresh = 0;

    products.forEach(product => {
        const days = getDaysUntilExpiration(product.expirationDate);
        if (days < 0) expired++;
        else if (days <= 3) expiringSoon++;
        else fresh++;
    });

    // Greeting basato sull'ora
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon Pomeriggio' : 'Buonasera';

    return (
        <div className="mb-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                        {greeting}, Chef! <span className="inline-block animate-wave origin-[70%_70%]">👨‍🍳</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Ecco la panoramica della tua dispensa oggi.
                    </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Oggi</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                            {new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Card: Total Products */}
                <div className="md:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 rotate-12">
                        <Package size={140} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <Package className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-emerald-50">Totale Prodotti</span>
                        </div>
                        <div>
                            <h3 className="text-5xl font-extrabold mb-2 tracking-tight">{totalProducts}</h3>
                            <p className="text-emerald-100 text-sm font-medium">Elementi in dispensa</p>
                        </div>
                    </div>
                </div>

                {/* Status Cards Container */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Expiring/Expired Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${expired > 0 ? 'from-red-500/10 to-red-600/10' : 'from-yellow-500/10 to-orange-500/10'} rounded-bl-full -mr-4 -mt-4 transition-colors`}></div>

                        <div className="flex justify-between items-start mb-6 relative">
                            <div className={`p-3 rounded-2xl ${expired > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            {(expiringSoon > 0 || expired > 0) && (
                                <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase rounded-full animate-pulse">
                                    Azione Richiesta
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                    {expired + expiringSoon}
                                </h3>
                                <span className="text-sm text-gray-500 font-medium">prodotti</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {expired > 0
                                    ? `${expired} scaduti, ${expiringSoon} in scadenza`
                                    : 'Da consumare a breve'}
                            </p>
                        </div>
                    </div>

                    {/* Fresh Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-full">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{fresh}</h3>
                                <span className="text-sm text-gray-500 font-medium">prodotti</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                In ottime condizioni
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
