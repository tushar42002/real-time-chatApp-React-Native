import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import SearchResultList from './subcomponents/SearchResultList';
import axios from 'axios';
import { Spinner } from 'tamagui';

const Search = ({navigation}) => {

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setSelectedChat, chats, setChats, URL } = ChatState();

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
            setLoading(false);
            setSearchResults(data);

        } catch (error) {
            Alert.alert("Failed to Load the Search Results");
            setLoading(false);
        }

    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${URL}/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            navigation.navigate('Chats')
        } catch (error) {
            Alert.alert(`some error occuerd => ${error}`);
            setLoadingChat(false)
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholderTextColor={'#555'} placeholder='enter user name or email' onChangeText={setSearch} />
                <TouchableOpacity style={styles.goButton} onPress={handleSearch} >
                    {loading ? <Spinner size='small' /> : <Text style={styles.goButtonText}>Go</Text>}
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={styles.heading}>Search Results</Text>
                <ScrollView>
                    {loading ? <Spinner size='large' /> :
                        searchResults?.map((user) => (
                            <SearchResultList
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    input: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        color: '#000'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color:'#333'
    },
    goButton: {
        backgroundColor: '#333',
        margin: 10,
        padding: 10,
        borderRadius: 10
    },
    goButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})