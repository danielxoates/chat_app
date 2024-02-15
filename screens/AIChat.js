import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Image } from 'react-native-elements';
import homeImage from '../assets/home.png';
import ChatBubble from 'react-native-chat-bubble';


const AIChat =({navigation}) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        var details = {
            file: '../chats/chat.txt',
            type: 'chat',
        };
        var formBody = [];
        for(var property in details){
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch (
            'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: formBody
            })
                .then(response => {
                    response.text()
                    .then(text => {
                        setMessages(text)
                        console.log(text)
                    })
                })
    })

    

    const signOutNow = () => {
        navigation.navigate('Login');
    }

    const returnToHome = () =>{
        navigation.navigate('Home Page')
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 20}}
                    onPress={returnToHome}
                >
                    <Image source={homeImage} style={{ height: 20, width: 20}}/>
                </TouchableOpacity>
            )
        })

    }, [navigation]);

    /*const textBubblesJSX = messages.map(
        message => <ChatBubble>{message}</ChatBubble>)*/
    
    return (          
        <>
            <ChatBubble
                isOwnMessage={true}
                bubbleColor='#1084ff'
                tailColor='#1084ff'
                withTail={true}
                onPress={() => console.log("Bubble Pressed!")}
            >
                <Text>Your messa content</Text>
            </ChatBubble>
            <Input
                placeholder='Enter a message'
                value={newMessage}
                onChangeText={text => setNewMessage(text)}
            />
        </>
    );
}

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
    }
});

export default AIChat;