import React, { useState, useRef, useEffect } from "react";
import { backend } from "../services/backend";
import type { Message } from "../types/chat";
import { api } from "../api/api";

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  
  // Component mounted
  useEffect(() => {
    console.log('[Breeth] Chat component ready');
  }, []);
 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const executeCommand = async (cmd: string): Promise<any> => {
    try {
      const match = cmd.match(/^(\w+)\((.*)\)$/);
      if (!match) return { success: false, error: "Invalid command" };

      const [, fn, params] = match;
      const args = params ? JSON.parse(`[${params}]`) : [];

      if (typeof (api as any)[fn] === "function") {
        return await (api as any)[fn](...args);
      }

      return { success: false, error: `Function ${fn} not found` };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const handleSend = async (e?: any) => {
    e?.preventDefault();
    
    if (!input.trim() || loading) {
      return;
    }
    
    const text = input.trim();
    setInput("");
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    
    try {
      const context = await api.getCurrentSequenceInfo().catch(() => ({}));
      
      const response = await backend.sendMessage({
        message: text,
        conversation_id: conversationId || undefined,
        context,
      });
      
      if (!conversationId) setConversationId(response.conversation_id);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      if (response.extendscript_commands?.length > 0) {
        const results = [];
        
        for (const cmd of response.extendscript_commands) {
          const result = await executeCommand(cmd);
          results.push(result);
        }
        
        // Store successful commands in Pinecone for learning
        const successfulCommands = response.extendscript_commands.filter((_, i) => results[i]?.success);
        if (successfulCommands.length > 0) {
          backend.storeSuccess({
            user_request: text,
            commands: successfulCommands,
            result: JSON.stringify(results),
            context
          }).catch(() => {}); // Silent fail for Pinecone storage
        }
        
        // Show results in chat - formatted nicely
        const resultsText = results.map((r, i) => {
          if (!r.success) {
            return `❌ Error: ${r.error}`;
          }
          
          // Format result based on what we got
          if (r.sequence) {
            return `✅ Sequence: "${r.sequence.name}"`;
          } else if (r.message) {
            return `✅ ${r.message}`;
          } else {
            // Pretty print JSON
            return `✅ ${JSON.stringify(r, null, 2)}`;
          }
        }).join('\n\n');
        
        if (resultsText) {
          const resultMsg: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: `📊 Results:\n\n${resultsText}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, resultMsg]);
        }
      }
    } catch (error: any) {
      console.error('[Breeth] Chat error:', error);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `❌ ${error.message || "Failed to connect to backend"}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <sp-theme
      theme="spectrum"
      scale="medium"
      color="dark"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <sp-heading size="S">Breeth AI</sp-heading>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
              opacity: 0.6,
            }}
          >
            <div style={{ fontSize: "48px" }}>🎬</div>
            <sp-body size="M">Ask me to edit your Premiere Pro timeline</sp-body>
            <sp-body size="XS" style={{ opacity: 0.7 }}>
              Try: "What's in my sequence?" or "Delete clip 0 from track 1"
            </sp-body>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    backgroundColor:
                      msg.role === "user"
                        ? "#0d66d0"
                        : "rgba(255,255,255,0.06)",
                    boxShadow: msg.role === "user" 
                      ? "0 4px 12px rgba(13,102,208,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <sp-body
                    size="S"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      lineHeight: "1.6",
                      fontFamily: msg.content.includes('Results:') || msg.content.includes('✅') || msg.content.includes('❌')
                        ? 'Monaco, "Courier New", monospace'
                        : 'inherit',
                    }}
                  >
                    {msg.content}
                  </sp-body>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", marginBottom: "12px" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <sp-progress-circle indeterminate size="s" />
                  <sp-body size="S">Thinking...</sp-body>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Input */}
      <sp-divider size="s" />
      <div
        style={{
          padding: "16px",
          display: "flex",
          gap: "8px",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <sp-textfield
          ref={inputRef}
          placeholder="Ask me anything..."
          value={input}
          onInput={(e: any) => setInput(e.target.value)}
          onKeyPress={(e: any) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          quiet
          style={{ flex: 1 }}
        />
        <sp-button
          variant="accent"
          disabled={loading || !input.trim()}
          onClick={handleSend}
        >
          {loading ? "Sending..." : "Send"}
        </sp-button>
      </div>
    </sp-theme>
  );
};
