import React, { useState } from 'react';
import { ArrowRight, Search, Scale, ShieldAlert, BookOpen } from 'lucide-react';

import { compareSections } from '../../lib/api';

const CompareView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCompare = async () => {
        const key = searchTerm.trim();
        if (!key) return;

        setLoading(true);
        setError(false);
        setResult(null);

        try {
            const data = await compareSections(key);

            if (data && data.ipc && data.bns) {
                setResult({
                    ipc: {
                        title: `IPC ${data.ipc.metadata.section || key}`,
                        heading: data.ipc.metadata.offense || "Offense Description",
                        text: data.ipc.text
                    },
                    bns: {
                        title: `BNS ${data.bns.metadata.section || 'N/A'}`,
                        heading: data.bns.metadata.offense || "Corresponding Provision",
                        text: data.bns.text
                    }
                });
            } else {
                setError(true);
                setTimeout(() => setError(false), 3000);
            }
        } catch (err) {
            console.error("Comparison Error:", err);
            setError(true);
            setTimeout(() => setError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 pb-32 animate-fade-in flex flex-col">
            {/* Header */}
            <div className="text-center mb-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <h2 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary mb-4 relative z-10">Statutory Comparison</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto relative z-10">Instantly map <span className="text-red-400/80">Indian Penal Code (IPC)</span> sections to the new <span className="text-green-400/80">Bharatiya Nyaya Sanhita (BNS)</span>.</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative w-full z-20">
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary via-white/50 to-primary rounded-2xl blur opacity-20 transition duration-1000 group-hover:duration-200 ${error ? 'from-red-500 to-red-600 opacity-50' : 'group-hover:opacity-40'}`}></div>
                <div className="relative flex bg-[#0a0a0a] rounded-2xl p-2 shadow-2xl border border-white/10 ring-1 ring-white/5">

                    <div className="flex items-center px-6 border-r border-white/10 bg-white/5 rounded-xl mr-2">
                        <Scale className="w-5 h-5 text-primary mr-2" />
                        <span className="text-slate-300 font-bold text-sm tracking-widest font-mono">IPC</span>
                    </div>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter Section (e.g. 302)..."
                        className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:ring-0 focus:outline-none placeholder-slate-600 font-serif text-xl tracking-wide"
                        onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                    />

                    <button
                        onClick={handleCompare}
                        className="px-8 py-3 bg-gradient-to-b from-primary to-[#b8860b] hover:to-[#a07408] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] active:scale-95 flex items-center gap-2"
                    >
                        <Search className="w-5 h-5" /> Compare
                    </button>
                </div>
                {error && <p className="absolute -bottom-8 left-0 w-full text-center text-red-400 text-sm font-medium animate-shake">Section not found in database.</p>}
            </div>

            {/* Comparison Ledger */}
            <div className="flex-1 grid md:grid-cols-2 gap-0 relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/5 min-h-[400px]">

                {/* Center Divider/Connector */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent z-10 hidden md:block" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                    <div className="p-3 bg-[#0a0a0a] rounded-full border border-white/10 shadow-xl ring-4 ring-black/50">
                        <ArrowRight className={`w-6 h-6 text-slate-500 transition-transform duration-500 ${result ? 'rotate-0 text-primary' : 'rotate-180 opacity-50'}`} />
                    </div>
                </div>

                {/* IPC Side (Left) */}
                <div className="p-10 relative group border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-b from-red-900/5 to-transparent hover:bg-red-900/10 transition-colors duration-500 flex flex-col items-center text-center">
                    <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        <span className="text-xs font-bold text-red-400 tracking-[0.2em]">REPEALED</span>
                    </div>

                    <div className={`mt-12 transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-30 blur-sm translate-y-4'}`}>
                        <h3 className="text-6xl font-serif font-medium text-slate-200 mb-2 opacity-20 group-hover:opacity-40 transition-opacity">
                            {result ? result.ipc.title.split(' ')[1] : '???'}
                        </h3>
                        <h4 className="text-3xl font-serif text-white mb-6">
                            {result ? result.ipc.heading : 'Waiting for input...'}
                        </h4>
                        <p className="text-slate-400 text-lg leading-relaxed font-light font-serif italic">
                            "{result ? result.ipc.text : 'Select a section to view the original IPC definition.'}"
                        </p>
                    </div>
                </div>

                {/* BNS Side (Right) */}
                <div className="p-10 relative group bg-gradient-to-b from-green-900/5 to-transparent hover:bg-green-900/10 transition-colors duration-500 flex flex-col items-center text-center">
                    <div className="absolute top-6 right-6 flex items-center gap-2 opacity-50">
                        <span className="text-xs font-bold text-green-400 tracking-[0.2em]">ACTIVE LAW</span>
                        <BookOpen className="w-5 h-5 text-green-400" />
                    </div>

                    <div className={`mt-12 transition-all duration-500 delay-100 ${result ? 'opacity-100 translate-y-0' : 'opacity-30 blur-sm translate-y-4'}`}>
                        <h3 className="text-6xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-b from-primary to-transparent mb-2 opacity-40 group-hover:opacity-80 transition-opacity">
                            {result ? result.bns.title.split(' ')[1] : '???'}
                        </h3>
                        <h4 className="text-3xl font-serif text-white mb-6">
                            {result ? result.bns.heading : 'New Provision'}
                        </h4>
                        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary" /> {/* Changed from left vertical bar to top horizontal bar for centered look */}
                            <p className="text-slate-300 text-lg leading-relaxed relative z-10 font-serif font-light">
                                {result ? result.bns.text : 'The corresponding Bharatiya Nyaya Sanhita section will appear here.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareView;
