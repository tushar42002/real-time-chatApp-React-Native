import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Avatar, XStack, YStack } from 'tamagui';
import { getSender, getSenderEmail, getSenderImage } from '../../config/ChatLogic';
import DefaultImage from '../../images/discussion.gif';

const ChatsItem = ({ chats, setSelectedChat, navigation, loggedUser }) => {

    const handleSelect = (chat) => {
        setSelectedChat(chat);
        navigation.navigate('Chat');
    };

    if(!loggedUser){
        return null
    }

    return (
        <View>
            {!chats && chats.length == 0 ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text> connect with user to start chats </Text>
                </View>

                :
                <View>
                    {chats.map((chat) => (
                        <TouchableOpacity
                            onPress={() => handleSelect(chat)}
                            key={chat._id}
                            activeOpacity={0.6}
                        >
                            <XStack
                                padding="$3"
                                gap="$3"
                                alignItems='center'
                            >
                                <Avatar circular size="$5">
                                    <Avatar.Image
                                        accessibilityLabel="Nate Wienert"
                                        src={ chat.isGroupChat ? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' : getSenderImage(loggedUser, chat.users) }
                                    />
                                    <Avatar.Fallback delayMs={600} backgroundColor="#777" />
                                </Avatar>

                                <YStack>
                                    <Text style={{ color: '#000', fontSize: 18 }} >
                                        {!chat.isGroupChat && loggedUser ? getSender(loggedUser, chat.users) : chat.chatName}
                                    </Text>
                                    <Text style={{ color: 'gray' }} >
                                        {!chat.isGroupChat && loggedUser ? getSenderEmail(loggedUser, chat.users) : 'this is a group chat'}
                                    </Text>
                                </YStack>

                            </XStack>
                        </TouchableOpacity>
                    ))}
                </View>
            }
        </View>

    );
}

export default ChatsItem

const styles = StyleSheet.create({})