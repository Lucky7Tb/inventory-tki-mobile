import React, {Component} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userId');
    this.props.navigation.navigate(userToken ? 'Home' : 'Login');
  };

  render() {
    return (
      <View>
      </View>
    );
  }
}
