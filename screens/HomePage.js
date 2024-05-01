import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {Avatar, Button, Image} from 'react-native-elements';
import speechBubble from '../assets/speechBubble.png';
import {Vibration} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const HomePage = ({navigation, route}) => {
  //const [timer, setTimer] = useState('');

  const {username} = route.params;

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
  };

  const signOutNow = () => {
    navigation.navigate('Login');
  };

  const resetTimer = async () => {
    Alert.alert(
      'Reset Timer',
      'Do you want to reset the timer?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
            // Add any necessary cleanup or return statements here
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log('OK Pressed');
            var details = {
              type: 'reset',
            };
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
            try {
              await fetch(
                'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type':
                      'application/x-www-form-urlencoded;charset=UTF-8',
                  },
                  body: formBody,
                },
              );
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const setTimer = async () => {
    var details = {
      type: 'set',
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    try {
      await fetch(
        'https://w21003534.nuwebspace.co.uk/final_project/php/Main.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        },
      ).then(response => {
        response.text().then(text => {
          text = text.replace('{', '');
          text = text.replace('}', '');
          text = text.replace('[', '');
          text = text.replace(']', '');
          text = text.replace(/'/g, '');
          text = text.replace(/"/g, '');
          text = text.split(':');
          var date = new Date();
          var now_utc = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
          );
          var timeDiff = now_utc / 1000 - text[1];
          setValues(timeDiff);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const setValues = seconds => {
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
  });

  useEffect(() => {
    console.log(JSON.stringify(username));
    const interval = setInterval(() => {
      setSecs(prevSeconds => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 20,
          }}
          onPress={signOutNow}>
          <Text>Logout</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 20,
          }}
          onPress={openChat}>
          <Image source={speechBubble} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{years} years</Text>
      <Text style={styles.timer}>{months} months</Text>
      <Text style={styles.timer}>{weeks} weeks</Text>
      <Text style={styles.timer}>{days} days</Text>
      <Text style={styles.timer}>{hrs} hours</Text>
      <Text style={styles.timer}>{mins} minutes</Text>
      <Text style={styles.timer}>{secs} seconds</Text>
      <Button
        title="Reset timer"
        onPress={resetTimer}
        buttonStyle={{ backgroundColor: 'transparent' }} // Set background color to transparent
        titleStyle={{ color: 'blue' }} // Set text color to blue
      />

      <Text style={styles.text}>Help</Text>
      <Button
        style={styles.buttonSmall}
        title="NHS Help"
        onPress={() =>
          Linking.openURL(
            'https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/',
          )
        }
      />
      <Button
        style={styles.buttonSmall}
        title="Talk to Frank"
        onPress={() => Linking.openURL('https://www.talktofrank.com/')}
      />
      <Button
        style={styles.buttonSmall}
        title="Narcotics Anonymous"
        onPress={() => Linking.openURL('https://ukna.org')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 70,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
  buttonSmall: {
    width: '50%',
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    marginTop: 25,
  },
  timer: {
    fontSize: 20,
  },
});

export default HomePage;
