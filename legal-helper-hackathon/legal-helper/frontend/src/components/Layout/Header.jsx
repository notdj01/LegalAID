import React from 'react';
import { MessageSquare, Scale, FileText, Home, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const Header = ({ activeTab, onTabChange, fontSize, setFontSize }) => {
    const navItems = [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
        { id: 'compare', label: 'BNS Transition', icon: Scale },
        { id: 'docs', label: 'Document Analysis', icon: FileText },
    ];

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.03] z-50 shrink-0 sticky top-0">

            {/* Subtle bottom glow line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary via-[#e6c554] to-primary shadow-lg glow-gold">
                    <span className="font-serif text-xl font-bold text-black">N</span>
                </div>
                <div className="hidden md:block">
                    <h1 className="font-serif text-xl font-bold tracking-wide text-white">NyayaSetu</h1>
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="w-2.5 h-2.5 text-primary" />
                        <p className="text-[8px] text-primary uppercase tracking-[0.15em] font-semibold">Legal Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 absolute left-1/2 -translate-x-1/2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium",
                                isActive
                                    ? "bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Right: Text Resizer */}
            <div className="flex items-center gap-3">
                <div className="bg-[#0f0f0f] rounded-xl p-1 border border-white/5 flex items-center shadow-inner">
                    {[0, 1, 2].map((size) => (
                        <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${fontSize === size
                                ? 'text-black bg-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {size === 0 ? 'A' : size === 1 ? 'A+' : 'A++'}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
