import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import {auth} from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name,
                    photoURL: avatar ? avatar : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
                })
                .then(() => {
                    alert('Registered, please login');
                })
                .catch((error) => {
                    alert(error.message);
                })
            })
            .catch((error) => {
                const errorCode =error.code;
                const errorMessage=error.message;
                alert(errorMessage);
            });
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter a username'
                label='Username'
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <Input
                placeholder='Enter your email'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
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
            <Button title='Register' onPress={register} style={styles.button}/>
        </View>
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
    }
});

export default Register;