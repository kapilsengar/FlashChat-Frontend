import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {useSocketContext} from '../SocketContext';

const ChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const {token, userId} = useContext(AuthContext);
  const {socket} = useSocketContext();
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Pressable onPress={navigation.goBack}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/507/507257.png',
              }}
              style={{width: 20, height: 20}}
            />
          </Pressable>
          <View>
            <Text>{route?.params?.name} </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, route?.params?.name]);

  /** Listen for incoming messages */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = newMessage => {
      newMessage.shouldShake = true;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  /** Fetch messages when component loads */
  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get('http://192.168.187.10:8000/messages', {
        params: {senderId, receiverId},
      });

      setMessages(response.data);
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (userId && route?.params?.receiverId) {
      fetchMessages();
    }
  }, [userId, route?.params?.receiverId]);

  /** Send a message */
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;

      await axios.post('http://192.168.187.10:8000/sendMessage', {
        senderId,
        receiverId,
        message,
      });

      socket.emit('sendMessage', {senderId, receiverId, message});

      setMessage('');

      // Fetch messages to update UI
      setTimeout(() => {
        fetchMessages();
      }, 100);
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  /** Format time */
  const formatTime = time => {
    if (!time) return '';
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        {messages.map((item, index) => (
          <Pressable
            key={index}
            style={[
              item?.senderId?._id === userId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}>
            <Text style={{fontSize: 13, textAlign: 'left'}}>
              {item?.message}{' '}
            </Text>
            <Text style={styles.timestamp}>{formatTime(item?.timeStamp)} </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Message Input Section */}
      <View style={styles.inputContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/158/158420.png',
          }}
          style={{width: 22, height: 22}}
        />

        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.inputField}
        />

        <View style={styles.iconContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/685/685655.png',
            }}
            style={{width: 22, height: 22}}
          />
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/709/709950.png',
            }}
            style={{width: 22, height: 22}}
          />
        </View>

        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: '60%',
  },
  timestamp: {
    textAlign: 'right',
    fontSize: 9,
    color: 'gray',
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    marginBottom: 20,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#0066b2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
