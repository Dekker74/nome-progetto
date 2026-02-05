// Helper functions for product management

export function getDaysUntilExpiration(expirationDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function getHealthStatus(category, daysUntilExpiration) {
    // Expired
    if (daysUntilExpiration < 0) {
        return { status: 'expired', color: 'red', label: 'Scaduto', icon: '🔴' };
    }

    // Expiring soon (within 3 days)
    if (daysUntilExpiration <= 3) {
        return { status: 'expiring', color: 'yellow', label: 'In scadenza', icon: '🟡' };
    }

    // Fresh but check category freshness
    const categoryFreshness = {
        'Latticini': 7,
        'Verdure': 5,
        'Frutta': 5,
        'Carne': 3,
        'Cereali': 30,
        'Bevande': 14
    };

    const optimalDays = categoryFreshness[category] || 7;

    if (daysUntilExpiration > optimalDays) {
        return { status: 'fresh', color: 'green', label: 'Fresco', icon: '🟢' };
    } else if (daysUntilExpiration > 3) {
        return { status: 'good', color: 'green', label: 'Buono', icon: '🟢' };
    }

    return { status: 'fresh', color: 'green', label: 'Fresco', icon: '🟢' };
}

export function getExpirationStatus(daysUntilExpiration) {
    if (daysUntilExpiration < 0) {
        return {
            label: `Scaduto da ${Math.abs(daysUntilExpiration)} ${Math.abs(daysUntilExpiration) === 1 ? 'giorno' : 'giorni'}`,
            color: 'red',
            className: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
            textClass: 'text-red-800 dark:text-white'
        };
    }

    if (daysUntilExpiration === 0) {
        return {
            label: 'Scade oggi',
            color: 'red',
            className: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
            textClass: 'text-red-800 dark:text-white'
        };
    }

    if (daysUntilExpiration <= 3) {
        return {
            label: `Scade tra ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'giorno' : 'giorni'}`,
            color: 'yellow',
            className: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
            textClass: 'text-yellow-800 dark:text-white'
        };
    }

    return {
        label: `Scade tra ${daysUntilExpiration} giorni`,
        color: 'green',
        className: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
        textClass: 'text-green-800 dark:text-white'
    };
}

// Helper to get image by category
export function getCategoryImage(category) {
    const images = {
        'Latticini': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80',
        'Verdure': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=500&q=80',
        'Frutta': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80',
        'Carne': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80',
        'Cereali': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
        'Bevande': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80'
    };
    return images[category] || images['Verdure'];
}

// Sample products data
export const sampleProducts = [
    {
        id: '1',
        name: 'Latte Fresco',
        category: 'Latticini',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '2',
        name: 'Pomodori',
        category: 'Verdure',
        expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '3',
        name: 'Mele Golden',
        category: 'Frutta',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days
        image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '4',
        name: 'Petto di Pollo',
        category: 'Carne',
        expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired yesterday
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '5',
        name: 'Pasta Integrale',
        category: 'Cereali',
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
        image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '6',
        name: 'Yogurt Greco',
        category: 'Latticini',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '7',
        name: 'Carote',
        category: 'Verdure',
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: '8',
        name: 'Succo d\'Arancia',
        category: 'Bevande',
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80'
    }
];

// Recipe suggestions based on available products
export function getRecipeSuggestions(products) {
    const categories = [...new Set(products.map(p => p.category))];
    const recipes = [];

    // Only suggest recipes with fresh products (not expired)
    products.filter(p => getDaysUntilExpiration(p.expirationDate) >= 0);

    const seed = Math.floor(Math.random() * 1000);

    if (categories.includes('Latticini') && categories.includes('Verdure')) {
        recipes.push({
            id: '1',
            name: 'Insalata Caprese',
            description: 'Fresca e leggera, perfetta per l\'estate con mozzarella buffalo e pomodori.',
            ingredients: ['Latticini', 'Verdure'],
            time: '10 min',
            difficulty: 'Facile',
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent('Caprese salad with buffalo mozzarella and cherry tomatoes, fresh basil, olive oil drizzle, gourmet plating, macro photography')}?width=800&height=600&nologo=true&seed=${seed}_1`,
            fallback: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=800&q=80'
        });
    }

    if (categories.includes('Carne') && categories.includes('Verdure')) {
        recipes.push({
            id: '2',
            name: 'Pollo alle Verdure',
            description: 'Un secondo piatto sano e nutriente con petti di pollo e verdure di stagione.',
            ingredients: ['Carne', 'Verdure'],
            time: '30 min',
            difficulty: 'Media',
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent('Roasted chicken breast with garden vegetables, rosemary sprig, professional kitchen lighting, steam, rustic plate')}?width=800&height=600&nologo=true&seed=${seed}_2`,
            fallback: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80'
        });
    }

    if (categories.includes('Cereali') && categories.includes('Verdure')) {
        recipes.push({
            id: '3',
            name: 'Pasta Primavera',
            description: 'Primo piatto colorato e gustoso con verdure fresche salto in padella.',
            ingredients: ['Cereali', 'Verdure'],
            time: '20 min',
            difficulty: 'Facile',
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent('Italian pasta primavera with colorful spring vegetables, parmesan shavings, soft bokeh, sun-drenched terrace setting')}?width=800&height=600&nologo=true&seed=${seed}_3`,
            fallback: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80'
        });
    }

    if (categories.includes('Frutta') && categories.includes('Latticini')) {
        recipes.push({
            id: '4',
            name: 'Smoothie Energetico',
            description: 'Bevanda nutriente per iniziare la giornata con frutta e yogurt.',
            ingredients: ['Frutta', 'Latticini'],
            time: '5 min',
            difficulty: 'Facile',
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent('Healthy berry fruit smoothie in glass jar, scattered fruits, yogurt texture, morning light, clean background')}?width=800&height=600&nologo=true&seed=${seed}_4`,
            fallback: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=800&q=80'
        });
    }

    if (categories.includes('Frutta')) {
        recipes.push({
            id: '5',
            name: 'Macedonia di Frutta',
            description: 'Dessert fresco e vitaminico con frutta di stagione.',
            ingredients: ['Frutta'],
            time: '15 min',
            difficulty: 'Facile',
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent('Fresh seasonal fruit salad in a crystal bowl, mint leaf garnish, vibrant tropical colors, macro detail')}?width=800&height=600&nologo=true&seed=${seed}_5`,
            fallback: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80'
        });
    }

    return recipes;
}

// Generate random product for QR scanner simulation
export function generateRandomProduct() {
    const productNames = {
        'Latticini': ['Mozzarella', 'Parmigiano', 'Ricotta', 'Formaggio Spalmabile', 'Burro'],
        'Verdure': ['Zucchine', 'Melanzane', 'Peperoni', 'Spinaci', 'Broccoli'],
        'Frutta': ['Banane', 'Arance', 'Pere', 'Fragole', 'Kiwi'],
        'Carne': ['Bistecca', 'Salsiccia', 'Macinato', 'Fesa di Tacchino'],
        'Cereali': ['Riso', 'Farro', 'Orzo', 'Pane'],
        'Bevande': ['Acqua Minerale', 'Tè Freddo', 'Latte di Mandorla']
    };

    const categories = Object.keys(productNames);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const names = productNames[randomCategory];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const daysToAdd = Math.floor(Math.random() * 30) + 1; // 1 to 30 days
    const expirationDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    return {
        id: Date.now().toString(),
        name: randomName,
        category: randomCategory,
        expirationDate
    };
}
