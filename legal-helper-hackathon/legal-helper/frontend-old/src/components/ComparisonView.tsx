import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { compareSections } from '@/lib/api';
import { ComparisonResponse } from '@/types';

const ComparisonView: React.FC = () => {
    const [section, setSection] = useState('');
    const [result, setResult] = useState<ComparisonResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!section.trim()) return;
        setLoading(true);
        setError('');
        try {
            // Assume API takes simple "302" or "IPC 302"
            const data = await compareSections(section);
            setResult(data);
        } catch (err) {
            setError('Failed to fetch comparison. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in-up">
            <Card className="glass-panel border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Enter Citation (e.g., IPC 302, 420, 376...)"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className="pl-10 h-12 text-lg bg-slate-50 border-slate-200 focus-visible:ring-blue-500 w-full"
                            />
                        </div>
                        <Button
                            onClick={handleCompare}
                            disabled={loading}
                            className="h-12 px-8 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-transform active:scale-95 min-w-[140px]"
                        >
                            {loading ? 'Analyzing...' : 'Compare'}
                        </Button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 bg-white rounded-full shadow-lg border border-slate-100 items-center justify-center text-slate-400">
                        <ArrowRightLeft className="h-6 w-6" />
                    </div>

                    {/* IPC Side (Old) */}
                    <Card className="border-red-100 bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="h-2 bg-red-500 w-full" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="px-2 py-1 bg-red-50 rounded text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
                                    Old Regime (IPC)
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-serif text-slate-900 mt-2">
                                {result.ipc ? result.ipc.metadata?.full_reference : "Not Found"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.ipc ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-700">{result.ipc.metadata?.title}</h3>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="whitespace-pre-wrap text-slate-600 leading-relaxed font-serif">
                                            "{result.ipc.text}"
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">
                                            {result.ipc.metadata?.chapter}
                                        </span>
                                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded">
                                            Repealed
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 italic">
                                    No corresponding IPC section found.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* BNS Side (New) */}
                    <Card className="border-green-100 bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="h-2 bg-green-500 w-full" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="px-2 py-1 bg-green-50 rounded text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">
                                    Active Law (BNS)
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-serif text-slate-900 mt-2">
                                {result.bns ? result.bns.metadata?.full_reference : "Not Mapped"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.bns ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-700">{result.bns.metadata?.title}</h3>
                                    <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                                        <p className="whitespace-pre-wrap text-slate-800 leading-relaxed font-serif">
                                            "{result.bns.text}"
                                        </p>
                                    </div>
                                    {result.bns.metadata?.changes && (
                                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-900">
                                            <strong className="block mb-1 text-amber-700 font-semibold uppercase text-xs tracking-wide">Key Changes:</strong>
                                            {result.bns.metadata.changes}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400 italic">
                                    No corresponding BNS section found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ComparisonView;
