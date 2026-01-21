import axios from 'axios';
import { LegalQuery, LegalResponse, ComparisonResponse, SummarizationResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface QueryParams {
    query: string;
    language?: string;
    jurisdiction?: string;
}

export const queryLegal = async ({ query, language = 'en', jurisdiction }: QueryParams): Promise<LegalResponse> => {
    try {
        // Map jurisdiction to filters if provided
        const filters = jurisdiction ? { jurisdiction } : undefined;
        const response = await api.post<LegalResponse>('/query', { query, language, filters });
        return response.data;
    } catch (error) {
        console.error('Error querying legal API:', error);
        throw error;
    }
};

export const compareSections = async (ipcSection: string): Promise<ComparisonResponse> => {
    try {
        const response = await api.post<ComparisonResponse>('/compare', { ipc_section: ipcSection });
        return response.data;
    } catch (error) {
        console.error('Error comparing sections:', error);
        throw error;
    }
};

export const summarizeDocument = async (file: File): Promise<SummarizationResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post<SummarizationResponse>('/summarize', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error summarizing document:', error);
        throw error;
    }
};

export const checkHealth = async (): Promise<{ status: string }> => {
    try {
        const response = await api.get('/health'); // Note: /health is often at root, but configured at /api/health in some setups or root. Check main.py
        // In main.py: @app.get("/health") is at root. 
        // So we should strictly call http://localhost:8000/health
        // But axios instance has baseURL /api.
        // Let's override baseURL for this call or just assume /api/health if we moved it.
        // Actually main.py has @app.get('/health'). It is NOT under /api router.
        // So we need a separate call or override.
        const healthApi = axios.create({ baseURL: 'http://localhost:8000' });
        const healthRes = await healthApi.get('/health');
        return healthRes.data;
    } catch (error) {
        return { status: "error" };
    }
};

export default api;
