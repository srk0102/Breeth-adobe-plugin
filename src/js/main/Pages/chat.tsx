import React, { useState, useEffect } from 'react';
import { ChatContainer, ChatInput, ChatMessageProps } from '../components/Chat';
import { apiService } from '../services/api';
import { extendscriptService } from '../services/extendscript';
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

interface ChatPageProps {
    height: number;
}

export const ChatPage: React.FC<ChatPageProps> = ({ height }) => {
    const [messages, setMessages] = useState<ChatMessageProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isBackendConnected, setIsBackendConnected] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    
    // Check backend health on mount
    useEffect(() => {
        checkBackendHealth();
        const interval = setInterval(checkBackendHealth, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);
    
    const checkBackendHealth = async () => {
        const isHealthy = await apiService.healthCheck();
        setIsBackendConnected(isHealthy);
    };
    
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };
    
    const handleSendMessage = async (messageText: string) => {
        if (!isBackendConnected) {
            showNotification('error', 'Backend is not connected. Please start the AI backend server.');
            return;
        }
        
        // Add user message to chat
        const userMessage: ChatMessageProps = {
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        try {
            // Get current project context
            const context = await extendscriptService.getProjectContext();
            
            // Send to AI backend
            const response = await apiService.sendMessage({
                message: messageText,
                conversation_id: conversationId || undefined,
                context: context
            });
            
            // Update conversation ID
            if (!conversationId) {
                setConversationId(response.conversation_id);
            }
            
            // Add AI response to chat
            const aiMessage: ChatMessageProps = {
                role: 'assistant',
                content: response.response,
                timestamp: new Date().toISOString(),
                isExecuting: !!response.extendscript_commands
            };
            setMessages(prev => [...prev, aiMessage]);
            
            // Execute ExtendScript commands if any
            if (response.extendscript_commands && response.extendscript_commands.length > 0) {
                try {
                    const results = await extendscriptService.executeCommands(
                        response.extendscript_commands
                    );
                    
                    const allSuccessful = results.every(r => r.success);
                    
                    if (allSuccessful) {
                        showNotification('success', 'Commands executed successfully!');
                        
                        // Update the message to remove executing state
                        setMessages(prev => prev.map((msg, idx) => 
                            idx === prev.length - 1 
                                ? { ...msg, isExecuting: false }
                                : msg
                        ));
                    } else {
                        const failedCommands = results.filter(r => !r.success);
                        showNotification('error', `Some commands failed: ${failedCommands[0]?.error}`);
                        
                        // Add error message
                        const errorMessage: ChatMessageProps = {
                            role: 'assistant',
                            content: `⚠️ Some commands failed to execute. Error: ${failedCommands[0]?.error}`,
                            timestamp: new Date().toISOString()
                        };
                        setMessages(prev => [...prev, errorMessage]);
                    }
                } catch (error) {
                    showNotification('error', 'Failed to execute ExtendScript commands');
                    console.error('ExtendScript execution error:', error);
                }
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('error', 'Failed to get response from AI');
            
            // Add error message to chat
            const errorMessage: ChatMessageProps = {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please make sure the AI backend is running.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div 
            className="flex flex-col bg-gradient-to-b from-gray-900 to-black relative"
            style={{ height }}
        >
            {/* Header with connection status */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Breeth AI Chat</h2>
                    <span className="text-xs text-gray-500">
                        {conversationId ? `Session: ${conversationId.slice(0, 8)}` : 'New Session'}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    {isBackendConnected ? (
                        <>
                            <Wifi className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-500">Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500">Disconnected</span>
                        </>
                    )}
                </div>
            </div>
            
            {/* Notification */}
            {notification && (
                <div 
                    className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-50 
                              px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 
                              ${notification.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                              }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}
            
            {/* Chat Container */}
            <ChatContainer messages={messages} isLoading={isLoading} />
            
            {/* Chat Input */}
            <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading}
                placeholder={
                    isBackendConnected 
                        ? "Ask me anything about your Premiere Pro project..."
                        : "Backend disconnected. Please start the server..."
                }
            />
        </div>
    );
};



