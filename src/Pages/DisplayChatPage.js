import { Alert, Button, ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScrollableChats from '../components/subcomponents/ScrollableChats'
import { Avatar, Spinner, } from 'tamagui'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { getSender, getSenderImage } from '../config/ChatLogic'
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';



import io from 'socket.io-client';
const ENDPOINT = "https://chat-with.onrender.com";
var socket, selectedChatCompare;

const DisplayChatPage = ({ navigation }) => {

  const [inputHeight, setInputHeight] = useState(40);
  const [loading, setLoading] = useState(false);
  const [loadingForSend, setLoadingForSend] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, URL, notification, setNotification, setFetchAgain, fetchAgain } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(`${URL}/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRefresh = () => {
    // Handle refresh here
    console.log('Refresh');
    // setFetchAgain(!fetchAgain);
    toggleModal();
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.disconnect();
      socket.off("connected");
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [user])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

  }, [selectedChat])

  useEffect(() => {

    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => (
        <TouchableOpacity style={styles.customHeader}>
          <Avatar circular size="$2" alignItems='center'>
            <Avatar.Image
              accessibilityLabel={!selectedChat.isGroupChat && user ? getSender(user, selectedChat.users) : selectedChat.chatName}
              src={getSenderImage(user, selectedChat.users)}
            />
            <Avatar.Fallback delayMs={600} backgroundColor="#777" />
          </Avatar>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#000', paddingLeft: 5, }} >{!selectedChat.isGroupChat && user ? getSender(user, selectedChat.users) : selectedChat.chatName}</Text>
            {isTyping ? <Text>Typing...</Text> : null}
            {/* <Text>typing</Text> */}
          </View>

        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={toggleModal} activeOpacity={0.5} >
          <Entypo name="dots-three-vertical" size={20} color="#000" />
        </TouchableOpacity>
      ),
    });

  }, [selectedChat,isTyping])

  useEffect(() => {
    console.log('Notifications updated:', notification);
    console.log('Notifications updated selectedChat is:', selectedChat._id);
  }, [notification]);

  useEffect(() => {
    console.log('Notifications updated:', notification);
    console.log('Notifications updated selectedChat is:', selectedChat._id);
  }, [selectedChat]);

  const handleNewMessage = (newMessageRecieved) => {
    if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
      // Add a new notification only if it's not already there
      if (!notification.find((msg) => msg._id === newMessageRecieved._id)) {
        setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain);
      }
    } else {
      setMessages((prevMessages) => {
        // Check if the new message already exists in the current messages array
        if (!prevMessages.find((msg) => msg._id === newMessageRecieved._id)) {
          return [...prevMessages, newMessageRecieved];
        }
        return prevMessages;
      });
    }
  };
  


  useEffect(() => {
    socket.on("message recieved", handleNewMessage);

    // Clean up the event listener when the component unmounts or when the `messages` array changes
    // return () => {
    //   socket.off("message recieved", handleNewMessage);
    // };
  });

  const sendMessage = async () => {

    if (newMessage && newMessage.trim() !== "") {
      socket.emit('stop typing', selectedChat._id)
      setLoadingForSend(true)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
        };

        setNewMessage("");
        const { data } = await axios.post(`${URL}/message/`, {
          content: newMessage,
          chatId: selectedChat._id
        }
          , config);

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data])
        setLoadingForSend(false)
      } catch (error) {
        Alert.alert('unable to send message at the moment');
      }
    }
  };


  const typingHandler = (e) => {

    // tayping insicater logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }

    }, timerLength);
  };




  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ImageBackground
          source={require('../images/bg6.png')} // Replace with your actual background image path
          style={styles.background}
        >
          <View style={styles.container}>
            {
              loading ?
                <View style={[styles.chatContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Spinner size='large' />
                </View>
                : <View style={styles.chatContainer}>
                  <ScrollableChats messages={messages} isGroupChat={selectedChat.isGroupChat} />
                </View>
            }

            <View style={[styles.inputContainer, { alignItems: inputHeight <= 40 ? 'center' : 'flex-end' }]}>
              <TextInput
                style={[styles.input, { height: inputHeight <= 160 ? inputHeight : 160 }]}
                multiline={true}
                onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                value={newMessage}
                onChangeText={setNewMessage}
                onChange={typingHandler}
                placeholder="Write a message"
                placeholderTextColor={'#555'}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage} >
                {loadingForSend ? <Spinner size='small' /> : <Text style={styles.sendButtonText}>Send</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
      {selectedChat.isGroupChat ?
        <Modal
          isVisible={isModalVisible}
          style={styles.modal}
          onBackdropPress={toggleModal}  // Close when touching the overlay
          swipeDirection="down"          // Enable dragging down to close
          onSwipeComplete={toggleModal}  // Trigger the close function on swipe down
          useNativeDriverForBackdrop={true}  // Improves performance
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Group', { useFor: 'editGroup' })}>
              <Text style={styles.listItemText}>Edit Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Group', { useFor: 'detailGroup' })}>
              <Text style={styles.listItemText}>Group Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={handleRefresh}>
              <Text style={styles.listItemText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </Modal> : null
      }
    </>
  )
}

export default DisplayChatPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,  // This allows the chat area to take up the remaining space
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    color: '#000',
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 16,
    padding: 8,
    marginRight: 5,
    backgroundColor: '#f3f3f3',
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 60,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }, modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 18,
    color: '#000'
  },
})
