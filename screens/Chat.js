import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert} from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import homeImage from '../assets/home.png';

const Chat =({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [clickable, setClickable] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const signOutNow = () => {
        navigation.navigate('Login');
    }

    const returnToHome = () =>{
        navigation.navigate('Home Page')
    }

    const openAI = () =>{
        navigation.navigate('AI Chat')
    }

    const openUser = () =>{
        navigation.navigate('User Chat')
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{
                    marginLeft: 20
                }}
                onPress={signOutNow}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
            ),
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
        
        <View>
            <Button title='AI Chat' onPress={openAI}/>
            <View style={styles.optionContainer}>
                <Text style={styles.text}>Opt-in to User Chat</Text>
                <Switch
                    trackColor={{false: '#767577', true: '#4ed164'}}
                    thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={styles.switch}
                />
            </View>
            <Button title='User Chat' onPress={openUser} disabled={!isEnabled}/>
        </View>
       
            
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
    switch: {
        marginLeft: "auto",
        marginRight: 20,
    },
    text: {
        marginTop: 5,
        fontSize: 18,
    },
    optionContainer: {
        flexDirection: 'row',
    }
});

export default Chat;