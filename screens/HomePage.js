import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import speechBubble from '../assets/speechBubble.png';
import { Vibration } from 'react-native';
var RNFS = require('react-native-fs');
import { useFocusEffect } from '@react-navigation/native';



const HomePage = ({navigation}) => {
    //const [timer, setTimer] = useState('');
    const [secs, setSecs] = useState(0);
    const [mins, setMins] = useState(0);
    const [hrs, setHrs] = useState(0);
    const [days, setDays] = useState(0);
    const [weeks, setWeeks] = useState(0);
    const [months, setMonths] = useState(0);
    const [years, setYears] = useState(0);
    const [timeDiff, setTimeDiff] = useState(0);


    const openChat = () => {
        navigation.navigate('Chat');
    }

    const signOutNow = () => {
        navigation.navigate('Login');
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

    const resetTimer = () => {
        var path= RNFS.DocumentDirectoryPath + '/data.json';
        writeFile(path);
    };

    const setTimer = async () => {
        var path= RNFS.DocumentDirectoryPath + '/data.json';
        const response = await RNFS.readFile(path);
        
        var data = JSON.parse(response);
        var startTime = data.start;

        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds());
        
        var timeDiff = now_utc-startTime;
        var timeDiffSecs=timeDiff/1000;
        setTimeDiff(timeDiffSecs);
        setValues(timeDiffSecs);
        
    };

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