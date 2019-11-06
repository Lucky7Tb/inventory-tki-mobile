import React, {Component} from 'react';
import { Text, View, Image, BackHandler } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';

class ImageView extends Component {
  render() {
    return (
      <Image
        source={require('../../assets/logo.png')}
        style={{width: 100, height: 100, marginBottom: 20}}
      />
    );
  }
}

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this._signOutAsync = this._signOutAsync.bind(this);
    this.state = {
      backHandle: '',
    };
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{height: 550}}>
          <Header
            placement="left"
            leftComponent={<ImageView />}
            rightComponent={
              <Icon
                name="user"
                color="#fff"
                size={20}
                style={{marginBottom: 20}}
                onPress={this._signOutAsync}
              />
            }
          />
      </View>
    );
  }
}