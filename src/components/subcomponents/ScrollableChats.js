import { View, Text, ScrollView, Keyboard, InteractionManager } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { getBorderRadius, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogic';
import { Avatar, XStack } from 'tamagui';

const ScrollableChats = ({ messages, isGroupChat }) => {

  const { user } = ChatState();


  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);


  // Scroll to bottom when keyboard is shown
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        InteractionManager.runAfterInteractions(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);



  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ paddingVertical: 0, flexGrow: 1, justifyContent: 'flex-end' }}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={{ paddingHorizontal: 8, paddingVertical: 5, backgroundColor: 'transparent' }}>
        {messages && messages.map((m, i) => (
          <View style={{ display: "flex" }} key={m._id} >
            <XStack
              padding={0}
              gap="$1"
              alignItems='flex-end'
            >

              {!isGroupChat ? null : (isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (

                  <Avatar circular size="$3">
                    <Avatar.Image
                      accessibilityLabel={m.sender.name}
                      src={m.sender.pic}
                    />
                    <Avatar.Fallback delayMs={600} backgroundColor="#777" />
                  </Avatar>

                )}
              <Text
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                  marginLeft: !isGroupChat ? getBorderRadius(user, m) ? 'auto' : 2 : isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: 20,
                  borderBottomLeftRadius: getBorderRadius(user, m) ? 30 : 0,
                  borderBottomRightRadius: getBorderRadius(user, m) ? 0 : 30,
                  borderTopRightRadius: getBorderRadius(user, m) ? 30 : 10,
                  borderTopLeftRadius: getBorderRadius(user, m) ? 10 : 30,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  maxWidth: "75%",
                  fontSize: 15,
                  color: '#000'
                }}
              >
                {m.content}
              </Text>
            </XStack>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default ScrollableChats;