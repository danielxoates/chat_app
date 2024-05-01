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

        if(RNFS.exists(path)){
                setSwitch();
        }
        else{
            RNFS.writeFile(path, 'f', 'utf8')  
            .then((success) => {
                console.log('FILE WRITTEN!');
              })
              .catch((err) => {
                console.log(err.message);
            });
            setSwitch();
        }
    }, []);

    const setSwitch = () => {
        RNFS.exists(path)
        .then(exists => {
          if (exists) {
            // File exists, read its contents
            return RNFS.readFile(path, 'utf8')
          } else {
            // File does not exist, handle appropriately
            throw new Error('File not found')
          }
        })
        .then(contents => {
          console.log('File contents:', contents)
          if(contents == '' || contents=='f'){
            RNFS.writeFile(path, 'f', 'utf8')  
            .then((success) => {
                console.log('FILE WRITTEN!');
              })
              .catch((err) => {
                console.log(err.message);
            });
          }
          else{
            setIsEnabled(true);
          }
        })
        .catch(error => console.error('Error:', error));
    }
    
    const switchPressed = () => {
    RNFS.exists(path)
    .then(async exists => {
        if (exists) {
            // File exists, read its contents
            return RNFS.readFile(path, 'utf8')
        } else {
            // File does not exist, create it and write 'f' to it
            await RNFS.writeFile(path, 'f', 'utf8');
            return 'f'; // Resolve with 'f' after writing
        }
    })
    .then(contents => {
        console.log('File contents:', contents);
        if (contents === 'f') {
            setIsEnabled(true);
            return RNFS.writeFile(path, 't', 'utf8');
        } else {
            setIsEnabled(false);
            return RNFS.writeFile(path, 'f', 'utf8');
        }
    })
    .then(() => {
        console.log('File updated successfully');
    })
    .catch(error => console.error('Error:', error));
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
                    onChange={ switchPressed }
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