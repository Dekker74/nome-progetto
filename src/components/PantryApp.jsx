import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, PartyPopper } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import RecipeSection from './RecipeSection';
import AiChatBot from './AiChatBot';
import { sampleProducts, getRecipeSuggestions } from '../utils/productHelpers';

export default function PantryApp() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tutti');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState(null); // Per feedback utente

    // Load products from localStorage on mount
    useEffect(() => {
        const isDeveloperMode = localStorage.getItem('developer_mode') === 'true';
        const uid = isDeveloperMode ? localStorage.getItem('developer_user_uid') : currentUser?.uid;

        if (uid) {
            const storageKey = `pantry_products_${uid}`;
            const savedProducts = localStorage.getItem(storageKey);
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                // Primo caricamento: usa prodotti sample
                // Assicurati che abbiano le immagini se mancano
                const samplesWithImages = sampleProducts.map(p => ({
                    ...p,
                    image: p.image || `https://image.pollinations.ai/prompt/delicious%20${p.name}%20food?width=500&height=500&nologo=true`
                }));
                setProducts(samplesWithImages);
            }
        }
    }, [currentUser]);

    // Save products to localStorage whenever they change
    useEffect(() => {
        const isDeveloperMode = localStorage.getItem('developer_mode') === 'true';
        const uid = isDeveloperMode ? localStorage.getItem('developer_user_uid') : currentUser?.uid;

        if (uid && products.length > 0) {
            const storageKey = `pantry_products_${uid}`;
            localStorage.setItem(storageKey, JSON.stringify(products));
        }
    }, [products, currentUser]);

    // Load dark mode preference
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
    }, []);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    // Pulizia notifiche
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    function handleAddProduct(productData) {
        const newProduct = {
            id: Date.now().toString(),
            ...productData
        };
        setProducts(prev => [newProduct, ...prev]); // Aggiungi in cima
        setNotification({
            type: 'success',
            message: `"${productData.name}" aggiunto alla dispensa!`
        });
    }

    function handleDeleteProduct(productId) {
        setProducts(products.filter(p => p.id !== productId));
    }

    // Nuova funzione per cucinare e rimuovere ingredienti
    function handleCookRecipe(recipe) {
        const ingredientsToRemove = recipe.ingredients || []; // Nomi degli ingredienti

        let removedCount = 0;
        const newProducts = [...products];

        ingredientsToRemove.forEach(ingName => {
            // Cerca un prodotto che contiene il nome dell'ingrediente (case insensitive)
            const index = newProducts.findIndex(p =>
                p.name.toLowerCase().includes(ingName.toLowerCase()) ||
                ingName.toLowerCase().includes(p.name.toLowerCase())
            );

            if (index !== -1) {
                newProducts.splice(index, 1);
                removedCount++;
            }
        });

        setProducts(newProducts);
        setNotification({
            type: 'success',
            message: `Hai preparato: ${recipe.name}! Rimossi ${removedCount} ingredienti dalla dispensa. Buon appetito! 🍽️`
        });
    }

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tutti' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get recipe suggestions
    const recipes = getRecipeSuggestions(products);

    return (
        <Layout
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            currentUser={currentUser}
        >
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 flex items-center gap-3 border border-emerald-100 dark:border-emerald-900 border-l-4 border-l-emerald-500 animate-slide-in-right max-w-sm">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                        {notification.type === 'success' ? <PartyPopper className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{notification.message}</p>
                    </div>
                </div>
            )}

            <Dashboard products={products} />

            {/* Add Product Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Aggiungi Prodotto
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/30">
                    <Package className="w-20 h-20 mx-auto text-gray-400 mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Nessun prodotto trovato
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {searchQuery || selectedCategory !== 'Tutti'
                            ? 'Prova a modificare i filtri di ricerca'
                            : 'La tua dispensa è vuota. Inizia ad aggiungere prodotti!'}
                    </p>
                    {!searchQuery && selectedCategory === 'Tutti' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Aggiungi il tuo primo prodotto
                        </button>
                    )}
                </div>
            )}

            {/* Recipe Suggestions */}
            <RecipeSection
                recipes={recipes}
                products={products}
                onCookRecipe={handleCookRecipe}
                onOpenChat={() => setIsChatOpen(true)}
            />

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddProduct} // Correct prop name
            />

            {/* ChatBot AI */}
            <AiChatBot
                products={products}
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />
        </Layout>
    );
}
