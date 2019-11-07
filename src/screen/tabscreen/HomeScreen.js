import React, {Component} from 'react';
import { View, Image, BackHandler } from 'react-native';
import { Header, Text, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this._signOutAsync = this._signOutAsync.bind(this);
    this.state = {
      backHandle: '',
      player_id: '',
      user_id: '',
    };
    OneSignal.addEventListener('ids', this.onIds);
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
    OneSignal.removeEventListener('ids', this.onIds);
    this.backHandler.remove();
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  onIds = async device => {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({
      user_id: user_id,
    });
    axios.request({
        method: 'POST',
        url: 'http://192.168.43.84:8000/api/v1/student',
        data: {
          student_id: user_id,
          player_id: device.userId,
        },
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      }).then(response => {
      
      })
      .catch(err => {
        Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve");
      });
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{height: 550}}>
          <Header
            placement="left"
            leftComponent={
              <Image
  			        source={require('../../assets/logo.png')}
  			        style={{width: 100, height: 100, marginBottom: 20}}
  			     />
            }
            rightComponent={
              <Icon
                name="sign-out"
                color="#fff"
                size={20}
                style={{marginBottom: 20}}
                onPress={this._signOutAsync}
              />
            }
          />
          <View style={{flex: 1, justifyContent: 'space-around', flexDirection: 'row'}}>

            <View style={{flex:1, justifyContent: 'space-around', flexDirection: 'row', marginTop: 100}}>

              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>
               
                <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>12</Text>

                <Text>Dipinjam</Text>

              </View>

              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

               <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>20</Text>

                <Text>Belum dikembalikan</Text>

              </View>

            </View>

          </View>

          <View style={{flex: 1, justifyContent: 'space-around', flexDirection: 'row'}}>
            <View style={{flex:1, justifyContent: 'space-around', flexDirection: 'row'}}>
              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

               <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>12</Text>

                <Text>Belum Diambil</Text>
                
              </View>
               <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

               <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>30</Text>

                <Text>Barang</Text>
                
              </View>
            </View>
          </View>

      </View>
    );
  }
}