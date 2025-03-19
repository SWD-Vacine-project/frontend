import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";
import { marked } from "marked";

const Chatbot1: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ text: string; fromBot: boolean }[]>([
    { text: "Hi there! How can I help you today?", fromBot: true },
  ]);
  const [userInput, setUserInput] = useState<string>("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput("");
    setMessages((prev) => [...prev, { text: userMessage, fromBot: false }]);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: 
          "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free", // Sử dụng model hợp lệ
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      const botReply =
        data.choices?.[0]?.message?.content || "This information is quite important, please contact to us by hotline or come to our center to know more.";
      setMessages((prev) => [...prev, { text: botReply, fromBot: true }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong. Please try again.", fromBot: true },
      ]);
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
            <button onClick={toggleChat} style={styles.closeButton}>
              ×
            </button>
          </div>
          <div style={styles.chatBody}>
            {messages.map((message, index) => (
              <p
  key={index}
  style={message.fromBot ? styles.chatMessage : styles.userMessage}
  {...(message.fromBot
    ? { dangerouslySetInnerHTML: { __html: marked.parse(message.text) as string } }
    : {})}
>
  {!message.fromBot ? message.text : null}
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </motion.div>
      )}
      <button onClick={toggleChat} style={styles.chatToggle}>
        <FiMessageCircle size={24} color="#fff" />
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatbotContainer: {
    position: "fixed",
    bottom: "65px",
    right: "20px",
    zIndex: 1000,
  },
  chatWindow: {
    width: "300px",
    height: "400px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    margin: 0,
    fontSize: "16px",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatBody: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
  },
  chatMessage: {
    backgroundColor: "#e0f7fa",
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "8px",
    fontSize: "14px",
  },
  userMessage: {
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "8px",
    fontSize: "14px",
    textAlign: "right",
  },
  chatFooter: {
    padding: "10px",
    borderTop: "1px solid #ddd",
    display: "flex",
    gap: "8px",
  },
  chatInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  chatToggle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    border: "none",
    cursor: "pointer",
  },
};

export default Chatbot1;
