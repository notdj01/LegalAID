import React, { useState } from 'react';

import Header from './components/Layout/Header';

import ChatView from './components/Views/ChatView';
import CompareView from './components/Views/CompareView';
import DocsView from './components/Views/DocsView';
import HomeView from './components/Views/HomeView';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [fontSize, setFontSize] = useState(0); // 0: Normal, 1: Large, 2: Extra Large
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        // Cinematic Intro Timer
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 3 seconds intro
        return () => clearTimeout(timer);
    }, []);



    React.useEffect(() => {
        // Global Font Size Scaling for Accessibility
        const root = document.documentElement;
        if (fontSize === 0) root.style.fontSize = '100%'; // 16px
        if (fontSize === 1) root.style.fontSize = '115%'; // ~18.4px
        if (fontSize === 2) root.style.fontSize = '130%'; // ~20.8px
    }, [fontSize]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#030303] z-50 flex items-center justify-center overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse-glow" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="text-center relative z-10">
                    {/* Animated Logo */}
                    <div className="w-28 h-28 mb-8 mx-auto relative">
                        <div className="absolute inset-0 rounded-3xl border border-primary/30 animate-spin" style={{ animationDuration: '4s' }} />
                        <div className="absolute inset-2 rounded-2xl border border-primary/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                        <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-primary to-[#b8860b] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                            <span className="font-serif font-bold text-4xl text-black">N</span>
                        </div>
                    </div>

                    <h1 className="font-serif text-5xl font-bold text-white mb-3 tracking-[0.1em] animate-slide-up">
                        NYAYA<span className="text-gradient-gold">SETU</span>
                    </h1>
                    <p className="text-primary/60 text-xs uppercase tracking-[0.4em] animate-fade-in font-medium" style={{ animationDelay: '0.5s' }}>
                        Legal Intelligence Platform
                    </p>

                    {/* Loading Bar */}
                    <div className="mt-10 w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-[#F5E6A3] animate-[progress_2s_ease-in-out_infinite]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#050505] text-textMain font-sans h-screen flex flex-col overflow-hidden selection:bg-primary selection:text-black`}>

            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] animate-float" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/[0.02] rounded-full blur-[150px] animate-pulse-glow" />

                    {/* Subtle Grid Texture */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                </div>

                <Header
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                />

                <div className="flex-1 overflow-y-auto relative p-6 md:p-10 scroll-smooth" id="main-container">
                    {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
                    {activeTab === 'chat' && <ChatView />}
                    {activeTab === 'compare' && <CompareView />}
                    {activeTab === 'docs' && <DocsView />}
                </div>
            </main>
        </div>
    );
}

export default App;
