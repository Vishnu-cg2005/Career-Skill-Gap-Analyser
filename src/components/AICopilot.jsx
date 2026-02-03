import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { api } from '../services/api';
import './AICopilot.css';
import './AICopilot_Chips.css';

export default function AICopilot() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, SEARCHING, TYPING
    const [currentStream, setCurrentStream] = useState('');
    const messagesEndRef = useRef(null);

    // Initial greeting logic (same as before)
    useEffect(() => {
        let greeting = "Hi! I'm your Career Assistant. Need help?";
        let chips = [];
        // ... (Keep existing greeting logic or simplify for new UI)
        if (location.pathname === '/analyze') chips = ["How does analysis work?", "Supported formats?"];
        else if (location.pathname === '/results') chips = ["Explain gaps", "Improvement tips"];
        else chips = ["What is React?", "Interview tips"];

        setMessages([{ id: 'init', text: greeting, sender: 'bot', chips }]);
    }, [location.pathname]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, currentStream, status]);

    const simulateTyping = async (fullText) => {
        setStatus('TYPING');
        setCurrentStream('');
        const chars = fullText.split('');
        for (let i = 0; i < chars.length; i++) {
            setCurrentStream(prev => prev + chars[i]);
            // Random typing speed variation
            await new Promise(r => setTimeout(r, Math.random() * 30 + 10));
        }
        setMessages(prev => [...prev, { id: Date.now(), text: fullText, sender: 'bot' }]);
        setCurrentStream('');
        setStatus('IDLE');
    };

    const handleSend = async (text) => {
        const msgText = text || inputText;
        if (!msgText.trim()) return;

        // User Message
        setMessages(prev => [...prev, { id: Date.now(), text: msgText, sender: 'user' }]);
        setInputText('');

        // Start Search Simulation
        setStatus('SEARCHING');

        try {
            // 1. "Search" Delay
            await new Promise(r => setTimeout(r, 1500));

            // 2. Get Full Response from API
            const response = await api.chatWithAssistant(msgText);

            // 3. Stream it
            await simulateTyping(response);

        } catch (error) {
            console.error(error);
            setStatus('IDLE');
        }
    };

    // Simple Markdown Parser
    const renderMessage = (text) => {
        // 1. Headers (### Header)
        let html = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');

        // 2. Bold (**text**)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 3. Code Blocks (```code```)
        html = html.replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>');

        // 4. Lists (* item)
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>'); // Wrap adjacent lis (simplified)

        // 5. Clean up multiple ULs (basic regex fix)
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // 6. Newlines to BR (outside of code blocks)
        html = html.replace(/\n/g, '<br />');

        return { __html: html };
    };

    return (
        <div className="copilot-widget">
            {isOpen && (
                <div className="copilot-window premium-glass">
                    <div className="copilot-header">
                        <div className="flex items-center gap-2">
                            <span className="gemini-sparkle">✨</span>
                            <div>
                                <h3>Gemini Career Agent</h3>
                                <span className="text-[10px] text-blue-200 opacity-80">Powered by Google Gemini</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn"><X size={18} /></button>
                    </div>

                    <div className="messages-area">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="message-container">
                                <div className={`message ${msg.sender} ${msg.sender === 'bot' ? 'glass-msg' : 'accent-msg'}`}>
                                    {msg.sender === 'bot' ? (
                                        <div className="ai-response" dangerouslySetInnerHTML={renderMessage(msg.text)} />
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                {msg.chips && msg.sender === 'bot' && (
                                    <div className="chips-container">
                                        {msg.chips.map((chip, i) => (
                                            <button key={i} className="chat-chip" onClick={() => handleSend(chip)}>{chip}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Status Indicators */}
                        {status === 'SEARCHING' && (
                            <div className="status-indicator searching">
                                <span className="gemini-loader"></span> Thinking...
                            </div>
                        )}

                        {/* Streamed Text (Ghost Message) */}
                        {status === 'TYPING' && (
                            <div className="message-container">
                                <div className="message bot glass-msg">
                                    <div className="ai-response" dangerouslySetInnerHTML={renderMessage(currentStream)} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form className="copilot-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <input
                            type="text"
                            className="copilot-input"
                            placeholder="Ask Gemini anything..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={status !== 'IDLE'}
                        />
                        <button type="submit" className="send-btn" disabled={!inputText.trim() || status !== 'IDLE'}>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}

            <button className="copilot-trigger" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <div className="gemini-logo-icon">✨</div>}
            </button>
        </div>
    );
}
