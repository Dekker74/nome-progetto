import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Sparkles, ArrowRight, Bot, Loader2, RotateCcw } from 'lucide-react';
import RecipeModal from './RecipeModal';
import { generateAiRecipes } from '../utils/aiService';

export default function RecipeSection({ recipes: initialRecipes, products, onCookRecipe, onOpenChat }) {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [aiRecipes, setAiRecipes] = useState(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // Auto-generate recipes when products change (Debounced)
    useEffect(() => {
        if (products.length < 2) return;

        const timer = setTimeout(async () => {
            setIsLoadingAi(true);
            try {
                const newRecipes = await generateAiRecipes(products);
                if (newRecipes && newRecipes.length > 0) {
                    setAiRecipes(newRecipes);
                }
            } catch (e) {
                console.error("Auto-gen error:", e);
            } finally {
                setIsLoadingAi(false);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [products]);

    // Usa le ricette AI se disponibili, altrimenti quelle standard (arricchite)
    const currentRecipes = aiRecipes || initialRecipes.map(recipe => ({
        ...recipe,
        image: recipe.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.name + ' professional food photography')}?width=800&height=600&nologo=true`,
        usedIngredients: recipe.ingredients || [],
        steps: recipe.steps || []
    }));

    const handleReset = () => {
        setAiRecipes(null);
    };

    if (products.length === 0 && !aiRecipes) {
        return (
            <div className="mt-12 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/30 p-12 text-center animate-fade-in">
                <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ancora nessuna ricetta
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Aggiungi ingredienti e lo Chef AI ti proporrà piatti stellati! ✨
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
                        {aiRecipes ? <Bot className="w-6 h-6 text-white animate-bounce" /> : <Sparkles className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {aiRecipes ? 'Suggerimenti Chef AI' : 'Ricette Suggerite'}
                            {aiRecipes && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">Powered by AI</span>}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {aiRecipes ? 'Create apposta per te in tempo reale' : 'Idee basate sui tuoi ingredienti'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {aiRecipes && (
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Standard
                        </button>
                    )}
                    <button
                        onClick={onOpenChat}
                        disabled={products.length === 0}
                        className={`px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:scale-[1.02] transition-all flex items-center gap-2`}
                    >
                        <Bot className="w-5 h-5" />
                        Chiedi all'AI
                    </button>
                </div>
            </div>

            {currentRecipes.length === 0 && !isLoadingAi ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 font-medium">Nessuna ricetta trovata con questi ingredienti. Prova a chiederne altre all'AI!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentRecipes.map((recipe, index) => (
                        <div
                            key={recipe.id || index}
                            onClick={() => setSelectedRecipe(recipe)}
                            className="group flex flex-col h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Header */}
                            <div className="relative h-52 overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-all" />
                                <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = recipe.fallback || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`;
                                    }}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />

                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${recipe.difficulty === 'Facile' ? 'bg-green-500/90 text-white' :
                                        recipe.difficulty === 'Media' ? 'bg-yellow-500/90 text-white' :
                                            'bg-red-500/90 text-white'
                                        }`}>
                                        {recipe.difficulty || 'Media'}
                                    </span>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                    <h3 className="text-xl font-bold text-white mb-1 shadow-text drop-shadow-md group-hover:text-orange-200 transition-colors line-clamp-2">
                                        {recipe.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                    {recipe.description}
                                </p>

                                <div className="space-y-4 mt-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {(recipe.ingredients || recipe.usedIngredients || []).slice(0, 3).map((ingredient, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                                            >
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            <span>{recipe.time || '30 min'}</span>
                                        </div>
                                        <span className="text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Vedi dettagli <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <RecipeModal
                recipe={selectedRecipe ? {
                    ...selectedRecipe,
                    title: selectedRecipe.name,
                    usedIngredients: (selectedRecipe.ingredients || selectedRecipe.usedIngredients || []),
                    steps: (selectedRecipe.steps || [])
                } : null}
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                onCook={(r) => {
                    if (onCookRecipe) onCookRecipe(r);
                    setSelectedRecipe(null);
                }}
            />
        </div>
    );
}
