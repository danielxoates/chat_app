import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { SelectList } from 'react-native-dropdown-select-list';

const Register = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [selected, setSelected] = useState("");
  
    const data = [
        {key:'1', value:'Cocaine'},
        {key:'2', value:'Ketamine'},
        {key:'3', value:'Cannabis'},
        {key:'4', value:'PCP',},
        {key:'5', value:'Self-harm'},
        {key:'6', value:'Porn'},
    ]

    const register = () => {
        navigation.navigate('Login');
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
                    style={styles.selectBox}
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
        alignItems: 'center',
        padding: 10,
        marginTop: 100,
    },
    button: {
        width: 370,
        marginTop: 10
    },
    selectBox: {
        width: 370,
    }
});

export default Register;