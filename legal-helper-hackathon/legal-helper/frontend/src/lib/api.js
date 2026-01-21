import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const queryLegal = async ({ query, language = 'en', filters }) => {
    try {
        const response = await api.post('/query', { query, language, filters });
        return response.data;
    } catch (error) {
        console.error('Error querying legal API:', error);
        throw error;
    }
};

export const compareSections = async (ipcSection) => {
    try {
        const response = await api.post('/compare', { ipc_section: ipcSection });
        return response.data;
    } catch (error) {
        console.error('Error comparing sections:', error);
        throw error;
    }
};

export const summarizeDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/summarize', formData, {
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

export const checkHealth = async () => {
    try {
        const response = await axios.get('http://localhost:8000/health');
        return response.data;
    } catch (error) {
        return { status: "error" };
    }
};

export default api;
