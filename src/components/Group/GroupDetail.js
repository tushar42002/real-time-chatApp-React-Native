import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar } from 'tamagui';
import DefaultImage from '../../images/discussion.gif';
import UserList from '../subcomponents/UserList';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';

const GroupDetail = ({navigation}) => {

  const [loading, setLoading] = useState(false)



  const { user, selectedChat, setSelectedChat, URL, fetchAgain, setFetchAgain } = ChatState();

  useEffect(() => {
    // console.log(selectedChat.users.map((u) =>(u._id)))
  })

  
  const handleRemove = async (user1) => {

    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      Alert.alert("Only admins can remove someone!")
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${URL}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      // fetchMessages();
      setLoading(false);
      Alert.alert("User removed");
    } catch (error) {
      Alert.alert('Failed remove User')
      console.log(error);
      
      setLoading(false);
    }


  };


  return (
    <View style={styles.container} >
      <View style={styles.info}>
        <Avatar circular size="$10">
          <Avatar.Image
            accessibilityLabel="Nate Wienert"
            src={DefaultImage}
          />
          <Avatar.Fallback delayMs={600} backgroundColor="#777" />
        </Avatar>
        <Text style={styles.groupName} >{selectedChat.chatName}</Text>
        <Text style={styles.infoMember}>Members : {selectedChat.users.length} </Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView style={{}}>
          {selectedChat.users.map((u) => (
            
            <UserList key={u._id} user={u}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{ backgroundColor: '#f20505' }]} onPress={() => handleRemove(user)}>
          <Text style={styles.buttonText}>Leave Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GroupDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b8b6b6',
    justifyContent: 'space-between',
  },
  info: {
    alignItems: 'center',
    padding: 20,
    backgroundColor:"#fff",
    borderTopWidth:2,
    borderColor:'#b8b6b6',
  },
  groupName: {
    fontWeight: 'bold',
    fontSize: 20,
    color:'#000'
  },
  infoMember: {
    fontSize: 16,
    color:'#000'
  },
  scrollContainer: {
    backgroundColor:'#fff',
    marginVertical:5,
    flex:1
  },
  scroll: {
    // maxHeight:400
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 0.5,
    backgroundColor: '#333',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})