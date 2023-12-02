import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'
import { Input, Button } from 'react-native-elements';
var RNFS = require('react-native-fs');
const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
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

    const signin = async () => {
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
        var details = {
            username: username,
            password: password
        };
        var formBody = [];
        for(var property in details){
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        try{
            await fetch (
                'https://w21003534.nuwebspace.co.uk/final_project/php/Login.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: formBody
                })
                    .then(response => {
                        response.text()
                            .then(text =>{
                                text=text.replace("{","")
                                text=text.replace("}","")
                                text=text.replace("[","")
                                text=text.replace("]","")
                                text=text.replace(/'/g, "")
                                text=text.replace(/"/g, "")
                                text=text.split(":")
                                console.log(text[1])
                                if(text[1]=="logged in"){
                                    navigation.navigate('Home Page')
                                }
                                else{
                                    Alert.alert("Username or password incorrect")
                                }
                            });
                    })
        } 
        catch(err){
            console.log(err);
            Alert.alert("Error occured please try again");
        }
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title='Sign in' style={styles.button} onPress={signin}/>
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