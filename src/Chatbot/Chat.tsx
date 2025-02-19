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

  const handleSendMessage = () => {
    if (userInput.trim()) {
      // Add user's message
      setMessages([
        ...messages,
        { text: userInput, fromBot: false },
      ]);
      handleBotResponse(userInput); // Handle bot's response
      setUserInput(''); // Clear the input
    }
  };

  const handleBotResponse = (input: string) => {
    let response = '';

    // Handle basic greetings and vaccine details
    if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
      response = 'Hello! How can I assist you today?';
    } else if (input.toLowerCase().includes('vaccine') || input.toLowerCase().includes('vaccination')) {
      response = 'Vaccines are important for preventing diseases. Do you need information about a specific vaccine?';
    } else {
      response = "I'm sorry, I didn't understand that. Can you please clarify?";
    }

    // Add bot's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, fromBot: true },
    ]);
  };

  return (
    <div style={styles.chatbotContainer}>
      <motion.div
        style={isOpen ? styles.chatWindow : { display: 'none' }}
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
            <p
              key={index}
              style={message.fromBot ? styles.chatMessage : styles.userMessage}
            >
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
          <button onClick={handleSendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </motion.div>

      <button onClick={toggleChat} style={styles.chatToggle}>
        <FiMessageCircle size={24} color="#fff" />
      </button>
    </div>
  );
};

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '65px',
    right: '20px',
    zIndex: 1000,
  } as React.CSSProperties,
  chatWindow: {
    width: '300px',
    height: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as React.CSSProperties,
  chatHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  chatTitle: {
    margin: 0,
    fontSize: '16px',
  } as React.CSSProperties,
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  } as React.CSSProperties,
  chatBody: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
  } as React.CSSProperties,
  chatMessage: {
    backgroundColor: '#e0f7fa',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    fontSize: '14px',
  } as React.CSSProperties,
  userMessage: {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '8px',
    fontSize: '14px',
    textAlign: 'right',
  } as React.CSSProperties,
  chatFooter: {
    padding: '10px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  chatInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  } as React.CSSProperties,
  sendButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
  } as React.CSSProperties,
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
  } as React.CSSProperties,
};

export default Chatbot;
