import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { saveChat, getChats } from "../service/chatService";
import "../styles/Chatbot.css";
import { GOOGLE_API_KEY } from "../config/config";

const Chatbot = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef("");

  useEffect(() => {
    const chats = getChats();
    setMessages(chats[chatId] || []);
    scrollToBottom();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { text: `You: ${message}`, sender: "user" },
    ];
    setMessages(newMessages);
    setInput("");
    lastMessageRef.current = message;
    setIsTyping(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: message }] }],
        }
      );

      const botResponse =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Unable to Process. Try Again!";

      simulateTyping(botResponse, newMessages);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsTyping(false);
    }
  };

  const simulateTyping = (text, newMessages) => {
    let index = 0;
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        const typedText = text.slice(0, index + 1);
        setMessages([...newMessages, { text: ` ${typedText}`, sender: "bot" }]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        saveChat(chatId, [...newMessages, { text: ` ${text}`, sender: "bot" }]);
      }
    }, 13); // 45 WPM = ~133ms per character
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        ))}
      </div>
      
      <button className="scroll-bottom-btn" onClick={scrollToBottom}>⬇️</button>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={() => sendMessage()}>Send</button>
        {lastMessageRef.current && (
          <button
            className="repeat-btn"
            onClick={() => sendMessage(lastMessageRef.current)}
          >
            ⟳
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
