import React, { useContext, useEffect } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import ChatScreen from '../screens/ChatScreen';

import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PeopleScreen from '../screens/PeopleScreen';
import {AuthContext} from '../context/AuthContext';
import RequestChatRoom from '../screens/RequestChatRoom';
import ChatRoom from '../screens/ChatRoom';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const {token, setToken} = useContext(AuthContext); // useContext is used here
  console.log('token value', token);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      console.log('token from context', token);
      if (token) {
        setToken(token); // Update the context with the fetched token
      }
    };

    fetchUser();
  }, []);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={ChatScreen}
          options={{
            tabBarStyle: {backgroundColor: 'white'},
            headerShown: false,
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused
                    ? {uri:'https://cdn-icons-png.flaticon.com/128/1946/1946436.png'}
                    : {uri: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png'}
                }
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Updates"
          component={ProfileScreen}
          
          options={{
            tabBarStyle: {backgroundColor: 'white'},
            headerShown: false,
            tabBarLabelStyle: {color: '#008E97'},
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused
                    ? {uri:'https://cdn-icons-png.flaticon.com/128/456/456212.png'}
                    : {uri: 'https://cdn-icons-png.flaticon.com/128/456/456283.png'}
                }
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const MainStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="People"
          component={PeopleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Request" component={RequestChatRoom} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
      </Stack.Navigator>
    );
  };

  

  return (
    <NavigationContainer>
     <MainStack/>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
