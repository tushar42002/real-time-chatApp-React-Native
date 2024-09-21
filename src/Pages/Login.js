import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'tamagui';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { URL,setUser,} = ChatState();

  const handleLogin = async () => {
    setLoading(true);

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const { data } = await axios.post(`${URL}/user/login`,
        { email, password, },
        config
      );

      await AsyncStorage.setItem('userInfo', JSON.stringify(data))
      console.log('userinfo stored in asyncstorage');
      setUser(data);
      
      navigation.replace('Home',{ initialTab: 'Chat' });

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title1} >Wellcome Back !</Text>
          <Text style={styles.title2} >Login to your account</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} >
              {loading ? <Spinner /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
            <Text style={styles.newAccText}>Doesn't have an Account? <Text style={styles.link} onPress={() => navigation.navigate('Signup')} >Create New Account.</Text></Text>
          </View>
        </View>
      </View>

      {/* <Text>Login</Text>  */}
      {/* <Spinner/> */}
    </View>

  )
}

export default Login;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'green',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    margin: 20,
  },
  title1: {
    fontSize: 30,
    color: '#fff'
  },
  title2: {
    fontSize: 16,
    color: '#f7f7f7'
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    paddingLeft: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#00BFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  newAccText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  link: {
    color: '#00BFFF',
    textDecorationLine: 'underline',
  },
})