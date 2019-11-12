import React, {Component} from 'react';
import {View ,Image} from 'react-native';
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
      <View style={{justifyContent: 'center',  alignItems: "center", flex:1}}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 250, height:250}}
        />
      </View>
    );
  }
}
