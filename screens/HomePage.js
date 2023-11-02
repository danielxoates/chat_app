import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import speechBubble from '../assets/speechBubble.png';

const HomePage = ({navigation}) => {
    //const [timer, setTimer] = useState('');
    const [secs, setSecs] = useState(0);
    const [mins, setMins] = useState(0);
    const [hrs, setHrs] = useState(0);
    const [days, setDays] = useState(0);
    const [months, setMonths] = useState(0);
    const [years, setYears] = useState(0);

    const openChat = () => {
        navigation.navigate('Chat');
    }

    const signOutNow = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login');
        }).catch((error) => {
            Alert('Error occured');
        });
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
                    onPress={openChat}
                >
                    <Image source={speechBubble} style={{ height: 20, width: 20}}/>
                </TouchableOpacity>
            )
        })
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>{years}:{months}:{days}:{hrs}:{mins}:{secs}</Text>
            <Button title='Reset timer' style={styles.button} />
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
    },
    bottomContainer: {
        flex: 1,
    }
});

export default HomePage;