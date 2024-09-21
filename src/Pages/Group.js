import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NewGroup from '../components/Group/NewGroup'
import GroupEdit from '../components/Group/GroupEdit'
import GroupDetail from '../components/Group/GroupDetail'

const Group = ({route, navigation}) => {

    console.log(route);
    const { useFor } = route.params
    

    const displayFor = () => {
        if (useFor === 'newGroup') {
            return <NewGroup navigation={navigation} />
        } else if (useFor === 'editGroup') {
            return <GroupEdit navigation={navigation}/>
        } else {
            return <GroupDetail navigation={navigation}/>
        }
    }

  return (
    <View style={styles.container} >
      {
        displayFor()
      }
    </View>
  )
}

export default Group

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },


})