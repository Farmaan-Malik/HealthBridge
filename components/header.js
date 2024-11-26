import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import Themes from '@/assets/colors/colors'

const Header = ({doctor,onPress,height = "5%" ,width = "20%"}) => {
  return (
    <View style={{height: height ?? '5%', width:width ?? "20%",display:'flex',justifyContent:'center',alignSelf:'flex-end',borderRadius:50,marginTop:25,marginEnd:10}}>
    <View style={{height:'100%', width:"100%", alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'row',gap:5}}>
    <Text style={{fontWeight:'500'}}>Logout</Text>
<Ionicons onPress={onPress}  color={doctor ? Themes.doctorTheme.primaryColor : Themes.patientTheme.primaryColor} size={30} name='log-out'/>
      </View>
    </View>
  )
}

export default Header