// components/Chat.js
'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';

export default function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage: any = async (e: Event) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Add empty assistant message for streaming
        const assistantMessage = { role: 'assistant', content: '' };
        setMessages([...newMessages, assistantMessage]);

        try {
            const response: any = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                setMessages((prev: any) => {
                                    const updated = [...prev];
                                    updated[updated.length - 1].content += data.content;

                                    return updated;
                                });
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev: any) => {
                const updated = [...prev];
                updated[updated.length - 1].content = 'Sorry, there was an error processing your message.';

                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Ollama Chat Agent</h1>
                <div className={styles.status}>
                    {isLoading ? 'Thinking...' : 'Ready'}
                </div>
            </div>
            
            <div className={styles.messages}>
                {messages.map((message: any, index: number) => (
                    <div
                        key={index}
                        className={`${styles.message} ${
                        message.role === 'user' ? styles.userMessage : styles.assistantMessage
                        }`}
                    >
                        <div className={styles.messageRole}>
                            {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className={styles.messageContent}>
                            <pre className={styles.messageText}>{message.content}</pre>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className={styles.inputForm}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.input}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={styles.sendButton}
                >
                    Send
                </button>
            </form>
        </div>
    );
}