import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, Loader2, MessageCircle } from 'lucide-react';
import { getAiChatResponse, CHEF_PERSONALITIES } from '../utils/aiService';

export default function AiChatBot({ products, isOpen, onToggle }) {
    const [messages, setMessages] = useState([]); // Inizializzato vuoto per effetto "typing" iniziale
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPersonality, setSelectedPersonality] = useState('professional');
    const messagesEndRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(false);
    const [animationState, setAnimationState] = useState('closed');

    // Load personalities
    const personalities = Object.values(CHEF_PERSONALITIES);
    const currentPersonality = CHEF_PERSONALITIES[selectedPersonality];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect to handle opening/closing animations based on isOpen prop
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setAnimationState('opening');
            // Small delay to ensure render happens before animation class logic
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationState('open');
                });
            });

            // Welcome message if empty
            if (messages.length === 0) {
                setMessages([{ role: 'assistant', content: currentPersonality.greeting }]);
            }
        } else {
            if (shouldRender) {
                setAnimationState('closing');
                const timer = setTimeout(() => {
                    setAnimationState('closed');
                    setShouldRender(false);
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen]);

    // Change personality and reset chat if needed or just notify
    const handlePersonalityChange = (pid) => {
        setSelectedPersonality(pid);
        const newPersona = CHEF_PERSONALITIES[pid];
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `*Cambio modalità: ${newPersona.name} attivato.* ${newPersona.greeting}`
        }]);
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.chat-container') && !event.target.closest('.chat-toggle')) {
                onToggle(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getAiChatResponse([...messages, userMessage], products, selectedPersonality);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Spiacente, ho un piccolo problema tecnico. Riprova tra poco!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {shouldRender && (
                <div
                    className={`chat-container w-80 sm:w-96 glass dark:glass-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out max-h-[650px] border border-white/40 dark:border-gray-600/50 pointer-events-auto ${animationState === 'opening' || animationState === 'closing'
                            ? 'opacity-0 scale-95 translate-y-4'
                            : 'opacity-100 scale-100 translate-y-0'
                        }`}
                >
                    {/* Header with Personality Selector */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 pb-2 text-white">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Chef AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-medium uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onToggle(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Personality Tabs */}
                        <div className="flex gap-2 p-1 bg-black/10 rounded-xl backdrop-blur-sm overflow-x-auto no-scrollbar">
                            {personalities.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handlePersonalityChange(p.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedPersonality === p.id
                                        ? 'bg-white text-emerald-700 shadow-md'
                                        : 'text-white/80 hover:bg-white/10'
                                        }`}
                                >
                                    <span>{p.icon}</span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[350px] bg-slate-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`p-2 rounded-xl shrink-0 h-fit ${m.role === 'user'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex gap-2 items-center text-gray-500 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                    <span className="italic">Sta scrivendo...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white/80 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 backdrop-blur-md">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Chiedi una ricetta o un consiglio..."
                                className="w-full pl-5 pr-14 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-emerald-500/50 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none dark:text-white dark:placeholder-gray-400 shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
