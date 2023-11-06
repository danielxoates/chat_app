import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import homeImage from '../assets/home.png';

const Chat =({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const signOutNow = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login');
        }).catch((error) => {
            Alert('Error occured');
        });
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

        const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));

        return () => {
            unsubscribe();
        };

    }, [navigation]);
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "Hello dev",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, []);
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {_id, createdAt, text, user,} = messages[0]

        addDoc(collection(db, 'chats'), {_id, createdAt, text, user});
    }, []);

    
    return (
        
        <View>
            <Button title='AI Chat' onPress={openAI}/>
            <Text style={styles.text}>Opt-in to User Chat</Text>
            <Switch
                trackColor={{false: '#767577', true: '#4ed164'}}
                thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
            />
            <Button title='User Chat' onPress={openUser}/>
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
        fontSize: 18,
    }
});

export default Chat;