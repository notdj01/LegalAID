import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ScanLine, Shield, AlertCircle } from 'lucide-react';

import { summarizeDocument } from '../../lib/api';

const DocsView = () => {
    const [status, setStatus] = useState('idle'); // idle, scanning, analyzing, done
    const [fileName, setFileName] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleFileUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            setStatus('scanning');

            try {
                // Simulate scanning phase
                await new Promise(resolve => setTimeout(resolve, 1500));
                setStatus('analyzing');

                const data = await summarizeDocument(file);
                setAnalysisResult(data);
                setStatus('done');
            } catch (error) {
                console.error("Analysis Error:", error);
                setStatus('idle');
                alert("Failed to analyze document. Please try again.");
            }
        }
    };

    const reset = () => {
        setStatus('idle');
        setFileName('');
        setAnalysisResult(null);
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center p-6 animate-fade-in relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />
            </div>

            {/* Main Card */}
            <div className="w-full max-w-2xl relative z-10 transition-all duration-500">

                {status === 'idle' && (
                    <div className="glass-panel rounded-3xl p-1 animate-slide-up group">
                        <div className="bg-[#0a0a0a] rounded-[22px] border border-white/5 p-12 text-center relative overflow-hidden">

                            {/* Animated Border Gradient on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleFileUpload}
                            />

                            <div className="w-24 h-24 bg-surface/50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/10 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,215,0,0.15)] transition-all duration-300">
                                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>

                            <h3 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-3">
                                Upload Legal Documents
                            </h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                                Drop your <span className="text-primary/70 border-b border-primary/20">FIR</span>, <span className="text-primary/70 border-b border-primary/20">Case File</span>, or <span className="text-primary/70 border-b border-primary/20">Evidence</span> here.
                                <br />Top-tier encryption enabled.
                            </p>

                            <div className="flex justify-center gap-4">
                                <span className="px-4 py-2 bg-white/5 rounded-lg text-xs font-medium text-slate-400 border border-white/5 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> PDF Only
                                </span>
                                <span className="px-4 py-2 bg-white/5 rounded-lg text-xs font-medium text-slate-400 border border-white/5 flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Secure
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {(status === 'scanning' || status === 'analyzing') && (
                    <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-12 text-center relative overflow-hidden shadow-2xl">

                        {/* Scanner Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_#D4AF37] animate-[scan_2s_ease-in-out_infinite]" />

                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />
                            <div className="absolute inset-0 border-2 border-primary rounded-xl border-t-transparent border-l-transparent animate-spin" />
                            <ScanLine className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
                            {status === 'scanning' ? 'Scanning Document...' : 'Analyzing Legal Context...'}
                        </h3>
                        <p className="text-slate-400 text-sm font-mono tracking-wider uppercase">
                            {fileName}
                        </p>

                        <div className="mt-8 h-1 w-64 mx-auto bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" style={{ width: '100%' }} />
                        </div>
                    </div>
                )}

                {status === 'done' && analysisResult && (
                    <div className="glass-panel p-1 rounded-3xl animate-scale-in">
                        <div className="bg-[#0f0f0f] rounded-[20px] p-8 border border-white/5 relative">

                            {/* Success Badge */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">
                                <CheckCircle2 className="w-4 h-4" /> Analysis Complete
                            </div>

                            <div className="mt-4 flex flex-col gap-6">
                                {/* Header Info */}
                                <div className="text-center border-b border-white/5 pb-6">
                                    <h2 className="text-2xl font-serif text-white mb-1">{fileName}</h2>
                                    <p className="text-sm text-slate-400">Document Analysis Report</p>
                                </div>

                                {/* Key Insights Grid - Adapted for Key Points */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Key Points</p>
                                        <ul className="space-y-2">
                                            {analysisResult.key_points && analysisResult.key_points.map((point, idx) => (
                                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold text-white">AI Summary</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {analysisResult.summary}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-white/5 pt-6 flex gap-3">
                                    <button
                                        onClick={reset}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-all border border-white/5"
                                    >
                                        Upload Another
                                    </button>
                                    <button className="flex-1 py-3 bg-primary hover:bg-primaryDark text-black rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                                        View Full Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocsView;
