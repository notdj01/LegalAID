import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Ensure Input is shadcn compatible or customized
import { Send, Languages, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueryInputProps {
    onSend: (query: string, language: 'en' | 'hi') => void;
    loading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSend, loading }) => {
    const [query, setQuery] = useState('');
    const [language, setLanguage] = useState<'en' | 'hi'>('en');

    const handleSend = () => {
        if (query.trim() && !loading) {
            onSend(query, language);
            setQuery('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={language === 'en' ? "Ask a legal question..." : "kanooni sawal puchein..."}
                        disabled={loading}
                        className="pr-24 py-6 text-base bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl shadow-inner"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                            className={cn(
                                "h-8 px-2 text-xs font-bold rounded-lg transition-colors border",
                                language === 'hi'
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            )}
                            title="Toggle Language"
                        >
                            <Languages className="h-3 w-3 mr-1" />
                            {language.toUpperCase()}
                        </Button>
                    </div>
                </div>

                <Button
                    onClick={handleSend}
                    disabled={!query.trim() || loading}
                    className="h-auto px-6 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                    <Send className="h-5 w-5 text-white" />
                </Button>
            </div>
            <div className="mt-2 text-xs text-slate-400 text-center flex justify-between px-2">
                <span>Press Enter to send</span>
                <span>{query.length} chars</span>
            </div>
        </div>
    );
};

export default QueryInput;
