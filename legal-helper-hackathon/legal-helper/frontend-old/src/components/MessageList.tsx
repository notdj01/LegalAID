import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LegalResponse } from '@/types';
import CitationCard from './CitationCard';
import { Bot, User, Sparkles } from 'lucide-react';

interface MessageListProps {
    messages: LegalResponse[];
    loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 opacity-50">
                <div className="p-4 bg-slate-100 rounded-full">
                    <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-slate-500 font-medium max-w-sm">
                    Ask a question like "What is the punishment for murder?" or "cheating ki dhara kya hai?"
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-4">
            {messages.map((msg, index) => (
                <div key={index} className="space-y-6 animate-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    {/* User Message */}
                    <div className="flex justify-end">
                        <div className="flex items-start gap-3 max-w-[85%] md:max-w-[75%] flex-row-reverse">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg">
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.query}</p>
                            </div>
                        </div>
                    </div>

                    {/* Assistant Response */}
                    <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-[95%] md:max-w-[85%]">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-900 shadow-sm mt-1">
                                <Bot className="h-5 w-5" />
                            </div>

                            <div className="space-y-3 w-full">
                                <div className="bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-6 py-5 shadow-sm">
                                    <div className="prose prose-slate max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.answer}</p>
                                    </div>

                                    {/* Confidence Badge */}
                                    {msg.confidence_score && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full font-medium border",
                                                msg.confidence_score > 0.8 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            )}>
                                                {Math.round(msg.confidence_score * 100)}% Confidence
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Sources Section */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                                        {msg.sources.map((source, idx) => (
                                            <CitationCard key={idx} source={source} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex justify-start animate-pulse">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-900 shadow-sm">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
