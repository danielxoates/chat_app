import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert} from 'react-native';
import { Button, Image } from 'react-native-elements';
import homeImage from '../assets/home.png';
import RNFS from 'react-native-fs';

const Chat =({navigation, route}) => {
    const {username} = route.params
    const path = RNFS.DocumentDirectoryPath + '/'+ username + 'state.txt'
    const [isEnabled, setIsEnabled] = useState(false)
    const toggleSwitch = () => setIsEnabled(previousState => !previousState)
    const signOutNow = () => {
        navigation.navigate('Login')
    }

    useEffect(() => {
        var details = {
            type: 'checkState',
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
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json)
            if(json.switch_state==0){
                if(json.alert==1){
                    Alert.alert(
                        'User disconnected',
                        'The user has decided to end the conversation. Start a new chat by toggling the switch again',
                        [
                            {
                                text: 'OK', // Button text
                            }
                        ],
                    )
                }
            }
            else{
                setIsEnabled(true);
            }
        })
    }, []);

    const setUser= () => {

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
              return response.text()
            })
            .then(text => {
                console.log(text)
                if(text=='error'){
                    setIsEnabled(false)
                    Alert.alert(
                        'No users available',
                        'There are currently no users available, please try again later',
                        [{text: 'OK'}]
                    )
                }
            })
            .catch(error => {
              console.error('Error during fetch:', error);
            });
    }
    
    const switchPressed = () => {
        if(isEnabled==true){
            var details = {
                type: 'disconnect',
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
        }
        else{
            setUser()
        }
};


    const returnToHome = () =>{
        navigation.navigate('Home Page', {
            username: username,
        })
    }

    const openAI = () =>{
        navigation.navigate('AI Chat', {
            username: username,
        })
    }

    const openUser = () =>{
        navigation.navigate('User Chat', {
            username: username,
        })
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
        <View style={styles.container}>
            <Button title='AI Chat' onPress={openAI} style={styles.button} />
            <View style={styles.optionContainer}>
                <Text style={styles.text}>Opt-in to User Chat</Text>
                <Switch
                    trackColor={{false: '#767577', true: '#4ed164'}}
                    thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={styles.switch}
                    onChange={switchPressed}
                />
            </View>
            <Button title='User Chat' onPress={openUser} disabled={!isEnabled} style={styles.button} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Background color
        padding: 20,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        marginRight: 10,
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Adjust switch size
    },
    button: {
        marginVertical: 10,
        height: 50, // Increase button height
        width: '80%',
    },
});

export default Chat;