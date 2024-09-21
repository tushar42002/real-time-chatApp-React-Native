import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { ChatState } from '../context/ChatProvider';
import { Spinner } from 'tamagui';

const Profile = ({ navigation }) => {
  const user1 = {
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
    coverPhoto: "https://www.bootdey.com/image/280x280/FF00FF/000000",
    name: "John Smith"
  };

  const { user, setUserToggle, userToggle,setUser } = ChatState();

  const logOut = async () => {
    await AsyncStorage.removeItem('userInfo')
    setUser(null)
    navigation.replace('Home')
    setUserToggle(!userToggle)
  }

  return (

    <View style={styles.container}>
      {user ?
        <View>
          <Image source={{ uri: user1.coverPhoto }} style={styles.coverPhoto} />
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.pic }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.name}>{user.email}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button color={'red'} title="Log Out" onPress={logOut} />
          </View>
        </View>
        : <Spinner size='large' />
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -75,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: 'white',
  },
  name: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
});

export default Profile