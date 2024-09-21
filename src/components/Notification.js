import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { ScrollView } from 'tamagui'
import { ChatState } from '../context/ChatProvider'
import { getSender } from '../config/ChatLogic'

const Notification = ({ navigation }) => {

    const { notification, setNotification, setSelectedChat, user } = ChatState();

    const handleClick = (notif2) => {
        setSelectedChat(notif2.chat);
        navigation.navigate('Chat');
        setNotification(notification.filter((n) => n !== notif2));
    }

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: '500', margin: 10, color:'#000' }}> {notification.length} Notifications</Text>
            <ScrollView>
                {!notification.length && <Text style={{ fontSize: 20, margin: 10, color:'#000' }} >NO New Messages</Text>}
                {notification.map(notif => (
                    <TouchableOpacity key={notif._id} style={styles.listItem} onPress={() => handleClick(notif)}>
                        <Text style={styles.listItemText}>
                            {notif.chat.isGroupChat ? `new Message in ${notif.chat.chatName}`
                                : `new Message from ${getSender(user, notif.chat.users)}`}
                        </Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    listItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    listItemText: {
        fontSize: 18,
        color: '#000'
    },
})