import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();



const ChatProvider = ({ navigation, children }) => {

    const URL = 'https://chat-with.onrender.com/api';

    const [user, setUser] = useState(null); // Initialize as null
    const [selectedChat, setSelectedChat] = useState(null); // Initialize as null
    const [chats, setChats] = useState([]); // Initialize as an empty array
    const [notification, setNotification] = useState([]); // Initialize as an empty array
    const [fetchAgain, setFetchAgain] = useState(false); // Initialize as an empty array
    const [userToggle, setUserToggle] = useState(false); // Initialize as an empty array


    return (
        <ChatContext.Provider value={{ URL, user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, fetchAgain, setFetchAgain, userToggle, setUserToggle }} >
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider;