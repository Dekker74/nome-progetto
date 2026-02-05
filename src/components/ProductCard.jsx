import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { getDaysUntilExpiration, getHealthStatus, getExpirationStatus, getCategoryImage } from '../utils/productHelpers';

export default function ProductCard({ product, onDelete }) {
    const daysUntilExpiration = getDaysUntilExpiration(product.expirationDate);
    const healthStatus = getHealthStatus(product.category, daysUntilExpiration);
    const expirationStatus = getExpirationStatus(daysUntilExpiration);

    // Immagine prodotto o fallback
    const productImage = product.image || getCategoryImage(product.category);

    const categoryColors = {
        'Latticini': 'from-blue-500 to-cyan-600',
        'Verdure': 'from-green-500 to-emerald-600',
        'Frutta': 'from-pink-500 to-rose-600',
        'Carne': 'from-red-500 to-orange-600',
        'Cereali': 'from-yellow-500 to-amber-600',
        'Bevande': 'from-purple-500 to-indigo-600',
        'Altro': 'from-gray-500 to-gray-600'
    };

    const categoryGradient = categoryColors[product.category] || categoryColors['Altro'];

    return (
        <div className="group relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:scale-[1.02] animate-fade-in flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10`} />
                <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryGradient} text-white shadow-lg`}>
                        {product.category}
                    </span>
                </div>

                {/* Delete Button (moved to top-left over image for cleaner look and better mobile access) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                    }}
                    className="absolute top-4 left-4 z-20 p-2 bg-white/20 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Elimina prodotto"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto space-y-3">
                    {/* Health indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow-md">{healthStatus.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                            {healthStatus.label}
                        </span>
                    </div>

                    {/* Expiration Status */}
                    <div className={`p-3 rounded-xl border ${expirationStatus.className} flex items-center gap-3 shadow-sm`}>
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${expirationStatus.textClass}`} />
                        <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold uppercase tracking-wider ${expirationStatus.textClass}`}>
                                {expirationStatus.label}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                {new Date(product.expirationDate).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
