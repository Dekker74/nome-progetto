import React, { useState, useRef } from 'react';
import { X, Plus, Tag, Camera, Loader2, ScanBarcode, Search, Milk, Carrot, Apple, Drumstick, Wheat, Coffee, PackageOpen } from 'lucide-react';
import QRScanner from './QRScanner';
import DatePicker from './DatePicker';

export default function AddProductModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [barcode, setBarcode] = useState('');
    const [showScanner, setShowScanner] = useState(false);

    // New States for Flow
    const [showPhotoPrompt, setShowPhotoPrompt] = useState(false);

    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [scannedImage, setScannedImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const categoryOptions = [
        { id: 'Latticini', icon: <Milk className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'Verdure', icon: <Carrot className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
        { id: 'Frutta', icon: <Apple className="w-5 h-5" />, color: 'bg-red-100 text-red-600' },
        { id: 'Carne', icon: <Drumstick className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
        { id: 'Cereali', icon: <Wheat className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
        { id: 'Bevande', icon: <Coffee className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600' },
        { id: 'Altro', icon: <PackageOpen className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' }
    ];



    if (!isOpen) return null;

    function generateNameImage(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        // Random pastel color
        const hue = Math.floor(Math.random() * 360);
        ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
        ctx.fillRect(0, 0, 500, 500);

        // Text configuration
        ctx.fillStyle = '#1f2937'; // Dark gray
        ctx.font = 'bold 60px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Simple centering logic (simplified)
        ctx.fillText(text, 250, 250);

        return canvas.toDataURL('image/jpeg');
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Se abbiamo già un'immagine (scansionata o foto) o un barcode, procediamo
        if (scannedImage || barcode || showPhotoPrompt === 'skipped') {
            let finalImage = scannedImage;

            // Se non c'è immagine, generiamo placeholder col nome
            if (!finalImage) {
                finalImage = generateNameImage(name);
            }

            onAdd({
                name,
                category: category === 'Altro' ? (customCategory || 'Altro') : (category || 'Altro'),
                expirationDate,
                image: finalImage,
                barcode
            });
            resetForm();
        } else {
            // ALTRIMENTI: Chiediamo se vuole mettere una foto
            setShowPhotoPrompt(true);
        }
    }

    function handleSkipPhoto() {
        setShowPhotoPrompt('skipped'); // Marker to bypass check
        // Re-trigger submit logic manually or just call onAdd directly
        const finalImage = generateNameImage(name);
        onAdd({
            name,
            category: category === 'Altro' ? (customCategory || 'Altro') : (category || 'Altro'),
            expirationDate,
            image: finalImage,
            barcode
        });
        resetForm();
    }

    function handleStartCameraFromPrompt() {
        setShowPhotoPrompt(false);
        startCamera();
    }

    function resetForm() {
        setName('');
        setCategory('');
        setCustomCategory('');
        setExpirationDate('');
        setBarcode('');
        setScannedImage(null);
        setShowScanner(false);
        setShowPhotoPrompt(false);
        setIsLoadingProduct(false);
        stopCamera();
        onClose();
    }

    async function startCamera() {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Errore accesso fotocamera:", err);
            alert("Impossibile accedere alla fotocamera.");
            setIsCameraActive(false);
        }
    }

    function stopCamera() {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    }

    function capturePhoto() {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg');
            setScannedImage(imageData);
            stopCamera();
            // Dopo la foto, l'utente vedrà l'anteprima nel form e potrà cliccare "Aggiungi" di nuovo
        }
    }

    // Funzione centralizzata per recuperare dati da OpenFoodFacts
    async function fetchProductByBarcode(code) {
        if (!code) return;

        setIsLoadingProduct(true);
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                setName(product.product_name || '');
                setBarcode(code);

                // Categorizzazione Semplificata
                const categoriesLower = (product.categories || '').toLowerCase();
                let matchedCat = 'Altro';
                if (categoriesLower.match(/dair|latte|yogurt|cheese|formaggio/)) matchedCat = 'Latticini';
                else if (categoriesLower.match(/fruit|frutta/)) matchedCat = 'Frutta';
                else if (categoriesLower.match(/vegetable|verdura|tomato|pomodoro/)) matchedCat = 'Verdure';
                else if (categoriesLower.match(/meat|carne|salami|prosciutto/)) matchedCat = 'Carne';
                else if (categoriesLower.match(/cereal|pasta|bread|pane|biscotti/)) matchedCat = 'Cereali';
                else if (categoriesLower.match(/beverage|drink|acqua|succo|water/)) matchedCat = 'Bevande';

                setCategory(matchedCat);

                if (product.image_url) {
                    setScannedImage(product.image_url);
                }

                if (navigator.vibrate) navigator.vibrate(200);
            } else {
                alert('Prodotto non trovato nel database globale.');
                setBarcode(code);
            }
        } catch (error) {
            console.error("Errore fetch OpenFoodFacts", error);
            alert("Errore di connessione al database prodotti.");
        } finally {
            setIsLoadingProduct(false);
            setShowScanner(false);
        }
    }

    async function handleScanSuccess(decodedText) {
        const isBarcode = /^\d+$/.test(decodedText);
        if (isBarcode) {
            await fetchProductByBarcode(decodedText);
        } else {
            setName(decodedText);
            setShowScanner(false);
        }

        if (!expirationDate) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 7);
            setExpirationDate(defaultDate.toISOString().split('T')[0]);
        }
    }

    return (
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget && !showPhotoPrompt) onClose();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-gray-700/30 transform transition-all scale-100 max-h-[90vh] overflow-y-auto relative">

                {/* PHOTO PROMPT OVERLAY */}
                {showPhotoPrompt === true && (
                    <div className="absolute inset-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                        <Camera className="w-16 h-16 text-emerald-500 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aggiungi una foto?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                            Rendi la tua dispensa più bella aggiungendo una foto reale del prodotto.
                        </p>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={handleStartCameraFromPrompt}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Scatta Foto
                            </button>
                            <button
                                onClick={handleSkipPhoto}
                                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl"
                            >
                                No, usa solo il nome
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex justify-between items-center text-white sticky top-0 z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="w-6 h-6 border-2 border-white/30 rounded-full p-0.5" />
                        Aggiungi Prodotto
                    </h2>
                    <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Scanner/Camera Section */}
                    {showScanner ? (
                        <div className="mb-6 animate-fade-in relative">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scanner Barcode</h3>
                                <button
                                    onClick={() => setShowScanner(false)}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Chiudi Scanner
                                </button>
                            </div>

                            <div className="bg-black rounded-xl overflow-hidden shadow-lg border-2 border-emerald-500/50 relative min-h-[300px]">
                                {isLoadingProduct ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-20">
                                        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
                                        <p className="text-lg font-semibold">Ricerca in corso...</p>
                                    </div>
                                ) : (
                                    <QRScanner onScan={handleScanSuccess} onError={(err) => console.warn(err)} />
                                )}
                            </div>
                        </div>
                    ) : isCameraActive ? (
                        <div className="mb-6 animate-fade-in relative">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scatta Foto</h3>
                                <button
                                    onClick={stopCamera}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Annulla
                                </button>
                            </div>
                            <div className="bg-black rounded-xl overflow-hidden shadow-lg border-2 border-emerald-500/50 relative aspect-square flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 shadow-xl flex items-center justify-center group"
                                >
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full group-active:scale-95 transition-transform"></div>
                                </button>
                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6">
                            {/* REMOVED "Fai una Foto" grid, kept only Scanner trigger if desired, or simpler UI */}
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center justify-center text-center group hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors cursor-pointer"
                                onClick={() => setShowScanner(true)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ScanBarcode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                                        Scansiona Barcode per autocompletare
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual Entry Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Barcode Manual Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Barcode (Opzionale)
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ScanBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={barcode}
                                        onChange={(e) => setBarcode(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="Es. 8076809513753"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fetchProductByBarcode(barcode)}
                                    disabled={!barcode || isLoadingProduct}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium border border-gray-200 dark:border-gray-600"
                                >
                                    {isLoadingProduct ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    <span className="hidden sm:inline">Cerca</span>
                                </button>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {scannedImage && (
                            <div className="flex justify-center mb-4 animate-fade-in">
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg group">
                                    <img src={scannedImage} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setScannedImage(null)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome Prodotto
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                    placeholder="Es. Barilla Spaghetti n.5"
                                />
                            </div>
                        </div>

                        {/* IMPROVED CATEGORY SELECTOR */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Categoria
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {categoryOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setCategory(opt.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${category === opt.id
                                            ? `${opt.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')} ring-2 ring-offset-1 ring-emerald-500`
                                            : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-full mb-1 ${category === opt.id ? 'bg-white shadow-sm' : 'bg-white/50 dark:bg-gray-600'}`}>
                                            {React.cloneElement(opt.icon, { className: `w-5 h-5 ${category === opt.id ? 'text-gray-800' : 'text-gray-400 dark:text-gray-300'}` })}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wide ${category === opt.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {opt.id}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Category Input (Animated) */}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${category === 'Altro' ? 'max-h-24 opacity-100 mt-3 mb-1' : 'max-h-0 opacity-0 mt-0 mb-0'}`}>
                            <div className="animate-slide-down">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Specifica Categoria
                                </label>
                                <input
                                    type="text"
                                    required={category === 'Altro'}
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                    placeholder="Es. Dolci, Snack..."
                                />
                            </div>
                        </div>

                        {/* MODERN DATE PICKER */}
                        <div>
                            <DatePicker
                                label="Scadenza"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                            <Plus className="w-5 h-5" />
                            Aggiungi alla Dispensa
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
