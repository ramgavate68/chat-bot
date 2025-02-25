export const saveChat = (chatId, messages) => {
    let chats = JSON.parse(localStorage.getItem("chats")) || {};
    chats[chatId] = messages;
    localStorage.setItem("chats", JSON.stringify(chats));
  };
  
  export const getChats = () => {
    return JSON.parse(localStorage.getItem("chats")) || {};
  };
  
