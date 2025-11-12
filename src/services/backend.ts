import type { ChatRequest, ChatResponse } from '../types/chat';

const BACKEND_URL = 'http://127.0.0.1:8000';

class BackendService {
  private async request<T>(url: string, method: 'GET' | 'POST', body?: any): Promise<T> {
    try {
      // Try to use hybrid addon for network calls on macOS
      const hybridModule = await require("bolt-uxp-hybrid.uxpaddon");
      
      const curlCmd = method === 'GET'
        ? `curl -s "${url}"`
        : `curl -s -X POST -H "Content-Type: application/json" -d '${JSON.stringify(body)}' "${url}"`;
      
      const result = hybridModule.execSync(curlCmd);
      return JSON.parse(result);
    } catch (hybridError) {
      console.log('[Backend] Hybrid addon failed, trying XHR:', hybridError);
      
      // Fallback to XMLHttpRequest
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 30000;
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Invalid response'));
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.ontimeout = () => reject(new Error('Timeout'));
        
        xhr.send(body ? JSON.stringify(body) : null);
      });
    }
  }
  
  async sendMessage(req: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(`${BACKEND_URL}/chat`, 'POST', req);
  }
  
  async storeSuccess(data: {
    user_request: string;
    commands: string[];
    result: string;
    context?: any;
  }): Promise<{ status: string; message: string }> {
    return this.request(`${BACKEND_URL}/store-success`, 'POST', data);
  }
}

export const backend = new BackendService();
