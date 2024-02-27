import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import homeImage from '../assets/home.png';


const UserChat =({navigation, route}) => {
    const {username} = route.params
    const [messages, setMessages] = useState([]);
    const signOutNow = () => {
        navigation.navigate('Login');
    }

    const returnToHome = () =>{
        navigation.navigate('Home Page', {
            username: username,
        })
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
    
    return ( 
        <Button>temp</Button>            
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
        marginTop: 10
    },
    bottomContainer: {
        flex: 1,
    }
});

export default UserChat;