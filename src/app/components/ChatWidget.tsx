
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useSupabaseAuth } from '../../lib/AuthContext';
import { ChatMessage } from '../../types/api';

/**
 * AI Chat Widget Component
 * Connected to Supabase "Brain" (bot_knowledge).
 */
export default function ChatWidget() {
    const { user } = useSupabaseAuth();
    const isAuthenticated = !!user;
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionIdRef = useRef<string | null>(null);

    // Role-Based Context Configuration
    const isAdminRoute = location.pathname.startsWith('/admin');

    const config = isAdminRoute ? {
        name: "Grade A Ops",
        greeting: "Administrator Logged In. How can I assist with property management today?",
        headerGradient: "from-blue-800 to-indigo-900", // Navy/Dark Blue for Admin
        toggleGradient: "from-blue-600 to-indigo-700"
    } : {
        name: "Grade A AI",
        greeting: "Welcome to Grade A Realty! Are you looking to buy, sell, or rent today?",
        headerGradient: "from-emerald-600 to-emerald-800", // Emerald for Customer
        toggleGradient: "from-emerald-500 to-emerald-700"
    };

    // Reset messages and show appropriate greeting when context changes
    useEffect(() => {
        setMessages([{
            senderInfo: { role: 'system' },
            content: config.greeting,
            timestamp: new Date().toISOString()
        }]);
        sessionIdRef.current = null; // Reset session on context switch
    }, [isAdminRoute]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isTyping) return;

        const userMsg: ChatMessage = {
            senderInfo: { role: 'user' },
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsTyping(true);

        try {
            // 1. Get Matching Response from Knowledge Base
            const { data: knowledge } = await supabase
                .from('bot_knowledge')
                .select('response_text, trigger_phrase')
                .eq('is_active', true);

            // Simple keyword matching (Case-insensitive)
            const match = knowledge?.find(k =>
                message.toLowerCase().includes(k.trigger_phrase.toLowerCase())
            );

            // Default fallback if no match
            const responseText = match
                ? match.response_text
                : "I'm not sure about that, but I can connect you with an agent who can help.";

            // Simulate "Typing" delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const aiMsg: ChatMessage = {
                senderInfo: { role: 'system' },
                content: responseText,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMsg]);

            // 2. Log Session & Messages to Supabase (History)
            if (!sessionIdRef.current) {
                const { data: session } = await supabase
                    .from('chat_sessions')
                    .insert([{ user_id: user?.id || null }])
                    .select()
                    .single();

                if (session) sessionIdRef.current = session.id;
            }

            if (sessionIdRef.current) {
                // Log both user query and bot response
                await supabase.from('chat_messages').insert([
                    { session_id: sessionIdRef.current, sender: 'user', message: userMsg.content },
                    { session_id: sessionIdRef.current, sender: 'bot', message: aiMsg.content }
                ]);
            }

        } catch (err) {
            console.error('Chat Error:', err);
            setMessages(prev => [...prev, {
                senderInfo: { role: 'system' },
                content: "Sorry, I'm having trouble connecting to the brain.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col transition-all duration-200 animate-in slide-in-from-bottom-5 fade-in ring-1 ring-black/5">
                    {/* Header */}
                    <div className={`p-4 bg-gradient-to-r ${config.headerGradient} flex items-center justify-between shadow-md`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-wide">{config.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgb(74,222,128)]"></span>
                                    <span className="text-emerald-50 text-[10px] uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50/50 space-y-4">
                        {messages.map((msg, idx) => {
                            const isUser = msg.senderInfo.role === 'user';
                            return (
                                <div key={idx} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                        ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}
                                    `}>
                                        {isUser ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`
                                        max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                                        ${isUser
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'
                                        }
                                    `}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
                            {messages.length < 3 && (
                                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                                    {['Price?', 'Location?', 'Schedule a tour', 'Contact Agent'].map(txt => (
                                        <button
                                            key={txt}
                                            type="button"
                                            onClick={() => setMessage(txt)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-xs font-medium text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 rounded-full transition-colors"
                                        >
                                            {txt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isTyping}
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
                                >
                                    {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-gray-300 font-medium">Powered by Grade A AI</span>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500 mb-3">Please sign in to chat with our AI assistant.</p>
                            <a
                                href="/login"
                                className="inline-block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                            >
                                Sign In to Chat
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button - Dynamic Color */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95
                    ${isOpen ? 'bg-gray-700 rotate-90' : `bg-gradient-to-br ${config.toggleGradient} animate-bounce-subtle`}
                `}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={28} className="text-white" />
                )}
            </button>
        </div>
    );
}
