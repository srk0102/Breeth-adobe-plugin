import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

export interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    isLoading = false,
    placeholder = "Ask me anything about your Premiere Pro project..."
}) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const handleSend = () => {
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
            
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };
    
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        
        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };
    
    return (
        <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm p-4">
            <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-500 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 resize-none overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed
                                 text-sm leading-relaxed"
                        rows={1}
                        style={{ maxHeight: '120px' }}
                    />
                </div>
                
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 
                             flex items-center justify-center transition-all duration-200
                             hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Send className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 px-1">
                <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
        </div>
    );
};



