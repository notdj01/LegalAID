import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageSquare, Scale, FileText, ChevronDown } from 'lucide-react';
import SpotlightCard from '../UI/SpotlightCard';

const HomeView = ({ onNavigate }) => {
    // Simple intersection observer state for reveal animations
    const [isVisible, setIsVisible] = useState({});
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Update state match the intersection status (true = visible, false = hidden)
                // This ensures the animation plays every time the element enters the viewport
                setIsVisible(prev => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.current.observe(el));

        return () => observer.current.disconnect();
    }, []);

    const scrollToContent = () => {
        document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full min-h-full flex flex-col relative overflow-x-hidden">

            {/* HERO SECTION - Full Height */}
            <section className="min-h-[90vh] flex flex-col justify-center relative p-4 mb-20 perspective-1000">
                {/* Background Image Parallax Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src="/assets/legal_library.png"
                        alt="Legal Library"
                        className="w-full h-full object-cover opacity-40 filter brightness-40 contrast-125 scale-105 animate-pulse-slow lg:scale-100 transition-transform duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full text-center pt-20">
                    <div className="inline-block mb-6 animate-fade-in">
                        <span className="px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
                            The Next Gen Judiciary
                        </span>
                    </div>

                    <h1 className="font-serif text-7xl md:text-9xl font-bold text-white mb-8 leading-tight animate-slide-up drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
                        NyayaSetu<span className="text-primary">.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Bridging tradition with technology. The most advanced AI system designed to navigate India's transition from <span className="text-white font-medium border-b border-white/20">IPC</span> to <span className="text-primary font-medium border-b border-primary/20">BNS</span>.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => onNavigate('chat')}
                            className="px-10 py-5 bg-primary hover:bg-[#F4CF57] text-black font-bold text-lg rounded-none skew-x-[-10deg] transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 group"
                        >
                            <span className="skew-x-[10deg] flex items-center gap-2"> Start Research <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </span>
                        </button>
                        <button
                            onClick={scrollToContent}
                            className="px-10 py-5 bg-transparent border border-white/20 hover:border-white text-white font-medium text-lg rounded-none skew-x-[-10deg] transition-all duration-300 hover:bg-white/5"
                        >
                            <span className="skew-x-[10deg]">Explore Platform</span>
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition" onClick={scrollToContent}>
                    <ChevronDown className="w-8 h-8 text-white" />
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features-section" className="relative z-10 max-w-7xl mx-auto w-full pb-32 px-4">

                <div id="feature-header" className={`reveal-on-scroll transition-all duration-1000 ${isVisible['feature-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} mb-20 text-center`}>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Built for Excellence</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Card 1 */}
                    <div id="card-1" className={`reveal-on-scroll h-full ${isVisible['card-1'] ? 'animate-slide-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                        <SpotlightCard className="p-10 h-full flex flex-col" onClick={() => onNavigate('chat')}>
                            <div className="w-20 h-20 bg-gradient-to-br from-surface to-background border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-4">AI Counsel</h3>
                            <p className="text-textMuted mb-10 leading-relaxed text-lg flex-1">
                                An intelligent legal companion that understands the nuance of Indian Law. Draft, summarize, and query with confidence.
                            </p>
                            <div className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Access Module
                            </div>
                        </SpotlightCard>
                    </div>

                    {/* Card 2 */}
                    <div id="card-2" className={`reveal-on-scroll h-full ${isVisible['card-2'] ? 'animate-slide-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                        <SpotlightCard className="p-10 h-full flex flex-col" onClick={() => onNavigate('compare')}>
                            <div className="w-20 h-20 bg-gradient-to-br from-surface to-background border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <Scale className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-4">Statutory Bridge</h3>
                            <p className="text-textMuted mb-10 leading-relaxed text-lg flex-1">
                                The industry standard for IPC to BNS transition. Visual comparisons, penalty mapping, and active law tagging.
                            </p>
                            <div className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Start Comparison
                            </div>
                        </SpotlightCard>
                    </div>

                    {/* Card 3 */}
                    <div id="card-3" className={`reveal-on-scroll h-full ${isVisible['card-3'] ? 'animate-slide-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                        <SpotlightCard className="p-10 h-full flex flex-col" onClick={() => onNavigate('docs')}>
                            <div className="w-20 h-20 bg-gradient-to-br from-surface to-background border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-4">DocuMind</h3>
                            <p className="text-textMuted mb-10 leading-relaxed text-lg flex-1">
                                Secure, automated document analysis. Upload case files and let our engine extract entities, dates, and relevant sections.
                            </p>
                            <div className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Analyze Files
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* SIMPLE FOOTER */}
            <footer className="bg-[#050505] border-t border-white/5 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>© 2024 NyayaSetu Legal Intelligence. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomeView;
