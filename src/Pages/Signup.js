import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Spinner } from 'tamagui';
import { ChatState } from '../context/ChatProvider';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [loding, setLoding] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const { URL } = ChatState();


  const selectImage = () => {
    setImageUri(null);
    const options = {
      mediaType: 'photo',
      maxWidth: 1080,
      maxHeight: 1080,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0]);
      }
    });
  };

  const postDetails = async () => {
    if (!imageUri || imageUri === undefined) {
      Alert.alert('Please select an image');
      return null;
    }

    const data = new FormData();
    data.append("file", {
      uri: imageUri.uri,
      type: imageUri.type || 'image/jpeg',
      name: imageUri.fileName || `upload_${Date.now()}.jpg`,
    });
    data.append("upload_preset", "first-chat-app");
    data.append("cloud_name", "tusharrao");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/tusharrao/image/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        const newPic = result.url.toString();
        // Return the new image URL to be used in submitHandler
        return newPic;
      } else {
        throw new Error(result.error.message);
      }
    } catch (err) {
      Alert.alert('Error while uploading the image', err.message);
      return null;
    } finally {
      setLoding(false);
    }
  };



  // handle submit fuction ========================
  const submitHandler = async () => {
    setLoding(true);
    if (!name || !email || !password || !cpassword) {
      Alert.alert("Please Fill all the Feilds");
      setLoding(false);
      return;
    }
    if (password !== cpassword) {
      Alert.alert("Password doesn't match");
      setLoding(false);
      return;
    }

    // Wait for the image upload to complete and get the new image URL
    const uploadedPicUrl = await postDetails();

    // Check if the image upload was successful
    if (!uploadedPicUrl) {
      Alert.alert("Image upload failed. signing up without image.");
    }


    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const userData = {name: name, email: email, password:password, pic: uploadedPicUrl}

      console.log( name, email, password, uploadedPicUrl );
      console.log(typeof(uploadedPicUrl))

      const { data } = await axios.post(`${URL}/user`,
        userData,
        config
      );

      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert('sign up succesfull');
      setLoding(false);
      navigation.replace('Home', { initialTab: 'Chat' });

    } catch (error) {
      Alert.alert('something went wrong try agin later');
      setLoding(false);
    }

    setLoding(false);

  };


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title1}>Welcome!</Text>
          <Text style={styles.title2}>Create New Account</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={selectImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri.uri }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>Select Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={cpassword}
                onChangeText={setCpassword}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={submitHandler} style={styles.button}>
              {loding ? <Spinner color='#fff' /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
            <Text style={styles.newAccText}>
              Already have an Account? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login Now.</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    margin: 20,
  },
  title1: {
    fontSize: 30,
    color: '#fff',
  },
  title2: {
    fontSize: 16,
    color: '#f7f7f7',
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  imagePlaceholderText: {
    color: '#999',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
});
