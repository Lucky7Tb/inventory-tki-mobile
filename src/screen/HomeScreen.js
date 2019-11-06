import React, {Component} from 'react';
import {View} from 'react-native';
import BottomNavigator from './BottomNavigation';

export default class HomeScreen extends Component {
    static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <BottomNavigator />
    );
  }
}
