/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {name as appName} from './app.json';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

//page imports
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ChatScreen from './screens/Chat';
import HomeScreen from './screens/HomePage';

const Stack = createStackNavigator();

AppRegistry.registerComponent(appName, () => App);

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='HomePage' component={HomeScreen} />
          <Stack.Screen name='Chat' component={ChatScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  };