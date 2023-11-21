import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
var RNFS = require('react-native-fs');
const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const openRegisterScreen = () => {
        navigation.navigate('Register');
    }

    const writeFile = async (path) => {
        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
        const jsonData= {"start": now_utc};
        const jsonString = JSON.stringify(jsonData);
        await RNFS.writeFile(path, jsonString, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("file saved!");
        }); 
    };

    const instantLogin = () => {
        var path= RNFS.DocumentDirectoryPath + '/data.json';
        RNFS.exists(path)
            .then((exists) => {
                if(exists){
                    console.log("file exists");
                }
                else{
                    writeFile(path);
                }
            }
        )
        navigation.navigate('Home Page');
    }

    const signin = () => {
         navigation.navigate('HomePage')
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title='Sign in' style={styles.button} onPress={instantLogin}/>
            <Button title='Register' style={styles.button} onPress={openRegisterScreen}/>
        </View>
    )
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
    }
});

export default Login;