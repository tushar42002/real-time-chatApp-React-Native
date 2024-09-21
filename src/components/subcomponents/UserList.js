import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, XStack, YStack } from 'tamagui'
import Icon from 'react-native-vector-icons/Entypo';

const UserList = ({ user, handleFunction }) => {
    return (
        <TouchableOpacity
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
                        src={user.pic}
                    />
                    <Avatar.Fallback delayMs={600} backgroundColor="#777" />
                </Avatar>

                <YStack>
                    <Text style={{ color: '#000', fontSize: 18 }} >
                        {user.name}
                    </Text>
                    <Text style={{ color: '#333' }} >{user.email}</Text>
                </YStack>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.closeIcon}  onPress={handleFunction} >
                        <Icon name="circle-with-cross" size={20} color="#ff5252" />
                    </TouchableOpacity>
                </View>
            </XStack>
        </TouchableOpacity>
    )
}

export default UserList

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute',
        right: 20
    },
    closeIcon: {
        backgroundColor: 'transparent',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ff5252'
    }
})