import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'tamagui';
import { ChatState } from '../context/ChatProvider';
import ChatsItem from './subcomponents/ChatsItem';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

const MyChats = ({ navigation }) => {

  const { user, setSelectedChat, selectedChat, chats, setChats, setFetchAgain, fetchAgain, URL, notification } = ChatState();

  const [loading, setLoading] = useState(false); // New loading state

  const [isModalVisible, setModalVisible] = useState(false);


  const fetchChats = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${URL}/chat`, config);

      setChats(data)


    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRefresh = () => {
    // Handle refresh here
    console.log('Refresh');
    setFetchAgain(!fetchAgain);
    toggleModal();
  };


  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [fetchAgain, user]);



  useEffect(() => {
    if (user) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{paddingHorizontal:10, flexDirection:'row',columnGap:20}} >
            <TouchableOpacity onPress={() => navigation.navigate('Notification')} activeOpacity={0.5} >
            <Feather name="bell" size={20} color="#000" />
            {notification.length > 0 ?
            <Text style={{backgroundColor:'red', position:'absolute', fontSize:10, top:-5, right:-3, borderRadius:50, paddingHorizontal:2, color:'#fff',}}>{notification.length > 99 ? '99': notification.length} </Text>
            : null
      }
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} activeOpacity={0.5} >
            <Entypo name="dots-three-vertical" size={20} color="#000" />
          </TouchableOpacity>
          </View>
          
        ),
      });
    }
  }, [notification]);





  const delyDisplayText = () => {
    setTimeout(() => {
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#777', fontSize: 30, textAlign: 'center' }} >Start chat with user to show Chats here Thankyou.</Text>
      </View>
    }, 1000)
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size='large' />
      </View> :
        chats.length == 0 ?
          delyDisplayText()
          :
          <ScrollView>
            <ChatsItem chats={chats} setSelectedChat={setSelectedChat} navigation={navigation} loggedUser={user} />
          </ScrollView>
      }

      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        onBackdropPress={toggleModal}  // Close when touching the overlay
        swipeDirection="down"          // Enable dragging down to close
        onSwipeComplete={toggleModal}  // Trigger the close function on swipe down
        useNativeDriverForBackdrop={true}  // Improves performance
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Group', {useFor:'newGroup'})}>
            <Text style={styles.listItemText}>Create New Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.listItemText}>Add New Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={handleRefresh}>
            <Text style={styles.listItemText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({

  modal: {
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
    color:'#000'
  },
})

export default MyChats