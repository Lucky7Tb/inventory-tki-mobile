import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './screen/LoginScreen';
import HomeScreen from './screen/HomeScreen';
import AuthCheck from './screen/AuthCheck';

const AppNavigator = createStackNavigator(
  {
    Auth: AuthCheck,
    Login: LoginScreen,
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Auth',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class Route extends Component {
  render() {
    return <AppContainer />;
  }
}
