import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import speechBubble from '../assets/speechBubble.png';
import { Vibration } from 'react-native';
var RNFS = require('react-native-fs');
import { useFocusEffect } from '@react-navigation/native';



const HomePage = ({navigation, route}) => {
    //const [timer, setTimer] = useState('');

    const {username} = route.params

    const [secs, setSecs] = useState(0);
    const [mins, setMins] = useState(0);
    const [hrs, setHrs] = useState(0);
    const [days, setDays] = useState(0);
    const [weeks, setWeeks] = useState(0);
    const [months, setMonths] = useState(0);
    const [years, setYears] = useState(0);


    const openChat = () => {
        navigation.navigate('Chat', {
            username: username,
        });
    }

    const signOutNow = () => {
        navigation.navigate('Login');
    }


    const resetTimer = async () => {
        var details = {
            type: 'reset',
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
                'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: formBody
                })
            }
        catch(err){
            console.log(err);
        }  
    };

    const setTimer = async () => {
        var details = {
            type: 'set',
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
                'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php', {
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
                                var date = new Date();
                                var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                                date.getUTCDate(), date.getUTCHours(),
                                date.getUTCMinutes(), date.getUTCSeconds());
                                var timeDiff = (now_utc/1000)-text[1];
                                setValues(timeDiff);
                            }
                            );
                    })
        } 
        catch(err){
            console.log(err);
        }  
    }

    const setValues = (seconds) => {
        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30.44; // An approximation for a month
        const year = day * 365.25; // An approximation for a year (considering leap years)
    
        setYears(Math.floor(seconds / year));
        seconds %= year;
        setMonths(Math.floor(seconds / month));
        seconds %= month;
        setWeeks(Math.floor(seconds / week));
        seconds %= week;
        setDays(Math.floor(seconds / day));
        seconds %= day;
        setHrs(Math.floor(seconds / hour));
        seconds %= hour;
        setMins(Math.floor(seconds / minute));
        seconds %= minute;
        setSecs(seconds);
    };

    useFocusEffect(() => {
        setTimer();
      }
    );

    useEffect(() => {
        console.log(JSON.stringify(username))
        const interval = setInterval(() =>{
            setSecs(prevSeconds => prevSeconds+1);
        }, 1000);
        return() =>clearInterval(interval);
    }, []);

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
            
            <Text>{years} years</Text>
            <Text>{months} months</Text>
            <Text>{weeks} weeks</Text>
            <Text>{days} days</Text>
            <Text>{hrs} hours</Text>
            <Text>{mins} minutes</Text>
            <Text>{secs} seconds</Text>
            <Button title='Reset timer' style={styles.button} onPress={resetTimer}/>
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