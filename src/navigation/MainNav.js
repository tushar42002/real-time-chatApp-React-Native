import { View, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Pages/Home';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import DisplayChatPage from '../Pages/DisplayChatPage';
import Search from '../components/Search';
import Group from '../Pages/Group';
import { ChatState } from '../context/ChatProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from '../components/Notification';

const MainNav = () => {

  const { user, setUser, userToggle } = ChatState();
  const [loading, setLoading] = useState(true); // New loading state

  const stack = createStackNavigator();

  const getData = async () => {
    console.log(user);

    try {
      setLoading(true); // Set loading to true before data is fetched
      const value = await AsyncStorage.getItem('userInfo');
      console.log('User detail from AsyncStorage:', JSON.parse(value).email);
      if (value) {
        setUser(JSON.parse(value));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoading(false); // Set loading to false after data is fetched
      }, 2000);
    }
  };

  useEffect(() => {
    getData();
  }, [userToggle]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#001f36' }}>
        <Image
        source={require('../images/Welcome.gif')} // Replace with your actual background image path
        style={{flex:1, resizeMode:'contain', width:'100%'}}
        />
      </View>
    );

  }



  return (

    <stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
      <stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      <stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
      <stack.Screen name='Search' component={Search} options={{ headerTitle: 'Create Chat With New user' }} />
      <stack.Screen name='Group' component={Group} />
      <stack.Screen name='Notification' component={Notification} />
      <stack.Screen name='Chat' component={DisplayChatPage}
        options={{
          headerStyle: {
            backgroundColor: '#fff',
            height: 60,
            borderBottomWidth:1,
            borderColor:'#999'
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            color:'#000'
          },
        }} />
    </stack.Navigator>

  )
}

export default MainNav