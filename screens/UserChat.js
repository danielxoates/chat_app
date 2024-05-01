import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Button, Image} from 'react-native-elements';
import homeImage from '../assets/home.png';
import ChatBubble from 'react-native-chat-bubble';
import {ScrollView} from 'react-native-gesture-handler';

const UserChat = ({navigation, route}) => {
  const {username} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [id, setId] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      var details = {
        file: '../chats/User_chats/',
        type: 'chatUser',
        user: username,
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');

      fetch('https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Make sure to return the parsed JSON here
        })
        .then(json => {
          console.log(json)
          setMessages(json.messages);
          setId(json.id);
          console.log(id)
          console.log(messages)
        })
        .catch(error => {
          console.error('Error during fetch:', error);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [newMessage]);
  const returnToHome = () => {
    navigation.navigate('Home Page', {
      username: username,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 20,
          }}
          onPress={returnToHome}>
          <Image source={homeImage} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const sendMessage = () => {
    var details = {
      file: '../chats/User_chats/',
      type: 'chatUser',
      message: newMessage,
      user: username,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch('https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    });
    console.log(messages);
    setNewMessage('');
  };

  const textBubblesJSX = messages.map((message, i) => {
    if (message.charAt(0) == id) {
      message = message.substring(1);
      return (
        <ChatBubble key={i} bubbleColor="#1084ff" isOwnMessage={true}>
          <Text>{message}</Text>
        </ChatBubble>
      );
    } else {
      message = message.substring(1);
      return (
        <ChatBubble key={i}>
          <Text>{message}</Text>
        </ChatBubble>
      );
    }
  });

  return (
    <>
      <ScrollView>{textBubblesJSX}</ScrollView>
      <Input
        placeholder="Enter a message"
        value={newMessage}
        onChangeText={text => setNewMessage(text)}
      />
      <Button title="Send" onPress={sendMessage} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 100,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
  },
});

export default UserChat;
