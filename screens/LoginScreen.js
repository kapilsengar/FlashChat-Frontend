import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState, useCallback,useContext } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import axios from 'axios'; // Import axios
import {AuthContext} from '../context/AuthContext';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {token, setToken} = useContext(AuthContext);
  const navigation = useNavigation();

  // Use `useFocusEffect` to run checkLoginStatus every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          
          if (token) {
            navigation.navigate('Main');
          }
        } catch (error) {
          console.log('Error retrieving token:', error);
        }
      };

      checkLoginStatus();
    }, [navigation]) // Add navigation as a dependency
  );

  const handleLogin = async () => {
    let user = {
      email,
      password,
    };
    console.log('User:', JSON.stringify(user)); // Log user data

    try {
      const response = await axios.post(
        'http://192.168.187.10:8000/login', // Update this IP for your emulator
        user,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Check if response has expected data
      if (response.data && response.data.token) {
        Alert.alert('Login Successful', 'You have logged in successfully.');

        const token = response.data.token;
        // Save token and email to AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('email', email);
        setToken(token)
        // Log the saved data for debugging
        console.log('Saved to AsyncStorage - Token:', token);
       

        // Navigate to Main screen
        navigation.navigate('Main');

        // Clear the fields after login
        setEmail('');
        setPassword('');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Login failed:', error.response || error.toJSON());
      Alert.alert(
        'Login Error',
        'An error occurred while logging in. Please check your credentials.'
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <View>
        <Image
          style={{ width: 150, height: 100, marginTop: 50 ,resizeMode:'contain'}}
          source={{
            uri: 'https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png',
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 12 }}>
          Login to your Account
        </Text>
      </View>

      <View>
        <View style={{ marginTop: 70 }}>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)} // Correct handler
            style={{
              backgroundColor: '#8395A7',
              padding: 8,
              color: 'black',
              marginVertical: 10,
              width: 300,
              borderRadius: 6,
              fontSize: 18,
            }}
            placeholder="Enter your E-mail"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)} // Correct handler
            secureTextEntry={true}
            style={{
              backgroundColor: '#8395A7',
              padding: 8,
              marginVertical: 10,
              width: 300,
              borderRadius: 6,
              fontSize: 16,
            }}
            placeholder="Enter your Password"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Text>Keep me Logged In</Text>
          <Text style={{ color: '#25CCF7' }}>Forgot password</Text>
        </View>
      </View>
      <View style={{ marginTop: 80 }}>
        <Pressable
          onPress={handleLogin}
          style={{
            backgroundColor: '#F3B431',
            width: 200,
            borderRadius: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: 15 }}
        >
          <Text style={{ fontSize: 15, color: 'grey', textAlign: 'center' }}>
            Don't have an Account? Sign Up
          </Text>
        </Pressable>
      </View>
      <View
            style={{
              marginTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 140, height: 170}}
              source={{
                uri: 'https://signal.org/assets/images/features/Media.png',
              }}
            />
          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});