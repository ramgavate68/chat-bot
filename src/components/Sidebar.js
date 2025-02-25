import React, { useState, useEffect } from "react";
import { getChats } from "../service/chatService";
import "../styles/Sidebar.css";

const Sidebar = ({ onSelectChat }) => {
  const [chats, setChats] = useState({});

  useEffect(() => {
    const chats = getChats();
    setChats(chats);
  }, []);

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    onSelectChat(newChatId);
  };

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      <button onClick={createNewChat} className="new-chat-btn">
        New Chat
      </button>
      <ul>
        {Object.keys(chats).map((chatId) => (
          <li key={chatId} onClick={() => onSelectChat(chatId)}>
            {(chats[chatId]?.[0]?.text || chatId).replace(/^You:\s*/, "")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
