import React, { useState } from 'react';
import { queryLegal } from '@/lib/api';
import { LegalResponse } from '@/types';
import MessageList from './MessageList';
import QueryInput from './QueryInput';
import { Card } from '@/components/ui/card';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<LegalResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSendQuery = async (queryText: string, language: 'en' | 'hi') => {
        if (!queryText.trim()) return;

        // Optimistic UI update (optional, but we'll wait for loading)
        setLoading(true);

        try {
            const response = await queryLegal({
                query: queryText,
                language: language,
                jurisdiction: 'India'
            });

            // Append new message-response pair
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error("Failed to query:", error);
            // Construct a fake error message response
            setMessages(prev => [...prev, {
                query: queryText,
                answer: "I apologize, but I encountered an error connecting to the legal database. Please check your connection and try again.",
                sources: [],
                confidence_score: 0
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-panel border-none shadow-xl min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <MessageList messages={messages} loading={loading} />
            </div>

            <div className="p-4 bg-white/80 border-t border-slate-100 backdrop-blur-md sticky bottom-0 z-10">
                <QueryInput onSend={handleSendQuery} loading={loading} />
            </div>
        </Card>
    );
};

export default ChatInterface;
