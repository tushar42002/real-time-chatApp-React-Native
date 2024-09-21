import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, XStack, YStack } from 'tamagui'

const SearchResultList = ({ user, handleFunction }) => {
    return (
        <TouchableOpacity
            onPress={handleFunction}
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
            </XStack>
        </TouchableOpacity>
    )
}

export default SearchResultList

const styles = StyleSheet.create({})