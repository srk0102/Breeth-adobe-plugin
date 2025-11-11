import React, { useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageProps } from './ChatMessage';

export interface ChatContainerProps {
    messages: ChatMessageProps[];
    isLoading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    return (
        <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
            style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 #1F2937'
            }}
        >
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Welcome to Breeth AI
                        </h3>
                        <p className="text-gray-400 text-sm">
                            I'm your AI assistant for Adobe Premiere Pro. 
                            Ask me to edit clips, add effects, organize your project, or anything else!
                        </p>
                        <div className="mt-6 text-left space-y-2">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                Try asking:
                            </p>
                            <div className="space-y-2">
                                {[
                                    "Add a slow motion effect to the selected clip",
                                    "Create a new sequence for my intro",
                                    "Show me all the clips in my project",
                                    "Add a marker at the current playhead position"
                                ].map((example, i) => (
                                    <div 
                                        key={i}
                                        className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700"
                                    >
                                        • {example}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <ChatMessage key={index} {...message} />
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-sm">🤖</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-sm text-gray-400 ml-2">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
};



