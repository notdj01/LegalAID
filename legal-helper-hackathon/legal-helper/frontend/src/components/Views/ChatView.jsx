import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Filter, Sparkles, Scale, Clock } from 'lucide-react';
import { queryLegal } from '../../lib/api';

// Helper to format time
const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Helper to get source link
const getSourceLink = (msg) => {
    const citation = msg.citations && msg.citations.length > 0 ? (msg.citations[0].citation || msg.citations[0].title) : null;
    const HERO_LINKS = {
        "bns section 103": "https://www.indiacode.nic.in/show-data?abv=CEN&statehandle=123456789/1362&actid=AC_CEN_5_23_00048_2023-45_1719292564123&sectionId=90468&sectionno=103&orderno=103&orgactid=AC_CEN_5_23_00048_2023-45_1719292564123",
        "section 103": "https://www.indiacode.nic.in/show-data?abv=CEN&statehandle=123456789/1362&actid=AC_CEN_5_23_00048_2023-45_1719292564123&sectionId=90468&sectionno=103&orderno=103&orgactid=AC_CEN_5_23_00048_2023-45_1719292564123"
    };

    if (citation) {
        const lowerCitation = citation.toLowerCase();
        const heroKey = Object.keys(HERO_LINKS).find(key => lowerCitation.includes(key));
        if (heroKey) return HERO_LINKS[heroKey];
    }
    return "https://www.indiacode.nic.in/";
};

const ChatView = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            timestamp: Date.now(),
            text: (
                <>
                    <p className="mb-2 text-lg font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary font-medium tracking-wide">Welcome back, Advocate.</p>
                    <p className="text-slate-200 leading-relaxed text-sm">I am NyayaSetu, upgraded with the latest BNS 2023 regulations.</p>
                </>
            ),
            source: 'System'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [lang, setLang] = useState('en');
    const [selectedDomain, setSelectedDomain] = useState('All');
    const messagesEndRef = useRef(null);

    const domains = ['All', 'Criminal Law', 'Corporate Law', 'IT Act', 'Environmental', 'Civil Law'];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add User Message
        const userMsg = { id: Date.now(), sender: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const currentDomain = selectedDomain;

        try {
            // Call Real API
            const response = await queryLegal({
                query: userMsg.text,
                language: lang,
                filters: selectedDomain !== 'All' ? { domain: selectedDomain } : {}
            });

            setIsTyping(false);

            const outputText = (
                <>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 uppercase tracking-widest shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                            {currentDomain}
                        </span>
                    </div>
                    <p className="text-slate-200 mb-2 leading-relaxed whitespace-pre-wrap">{response.answer}</p>

                    {response.sources && response.sources.length > 0 && (
                        <div className="mt-4 bg-white/[0.03] rounded-xl p-4 border-l-2 border-primary">
                            <h4 className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                <Scale className="w-3 h-3" /> Sources & Provisions
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {response.sources.map((cite, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                                        <span>
                                            <strong className="text-primary/80">{cite.title || cite.citation}</strong>: {cite.text.substring(0, 150)}...
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            );

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: outputText,
                timestamp: Date.now(),
                source: response.sources && response.sources.length > 0 ? response.sources[0].citation : 'NyayaSetu AI',
                citations: response.sources
            }]);

        } catch (error) {
            console.error("API Error:", error);
            setIsTyping(false);
            const errorText = (
                <p className="text-red-400">
                    Sorry, I encountered an error while processing your request. Please try again.
                </p>
            );
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: errorText,
                timestamp: Date.now(),
                source: 'System Error'
            }]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col p-4">
            {/* Main Chat Container */}
            <div className="flex-1 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative ring-1 ring-white/5">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Header / Language Toggle */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex items-center border border-white/10 shadow-lg">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-1.5 text-[10px] font-bold tracking-widest rounded-full transition-all duration-300 ${lang === 'en' ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            ENG
                        </button>
                        <button
                            onClick={() => setLang('hi')}
                            className={`px-4 py-1.5 text-[10px] font-bold tracking-widest rounded-full transition-all duration-300 ${lang === 'hi' ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            हिंदी
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar scroll-smooth">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-5 group ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>

                            {/* Avatar */}
                            {msg.sender === 'ai' ? (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.15)] group-hover:border-primary/50 transition-colors duration-300">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`relative max-w-2xl p-6 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${msg.sender === 'user'
                                ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white rounded-tr-sm shadow-xl'
                                : 'bg-gradient-to-br from-black/60 to-black/40 border border-white/10 text-slate-200 rounded-tl-sm shadow-black/20'
                                }`}>
                                {typeof msg.text === 'string' ? <p className="leading-relaxed">{msg.text}</p> : msg.text}

                                {/* Timestamp & Source */}
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatTime(msg.timestamp)}</span>
                                    </div>
                                    {msg.sender === 'ai' && (
                                        <div className="font-medium text-primary/60 uppercase tracking-wider ml-4 flex items-center gap-1">
                                            Source:
                                            <a
                                                href={getSourceLink(msg)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
                                            >
                                                {msg.source || 'NyayaSetu AI'} <span className="text-[8px]">↗</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-black/40 border border-white/10 px-5 py-4 rounded-3xl rounded-tl-sm flex items-center gap-1.5 shadow-lg">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
                    {/* Filter Chips */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide mask-image-linear-to-r">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mr-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                            <Filter className="w-3 h-3" />
                            <span>Filters</span>
                        </div>
                        {domains.map(domain => (
                            <button
                                key={domain}
                                onClick={() => setSelectedDomain(domain)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 whitespace-nowrap ${selectedDomain === domain
                                    ? 'bg-white/10 text-white border-primary/50 shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                    : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20 hover:text-slate-300'
                                    }`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-white/10 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
                        <div className="relative flex items-end gap-2 bg-[#0a0a0a] rounded-2xl p-2 border border-white/10 shadow-2xl transition-all duration-300 group-focus-within:border-primary/40 group-focus-within:shadow-[0_0_30px_rgba(255,215,0,0.05)]">

                            {/* Text Input */}
                            <div className="flex-1 min-h-[50px]">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    placeholder={lang === 'en' ? "Ask a complex legal query..." : "एक जटिल कानूनी प्रश्न पूछें..."}
                                    className="w-full h-full bg-transparent text-sm text-white placeholder-slate-600 px-4 py-3 focus:outline-none resize-none font-medium leading-relaxed"
                                    style={{ minHeight: '50px' }}
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="mb-0.5 p-3.5 bg-gradient-to-br from-primary to-[#b8860b] text-black rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:grayscale group-button"
                            >
                                <Sparkles className="w-5 h-5 fill-black/20" />
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-3 flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <p className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">Encrypted • BNS 2023 Compliant • Ver 2.0</p>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatView;
