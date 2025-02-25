import React, { useState } from "react";

import "./styles/Chatbot.css";
import "./styles/App.css";


import Sidebar from "./components/Sidebar";
import Chatbot from "./components/chatbot";


const App = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="app-container">
      <Sidebar onSelectChat={setSelectedChatId} />
      {selectedChatId ? (
        <Chatbot chatId={selectedChatId} />
      ) : (
        <div className="welcome-message">Select or create a chat to begin!</div>
      )}
    </div>
  );
};

export default App;
