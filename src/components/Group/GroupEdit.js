import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import SearchResultList from '../subcomponents/SearchResultList';
import { ChatState } from '../../context/ChatProvider';
import { Spinner } from 'tamagui';

const GroupEdit = ({navigation}) => {

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);


  const { user, selectedChat, setSelectedChat, URL, fetchAgain, setFetchAgain } = ChatState();

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      Alert.alert("User already added");
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      Alert.alert("Only admins can add someone!")
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
        `${URL}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setSearchResults(searchResults.filter(
        (searchUser) => !selectedChat.users.some(
          (chatUser) => chatUser._id === searchUser._id
        )))
      Alert.alert("User Added");
    } catch (error) {
      Alert.alert("Failed to Add the user")
      setLoading(false);
    }


  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.put(
        `${URL}/chat/rename`,
        {
          chatId: selectedChat._id, chatName: groupChatName
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
      Alert.alert('Name Changed');
    } catch (error) {
      Alert.alert('Failed tom Rename the Group');
      setRenameloading(false);
    }
    setGroupChatName("");

  };

  const handleSearch = async () => {
    if (!search) {
      Alert.alert("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${URL}/user?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);

    } catch (error) {
      Alert.alert("Failed to Load the Search Results");
      console.log(error);

      setLoading(false);
    }
  };
  return (

    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={'#555'}
          placeholder='New Name Here'
          onChangeText={setGroupChatName}
        />
        <TouchableOpacity
          style={styles.goButton}
          onPress={handleRename}
        >
          {renameloading ? <Spinner size='small' /> : <Text style={styles.goButtonText}>Update</Text>}
        </TouchableOpacity>

      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={'#555'}
          placeholder='Enter username or email'
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.goButton}
          onPress={handleSearch}
        >
          {loading ? <Spinner size='small' /> : <Text style={styles.goButtonText}>Go</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.scrollViewContainer}>
        <Text style={styles.heading}>Search Results</Text>
        <ScrollView>
          {loading ? <Spinner size='large' /> :
            searchResults?.map((user) => (
              <SearchResultList
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          }
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GroupEdit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#999'
  },



  scrollView: {
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  avatarWrapper: {
    marginHorizontal: 5,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    resizeMode: 'cover'
  },
  closeIcon: {
    position: 'absolute',
    top: -0,
    right: -0,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff5252'
  },
  nameText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },


  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: '#333',
  },
  goButton: {
    backgroundColor: '#333',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
  },
  button: {
    flex: 1,
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