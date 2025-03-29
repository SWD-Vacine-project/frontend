import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; fromBot: boolean }[]>([
    { text: 'Hi there! How can I help you today?', fromBot: true },
  ]);
  const [userInput, setUserInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = { text: userInput, fromBot: false };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput('');
      
      const botResponse = await fetchBotResponse(userInput);
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, fromBot: true }]);
    }
  };

  const fetchBotResponse = async (input: string): Promise<string> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        }),
      });
      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I didn't understand that.";
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "Sorry, I'm having trouble responding right now.";
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <motion.div
          style={styles.chatWindow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={styles.chatHeader}>
            <h4 style={styles.chatTitle}>Virtual Assistant</h4>
            <button onClick={toggleChat} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.chatBody}>
            {messages.map((message, index) => (
              <p key={index} style={message.fromBot ? styles.chatMessage : styles.userMessage}>
                {message.text}
              </p>
            ))}
          </div>
          <div style={styles.chatFooter}>
            <input
              type="text"
              placeholder="Type your message..."
              style={styles.chatInput}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
          </div>
        </motion.div>
      )}

      <motion.button onClick={toggleChat} style={styles.chatToggle} whileTap={{ scale: 0.9 }}>
        <FiMessageCircle size={24} color="#fff" />
      </motion.button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '150px',
    right: '20px',
    zIndex: 1000,
  },
  chatWindow: {
    width: '320px',
    height: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '70px',
    right: '0px',
  },
  chatHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: { margin: 0, fontSize: '16px' },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  },
  chatBody: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto' as 'auto',
    backgroundColor: '#f9f9f9',
  },
  chatMessage: {
    backgroundColor: '#e0f7fa',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  userMessage: {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    fontSize: '14px',
    textAlign: 'right',
  },
  chatFooter: {
    padding: '10px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '8px',
  },
  chatInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
  },
  chatToggle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Chatbot;