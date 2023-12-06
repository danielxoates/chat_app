import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list';

const Register = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [selected, setSelected] = useState('');
    const [other, setOther] = useState('');
    const [read, setRead] = useState(true);
    const data = [
        {key:'1', value:'Cocaine'},
        {key:'2', value:'Ketamine'},
        {key:'3', value:'Cannabis'},
        {key:'4', value:'PCP',},
        {key:'5', value:'Self-harm'},
        {key:'6', value:'Porn'},
        {key:'7', value:'Other'},
    ]


    const register = async () => {
        if(username==''){
            Alert.alert('Username field can\'t be empty');
            return
        }
        if(password=='' || passwordCheck==''){
            Alert.alert('Passwords fields can\'t be empty');
            return
        }
        if(password!=passwordCheck){
            Alert.alert('Passwords must match');
            return
        }
        if(selected==''){
            Alert.alert('Addiction must be set');
            return
        }

        var details = {
            username: username,
            password: password,
            addiction: selected,
            type: 'register',
        };
        console.log(username);
        var formBody = [];
        for(var property in details){
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        try{
            await fetch (
                'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: formBody
                })
                    .then(response => {
                        response.text()
                            .then(text =>{
                                console.log(text)
                                text=text.replace("{","")
                                text=text.replace("}","")
                                text=text.replace("[","")
                                text=text.replace("]","")
                                text=text.replace(/'/g, "")
                                text=text.replace(/"/g, "")
                                text=text.split(":")
                                console.log(text[1])
                                if (text[1]=='Registered'){
                                    Alert.alert('Account created')
                                    navigation.navigate('Login');
                                }
                                else{
                                    Alert.alert('Username Taken')
                                }
                            }
                            );
                    })
        } 
        catch(err){
            console.log(err);
        }  
    }

    return (
        <ScrollView style={{flex: 1}}>
            <View style={styles.container}>
                <Input
                    placeholder='Enter a username'
                    label='Username'
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
                <Input
                    placeholder='Enter your password'
                    label='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <Input
                    placeholder='Re-enter your password'
                    label='Password Check'
                    value={passwordCheck}
                    onChangeText={text => setPasswordCheck(text)}
                    secureTextEntry
                />
                <SelectList
                    data={data}
                    setSelected={(val) =>setSelected(val)}
                    save="value"
                    maxHeight={100}
                />
                <Button title='Register' onPress={register} style={styles.button}/>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 100,
    },
    button: {
        flex: 1,
        marginTop: 10
    },
});

export default Register;