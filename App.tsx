import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StackNavigator from './navigation/StackNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext, AuthProvider } from './context/AuthContext'
import { SocketContextProvider } from './SocketContext'

export default function App() {
  return (
    
  <AuthProvider>
    <SocketContextProvider>

    <StackNavigator/>
    </SocketContextProvider>
  </AuthProvider>
   
  )
}

const styles = StyleSheet.create({})