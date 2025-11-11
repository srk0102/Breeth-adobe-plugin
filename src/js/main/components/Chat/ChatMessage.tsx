import React from 'react';
import { Bot, User } from 'lucide-react';

export interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    isExecuting?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
    role, 
    content, 
    timestamp,
    isExecuting 
}) => {
    const isUser = role === 'user';
    
    return (
        <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}
            
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div 
                    className={`rounded-2xl px-4 py-2.5 ${
                        isUser 
                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                            : 'bg-gray-800 text-gray-100 border border-gray-700'
                    }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                    {isExecuting && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-purple-300">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-300"></div>
                            <span>Executing in Premiere Pro...</span>
                        </div>
                    )}
                </div>
                {timestamp && (
                    <span className="text-xs text-gray-500 mt-1 px-2">
                        {new Date(timestamp).toLocaleTimeString()}
                    </span>
                )}
            </div>
            
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-300" />
                </div>
            )}
        </div>
    );
};



