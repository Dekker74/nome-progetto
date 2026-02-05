const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

console.log("Chef AI: Configurazione caricata. API Key presente:", !!OPENAI_API_KEY);
if (!OPENAI_API_KEY) {
    console.warn("ATTENZIONE: REACT_APP_OPENAI_API_KEY non trovata in process.env. Se hai appena creato il file .env, riavvia 'npm start'.");
}

/**
 * Genera un prompt ottimizzato per immagini cibo di qualità professionale
 */
function generateFoodImagePrompt(recipeName) {
    const styles = [
        "macro photography, soft bokeh background",
        "overhead gourmet plating, minimalist style",
        "rustic wooden table, natural sunlight, cinematic lighting",
        "modern restaurant presentation, elegant garnishes",
        "close-up shot, steam rising, vibrant colors, 4k resolution"
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `${recipeName}, professional food photography, ${randomStyle}, appetizing, sharp focus, 8k, highly detailed`;
}

export async function generateAiRecipes(availableIngredients) {
    if (!availableIngredients || availableIngredients.length === 0) return [];
    if (!OPENAI_API_KEY) {
        console.error("OpenAI API Key missing in .env");
        return [];
    }

    const ingredientsList = availableIngredients.slice(0, 15).map(p => p.name).join(', ');

    const systemPrompt = `Sei un esperto chef italiano. RISPONDI SEMPRE E SOLO CON UN JSON VALIDO.`;
    const userPrompt = `Crea 3 ricette usando principalmente: ${ingredientsList}. 
    Assumi che l'utente abbia: Olio, Sale, Pepe, Zucchero, Farina, Acqua, Pasta, Riso.
    
    Struttura JSON richiesta:
    {
        "recipes": [
            {
                "id": "1",
                "name": "Titolo",
                "description": "Breve descrizione",
                "time": "30 min",
                "difficulty": "Facile",
                "ingredients": ["ing1", "ing2"],
                "steps": ["passo 1", "passo 2"]
            }
        ]
    }`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "OpenAI error");
        }

        const result = await response.json();
        const data = JSON.parse(result.choices[0].message.content);

        if (data.recipes && Array.isArray(data.recipes)) {
            return data.recipes.map(r => ({
                ...r,
                image: `https://image.pollinations.ai/prompt/${encodeURIComponent(generateFoodImagePrompt(r.name))}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`,
                steps: Array.isArray(r.steps) ? r.steps : [],
                ingredients: Array.isArray(r.ingredients) ? r.ingredients : []
            }));
        }
        return [];
    } catch (error) {
        console.error("Errore generazione OpenAI:", error);
        return [];
    }
}

/**
 * Personalità disponibili per lo Chef AI
 */
export const CHEF_PERSONALITIES = {
    professional: {
        id: 'professional',
        name: 'Chef Stellato',
        icon: '👨‍🍳',
        systemPrompt: "Sei un Executive Chef stellato Michelin. Sei preciso, tecnico, educhi l'utente con termini culinari appropriati. Sei formale ma appassionato.",
        greeting: "Benvenuto nella mia cucina. Sono a tua disposizione per elevare la tua tecnica culinaria."
    },
    friendly: {
        id: 'friendly',
        name: 'Amico Goloso',
        icon: '🍕',
        systemPrompt: "Sei un amico appassionato di cibo che adora cucinare in compagnia. Sei informale, usi emoji, sei entusiasta e incoraggiante. Dai consigli semplici e pratici.",
        greeting: "Ehi ciao! Pronto a cucinare qualcosa di buonissimo? Dimmi, cosa abbiamo in frigo? 😋"
    },
    nonna: {
        id: 'nonna',
        name: 'Nonna Maria',
        icon: '👵',
        systemPrompt: "Sei una dolce nonna italiana. Chiami l'utente 'tesoro' o 'gioia'. Ti preoccupi che mangi abbastanza. Le tue ricette sono tradizionali e 'fatte col cuore'.",
        greeting: "Ciao gioia di nonna! Hai mangiato oggi? Vieni che ti preparo qualcosa di buono con quello che hai."
    }
};

