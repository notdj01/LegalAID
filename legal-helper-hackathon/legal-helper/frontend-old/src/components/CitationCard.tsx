import React from 'react';
import { Source } from '@/types';
import { BookOpen, ExternalLink, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CitationCardProps {
    source: Source;
}

const CitationCard: React.FC<CitationCardProps> = ({ source }) => {
    const [expanded, setExpanded] = React.useState(false);

    // Handle both old (full_reference) and new (citation) formats
    // Handle both old (full_reference) and new (citation) formats
    const reference = source.citation || 'Unknown Source';
    const isStatute = reference.includes('BNS') || reference.includes('IPC') || reference.includes('Section');

    return (
        <Card className="bg-slate-50 border-slate-200 transition-all hover:border-blue-200 hover:shadow-md group">
            <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-md text-blue-700">
                            {isStatute ? (
                                <BookOpen className="h-3.5 w-3.5" />
                            ) : (
                                <Scale className="h-3.5 w-3.5" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-blue-900 leading-tight">
                                {reference}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{source.title || ''}</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="h-6 w-6 p-0 hover:bg-slate-200"
                    >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className={cn("p-3 pt-0 text-xs text-slate-600 transition-all", expanded ? "block" : "hidden")}>
                <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                    <p className="leading-snug bg-white p-2 rounded border border-slate-100 italic">
                        "{(source.text || '').substring(0, 150)}..."
                    </p>
                    {source.metadata?.link && (
                        <a
                            href={source.metadata.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 font-medium"
                        >
                            View Source <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CitationCard;
