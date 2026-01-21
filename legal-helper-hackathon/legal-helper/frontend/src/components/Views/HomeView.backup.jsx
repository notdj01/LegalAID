import React from 'react';
import { ArrowRight, MessageSquare, Scale, FileText } from 'lucide-react';

const HomeView = ({ onNavigate }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center animate-fade-in relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none">
                <img
                    src="/assets/legal_library.png"
                    alt="Legal Library Background"
                    className="w-full h-full object-cover opacity-20 filter brightness-50 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center p-6">

                {/* Hero Section */}
                <div className="mb-16 animate-slide-up">
                    <img
                        src="/assets/scales_gold.png"
                        alt="Scales of Justice"
                        className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-2xl"
                    />
                    <h1 className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] mb-6 tracking-tight drop-shadow-sm">
                        NyayaSetu
                    </h1>
                    <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed font-light">
                        Advanced Legal Intelligence System for the Modern Indian Judiciary.
                        Navigating the transition from <span className="text-red-400 font-medium">IPC</span> to <span className="text-green-400 font-medium">BNS</span>.
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid md:grid-cols-3 gap-6 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    <button
                        onClick={() => onNavigate('chat')}
                        className="glass-panel p-8 rounded-2xl group hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                            <MessageSquare className="w-24 h-24 text-[#D4AF37]" />
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors">
                            <MessageSquare className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
                        <p className="text-sm text-textMuted mb-4">Draft notices, research case laws, and get instant answers.</p>
                        <div className="flex items-center text-[#D4AF37] text-sm font-medium">
                            Starting Research <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate('compare')}
                        className="glass-panel p-8 rounded-2xl group hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                            <Scale className="w-24 h-24 text-[#D4AF37]" />
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors">
                            <Scale className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">IPC vs BNS</h3>
                        <p className="text-sm text-textMuted mb-4">Compare statutes, map sections, and understand new penalties.</p>
                        <div className="flex items-center text-[#D4AF37] text-sm font-medium">
                            Compare Laws <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate('docs')}
                        className="glass-panel p-8 rounded-2xl group hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                            <FileText className="w-24 h-24 text-[#D4AF37]" />
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors">
                            <FileText className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Doc Analysis</h3>
                        <p className="text-sm text-textMuted mb-4">Upload FIRs or judgements for automated summarization.</p>
                        <div className="flex items-center text-[#D4AF37] text-sm font-medium">
                            Upload Files <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                </div>

            </div>
        </div>
    );
};

export default HomeView;
