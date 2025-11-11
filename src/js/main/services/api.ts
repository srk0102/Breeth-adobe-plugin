/**
 * API Service for communicating with the Breeth AI Backend
 */

import axios, { AxiosInstance } from 'axios';

export interface ChatRequest {
    message: string;
    conversation_id?: string;
    context?: Record<string, any>;
}

export interface ChatResponse {
    response: string;
    conversation_id: string;
    extendscript_commands?: string[];
    metadata?: Record<string, any>;
}

class ApiService {
    private client: AxiosInstance;
    private baseURL: string;
    
    constructor() {
        this.baseURL = 'http://127.0.0.1:8000';
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    
    /**
     * Send a chat message to the AI backend
     */
    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await this.client.post<ChatResponse>('/chat', request);
            return response.data;
        } catch (error) {
            console.error('Error sending message to AI backend:', error);
            throw new Error('Failed to communicate with AI backend. Make sure the server is running.');
        }
    }
    
    /**
     * Check if the backend is healthy
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/health');
            return response.data.status === 'healthy';
        } catch (error) {
            console.error('Backend health check failed:', error);
            return false;
        }
    }
    
    /**
     * Clear conversation history
     */
    async clearConversation(conversationId: string): Promise<void> {
        try {
            await this.client.post(`/clear-conversation/${conversationId}`);
        } catch (error) {
            console.error('Error clearing conversation:', error);
            throw error;
        }
    }
    
    /**
     * Update the base URL (for configuration changes)
     */
    setBaseURL(url: string) {
        this.baseURL = url;
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export const apiService = new ApiService();



