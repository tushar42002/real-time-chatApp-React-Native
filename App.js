import React from 'react'
import { createTamagui, TamaguiProvider } from 'tamagui'
import { config } from '@tamagui/config'
import { NavigationContainer } from '@react-navigation/native'
import MainNav from './src/navigation/MainNav'
import ChatProvider from './src/context/ChatProvider'


const App = () => {

  const tamaguiConfig = createTamagui(config);

  return (
      <TamaguiProvider config={tamaguiConfig}>
        <NavigationContainer>
          <ChatProvider>
            <MainNav />
          </ChatProvider>
        </NavigationContainer>
      </TamaguiProvider>
  );
  
}

export default App;