import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Attendance Assistant powered by Gemini. Ask me anything!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dbDataContext, setDbDataContext] = useState("");
  const messagesEndRef = useRef(null);

  const fetchDatabaseContext = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const students = await res.json();
        const studentInfo = students.map(s => `${s.name} (Roll: ${s.rollNumber}, Dept: ${s.department}, Sec: ${s.section})`).join(', ');
        setDbDataContext(`\nHere is the LIVE data from our database right now. If the user asks about students, use this exact data to answer them: [${studentInfo}]`);
      }
    } catch (e) {
      console.warn("Could not fetch DB context for AI");
    }
  };

  useEffect(() => {
    fetchDatabaseContext();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    // Optimistically add user text
    const newMessages = [...messages, { text: userMsg, sender: 'user' }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        const warningMsg = "My Gemini API Key is missing! Please open your `src/main/frontend/.env` file and paste your API key.";
        setMessages(prev => [...prev, { text: warningMsg, sender: 'bot' }]);
        setIsTyping(false);
        return;
      }

      // Format previous conversation context for Gemini
      // Filter out system warnings or default "Hello!" messages to keep context clean
      const contextMessages = newMessages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Add System Persona and the Live Database Context to the front
      const systemInstruction = "You are a professional, helpful, and concise AI assistant integrated into a school Attendance Management System. Your job is to help teachers with their problems regarding marking attendance, viewing analytics, handling students data, and general platform usage. Be polite. Be brief." + dbDataContext;

      // Ensure we always have an alternating user/model history
      const promptPayload = {
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: contextMessages
      };

      // Using the standard Gemini 2.5 Flash endpoint required by all modern Google accounts
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch response');
      }

      const botMsg = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't formulate a response.";
      
      setMessages(prev => [...prev, { text: botMsg, sender: 'bot' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: `Oops, something went wrong: ${error.message}`, sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <div 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.2s',
          fontSize: '28px'
        }}
        title="Open Chatbot"
      >
        {isOpen ? '✕' : '✨'}
      </div>

      {isOpen && (
        <div 
          className="chatbot-window"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '380px',
            height: '550px',
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            border: '1px solid var(--border)'
          }}
        >
          <div className="chat-header" style={{
            padding: '16px',
            background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>✨</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Gemini AI Assistant</h3>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Powered by Google Gemini 1.5</p>
            </div>
          </div>
          
          <div className="chat-messages" style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : '#334155',
                  color: 'white',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
                <div style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#334155',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    borderBottomLeftRadius: '4px',
                    display: 'flex',
                    gap: '4px'
                  }}>
                    <div className="typing-dot" style={{width: '6px', height: '6px', backgroundColor: '#94A3B8', borderRadius: '50%', animation: 'chatBounce 1.4s infinite ease-in-out both'}}></div>
                    <div className="typing-dot" style={{width: '6px', height: '6px', backgroundColor: '#94A3B8', borderRadius: '50%', animation: 'chatBounce 1.4s infinite ease-in-out both', animationDelay: '0.2s'}}></div>
                    <div className="typing-dot" style={{width: '6px', height: '6px', backgroundColor: '#94A3B8', borderRadius: '50%', animation: 'chatBounce 1.4s infinite ease-in-out both', animationDelay: '0.4s'}}></div>
                </div>
            )}
            <style>
            {`
              @keyframes chatBounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
              .chat-messages::-webkit-scrollbar {
                width: 6px;
              }
              .chat-messages::-webkit-scrollbar-track {
                background: transparent;
              }
              .chat-messages::-webkit-scrollbar-thumb {
                background: #475569;
                border-radius: 4px;
              }
            `}
            </style>
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-area" style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px',
            backgroundColor: '#0F172A'
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Gemini anything..."
              rows={1}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '20px',
                border: '1px solid #475569',
                backgroundColor: '#1E293B',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isTyping ? 'default' : 'pointer',
                opacity: isTyping ? 0.6 : 1,
                transition: 'transform 0.2s'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
