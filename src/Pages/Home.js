import { View, Text, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Spinner } from 'tamagui';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyChats from '../components/MyChats';
import Profile from '../components/Profile';
import { ChatState } from '../context/ChatProvider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const Home = ({ navigation }) => {

    const Tab = createBottomTabNavigator();


    const { user, setUser, userToggle } = ChatState();


    useEffect(() => {
        // if (!loading) { // Only navigate when loading is complete
            if (user) {
                navigation.navigate('Chats');
            } else {
                navigation.goBack();
            }
        // }
    }, [ user,userToggle]);

    
    return (

        <Tab.Navigator>
            <Tab.Screen
                name="Chats"
                component={MyChats}
                options={{
                    headerTitleStyle:{
                        fontSize:30,
                    },
                    headerStyle: {
                        backgroundColor: '#fff',
                        height: 70,
                        borderBottomWidth:0.5,
                        borderColor:'#999'
                      },
                    tabBarIcon : ({color}) => {
                       return <AntDesign name={'message1'} color={color} size={20} />
                    }
                }}
            />
            <Tab.Screen name='Profile' component={Profile}
            options={{
                tabBarIcon : ({color}) => {
                   return <EvilIcons name={'user'} color={color} size={30} />
                }
            }} />
        </Tab.Navigator>
    )
}

export default Home;