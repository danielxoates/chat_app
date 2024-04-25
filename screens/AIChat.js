import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Button, Image} from 'react-native-elements';
import homeImage from '../assets/home.png';
import ChatBubble from 'react-native-chat-bubble';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';

const AIChat = ({navigation, route}) => {
  const {username} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      var details = {
        file: '../chats/AI_chats/' + JSON.stringify(username) + '_AI.txt',
        type: 'chatAI',
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
      }).then(response => {
        response.json().then(json => {
          setMessages(json);
          console.log(json);
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [newMessage]);

  const signOutNow = () => {
    navigation.navigate('Login');
  };

  const returnToHome = () => {
    navigation.navigate('Home Page', {
      username: username,
    });
  };
  const sendMessage = async() => {
      aiResponse = '';
      try {
        const instance = axios.create({
          baseURL: 'https://api.openai.com/v1/chat/completions',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          }
        });
        // Make a request to OpenAI API
        console.log(newMessage);
        try {
          const response = await instance.post('', {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: newMessage }
            ],
            max_tokens: 500,
          });
          console.log("\n\nRESPONSE HERE\n\n");
          aiResponse = response.data.choices[0].message.content;
          console.log(aiResponse);
        } catch (error) {
          console.error('Axios Error:', error);
        }
    
        // Extract the AI response from the Axios respons
        var details = {
          file: '../chats/AI_chats/' + JSON.stringify(username) + '_AI.txt',
          type: 'chatAI',
          message: newMessage,
          id: 1,
        };
    
        // Prepare form data for sending to server
        var formBody = Object.keys(details)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
          .join('&');
    
        // Make a POST request to your server
        const serverResponse = await fetch('https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        });
    
        // Check if the server response is successful
        if (serverResponse.ok) {
          console.log('Message sent successfully');
        } else {
          console.error('Error sending message to server:', serverResponse.status);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    
      // Update the message object to include both the user message and AI response
      var details = {
        file: '../chats/AI_chats/' + JSON.stringify(username) + '_AI.txt',
        type: 'chatAI',
        message: aiResponse,
      };
    
      // Prepare form data for sending to server
      var formBody = Object.keys(details)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
        .join('&');
    
      // Make a POST request to your server
      const serverResponse = await fetch('https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      });
    
      // Check if the server response is successful
      if (serverResponse.ok) {
        console.log('Message sent successfully');
      } else {
        console.error('Error sending message to server:', serverResponse.status);
      }
      setNewMessage('');
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

  const textBubblesJSX = messages.map((message, i) => {
    if (message.charAt(0) == '1') {
      message = message.substring(1);
      return (
        <ChatBubble key={i} bubbleColor="#1084ff" isOwnMessage={true}>
          <Text>{message}</Text>
        </ChatBubble>
      );
    } else {
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
    marginTop: 100,
  },
  bottomContainer: {
    flex: 1,
  },
});

export default AIChat;
