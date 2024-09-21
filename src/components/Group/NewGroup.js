import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'tamagui'
import SearchResultList from '../subcomponents/SearchResultList'
import { ChatState } from '../../context/ChatProvider'
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios'

const NewGroup = ({ navigation }) => {

    const [search, setSearch] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, URL, chats, setChats } = ChatState();



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
            console.log(error);

            setLoading(false);
        }
    };

    const handleSubmit = async () => {

        if (!groupName || !selectedUsers) {
            Alert.alert("Please fill all the feilds");
            return;
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post(`${URL}/chat/group`, {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);
            Alert.alert("New Group Chat Created!");
            navigation.goBack();

        } catch (error) {
            Alert.alert("Failed to Create the Group Chat");
        }

    };
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id));
    };

    const handleGroup = (userToAdd) => {
        console.log(userToAdd);
        console.log('selected user', selectedUsers);

        if (selectedUsers.includes(userToAdd)) {
            Alert.alert("User already added");
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
        console.log(selectedUsers);

    };


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={'#555'}
                    placeholder='Group Name Here'
                    onChangeText={setGroupName}
                />

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
            <View>
                <ScrollView horizontal={true} style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                    <View style={styles.avatarContainer}>
                        {
                            !selectedUsers ? <Text style={{ color: '#333', marginHorizontal: 50 }} >add users to group </Text> :
                                selectedUsers.map((user, index) => (
                                    <View key={index} style={styles.avatarWrapper}>
                                        <Image source={{ uri: user.pic }} style={styles.avatar} />
                                        <TouchableOpacity style={styles.closeIcon} onPress={() => handleDelete(user)} >
                                            <Icon name="circle-with-cross" size={20} color="#ff5252" />
                                        </TouchableOpacity>
                                        <Text style={styles.nameText}>{user.name}</Text>
                                    </View>
                                ))
                        }

                    </View>
                </ScrollView>
            </View>
            <View style={styles.scrollViewContainer}>
                <Text style={styles.heading}>Search Results</Text>
                <ScrollView>
                    {loading ? <Spinner size='large' /> :
                        searchResults?.map((user) => (
                            <SearchResultList
                                key={user._id}
                                user={user}
                                handleFunction={() => handleGroup(user)}
                            />
                        ))
                    }
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor:'green'}]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NewGroup

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