/**
 * Genera una risposta simulata quando l'API key non è disponibile
 */
function getSimulatedResponse(lastMessage, personalityId = 'professional') {
    const personality = CHEF_PERSONALITIES[personalityId] || CHEF_PERSONALITIES.professional;
    const msg = lastMessage.toLowerCase();

    // Ritardi simulati per realismo
    const responses = [
        {
            keywords: ['ciao', 'buongiorno', 'buonasera', 'salve'],
            professional: "Buongiorno. Desidera discutere di preparazione o ingredienti oggi?",
            friendly: "Ciaooo! 👋 Pronti a spadellare?",
            nonna: "Ciao tesoro mio! Che bello vederti!"
        },
        {
            keywords: ['ricetta', 'cucino', 'mangiare', 'preparare'],
            professional: "Sulla base della sua dispensa, potrei suggerire un risotto o una pasta fresca. Qual è la sua preferenza tecnica?",
            friendly: "Mmm, che fame! Potremmo fare una pasta veloce o un secondo sfizioso. Tu che voglia hai?",
            nonna: "Ti faccio due spaghi al pomodoro fresco? Oppure ho un po' di arrosto di ieri..."
        },
        {
            keywords: ['grazie'],
            professional: "È un piacere servire.",
            friendly: "Figurati! Quando vuoi! 😉",
            nonna: "Prego gioia, mangia tutto mi raccomando!"
        },
        {
            keywords: ['aiuto', 'help'],
            professional: "Posso assisterla nella selezione degli ingredienti o nei metodi di cottura.",
            friendly: "Dimmi tutto! Sono qui per darti una mano in cucina! 👨‍🍳",
            nonna: "Dimmi nipotino, cosa c'è che non va? La nonna risolve tutto."
        }
    ];

    const match = responses.find(r => r.keywords.some(k => msg.includes(k)));

    if (match) {
        return match[personality.id] || match.professional;
    }

    // Fallback generici per personalità
    if (personality.id === 'nonna') return "Ah, ai miei tempi facevamo tutto a occhio... comunque dimmi, cos'altro hai in dispensa?";
    if (personality.id === 'friendly') return "Interessante! E se ci aggiungessimo un po' di spezie? 🌶️";
    return "Comprendo. Tuttavia, per darle un consiglio preciso, avrei bisogno di sapere quali ingredienti specifici desidera utilizzare.";
}

/**
 * Ottiene una risposta dal chatbot AI basata sui messaggi e sull'inventario
 */
export async function getAiChatResponse(messages, products, personalityId = 'professional') {
    const lastUserMessage = messages[messages.length - 1].content;
    const personality = CHEF_PERSONALITIES[personalityId] || CHEF_PERSONALITIES.professional;

    // Se non c'è API KEY, usa la simulazione intelligente
    if (!OPENAI_API_KEY) {
        console.log("Chef AI: Modalità simulazione attiva (No API Key).");
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getSimulatedResponse(lastUserMessage, personalityId));
            }, 1000 + Math.random() * 1000); // Ritardo realistico 1-2s
        });
    }

    const inventoryList = products.slice(0, 20).map(p => p.name).join(', ');
    const systemPrompt = `${personality.systemPrompt}
    Dispensa attuale utente: ${inventoryList}.
    Rispondi seguendo rigorosamente la tua personalità. Sii breve (max 3 frasi).`;

    try {
        console.log(`Chef AI (${personality.name}): Invio richiesta a OpenAI...`);
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error Details:", errorData);
            // Fallback su simulazione in caso di errore API
            return getSimulatedResponse(lastUserMessage, personalityId);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error("Chef AI: Errore richiesta:", error);
        // Fallback su simulazione
        return getSimulatedResponse(lastUserMessage, personalityId);
    }
}
