export interface Source {
    type: 'statute' | 'case' | 'regulation';
    citation: string;
    title: string;
    text: string;
    relevance_score: number;
    metadata: any;
}

export interface LegalQuery {
    query: string;
    language: string;
    filters?: any;
}

export interface LegalResponse {
    answer: string;
    sources: Source[];
    confidence: number;
    language: string;
    query_time_ms?: number;
}

export interface ComparisonResponse {
    ipc: any;
    bns: any;
    differences: string[];
}

export interface SummarizationResponse {
    summary: string;
    key_points: string[];
    citations: string[];
}
