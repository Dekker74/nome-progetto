import React from 'react';

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
    const categories = ['Tutti', 'Latticini', 'Verdure', 'Frutta', 'Carne', 'Cereali', 'Bevande'];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${selectedCategory === category
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
