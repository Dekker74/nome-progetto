import React, { useState } from 'react';
import { X, ChefHat, Clock, Users, CheckCircle, ShoppingBag, Flame, PartyPopper, Loader2 } from 'lucide-react';

export default function RecipeModal({ recipe, isOpen, onClose, onCook }) {
    const [isCooking, setIsCooking] = useState(false);
    const [isGuidedMode, setIsGuidedMode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    if (!isOpen || !recipe) return null;

    // Usa i passi dalla ricetta, se disponibili, altrimenti genera dei passi di default
    const getSteps = () => {
        if (recipe.steps && Array.isArray(recipe.steps) && recipe.steps.length > 0) {
            return recipe.steps;
        }
        return [
            "Prepara tutti gli ingredienti sul piano di lavoro.",
            "Lava accuratamente le verdure e tagliale a pezzetti regolari.",
            "In una padella antiaderente o pentola capiente, scalda un filo d'olio.",
            "Cuoci gli ingredienti principali a fuoco medio per circa 10-15 minuti.",
            "Aggiusta di sale e pepe e aggiungi spezie a piacere.",
            "Impiatta con cura e servi ben caldo. Buon appetito!"
        ];
    };

    const steps = getSteps();

    // Gestione click fuori per chiudere
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const startCooking = () => {
        setIsGuidedMode(true);
        setActiveStep(0);
    };

    const handleStepNavigation = (direction) => {
        if (direction === 'next' && activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        } else if (direction === 'prev' && activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const finishCooking = () => {
        setIsCooking(true); // Mostra loader finale
        setTimeout(() => {
            setIsCooking(false);
            setIsGuidedMode(false);
            onCook(recipe); // Rimuove ingredienti e chiude
            onClose();
        }, 1500);
    };

    // GUIDED MODE VIEW
    if (isGuidedMode) {
        return (
            <div
                onClick={handleBackdropClick}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
            >
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-white/10 relative h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div>
                            <span className="text-emerald-500 font-bold uppercase tracking-wider text-xs">Modalità Chef</span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.title}</h2>
                        </div>
                        <button onClick={() => setIsGuidedMode(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                            <X className="w-6 h-6 dark:text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center sm:px-16 overflow-y-auto">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 shadow-glow">
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{activeStep + 1}</span>
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                            {steps[activeStep]}
                        </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center backdrop-blur-md">
                        <button
                            onClick={() => handleStepNavigation('prev')}
                            disabled={activeStep === 0}
                            className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
                        >
                            Indietro
                        </button>

                        <div className="text-gray-400 font-medium">
                            Passo {activeStep + 1} di {steps.length}
                        </div>

                        {activeStep < steps.length - 1 ? (
                            <button
                                onClick={() => handleStepNavigation('next')}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                Avanti
                            </button>
                        ) : (
                            <button
                                onClick={finishCooking}
                                disabled={isCooking}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/40 transition transform hover:scale-105 flex items-center gap-2"
                            >
                                {isCooking ? <Loader2 className="w-5 h-5 animate-spin" /> : <PartyPopper className="w-5 h-5" />}
                                Termina & Mangia
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // STANDARD MODAL VIEW
    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
        >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 dark:border-gray-700/30 transform transition-all scale-100 max-h-[90vh] overflow-y-auto flex flex-col">

                {/* Hero Image Header */}
                <div className="relative h-64 shrink-0">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`;
                        }}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all transform hover:rotate-90"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-emerald-500 rounded-full shadow-lg">
                            Ricetta Facile
                        </span>
                        <h2 className="text-4xl font-bold text-white mb-2 shadow-text">
                            {recipe.title}
                        </h2>
                        <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
                            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <Clock className="w-4 h-4" />
                                30 min
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <Users className="w-4 h-4" />
                                2 Persone
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <Flame className="w-4 h-4 text-orange-400" />
                                450 kcal
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 bg-white dark:bg-gray-900">
                    {/* Ingredients Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-emerald-500" />
                            Ingredienti Necessari
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recipe.usedIngredients.map((ing, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                                        {ing}
                                    </span>
                                </div>
                            ))}
                            {/* Simuliamo ingredienti base che si hanno sempre */}
                            {['Olio EVO', 'Sale & Pepe'].map((ing, idx) => (
                                <div key={`base-${idx}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 opacity-75">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                                        {ing} (Dalla dispensa)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                    {/* Instructions Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ChefHat className="w-5 h-5 text-orange-500" />
                            Preparazione
                        </h3>
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-center">
                            <p className="text-orange-800 dark:text-orange-200 font-medium mb-2">
                                Vuoi farti guidare passo passo?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Clicca "Cucina Ora" per avviare la modalità Chef interattiva! 👨‍🍳
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-6 bg-gray-50/90 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-between items-center sticky bottom-0 backdrop-blur-xl gap-4">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left mt-2 sm:mt-0">
                        Cliccando su "Cucina" rimuoverai gli ingredienti usati.
                    </div>

                    <div className="flex flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition w-full sm:w-auto"
                        >
                            Chiudi
                        </button>
                        <button
                            onClick={startCooking}
                            className="flex-[2] sm:flex-none px-6 sm:px-8 py-3 font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 transition-all w-full sm:w-auto whitespace-nowrap"
                        >
                            <ChefHat className="w-5 h-5" />
                            <span>Cucina Ora</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
