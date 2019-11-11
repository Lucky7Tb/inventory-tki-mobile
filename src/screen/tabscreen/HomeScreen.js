import React, {Component} from 'react';
import { View, Image, BackHandler, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Header, Text, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this._signOutAsync = this._signOutAsync.bind(this);
    this.state = {
      backHandle: '',
      user_id: '',
      data: {
        borrowing: '',
        notreturn: '',
        nottaken: '',
        returned: '',
      },
      loading: true,
    };
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.getUserId();
    this.getUserData();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  };

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  getUserId  = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({
      user_id: user_id,
    });
  };

  getUserData = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    axios.request({
      method: "POST",
      url: "http://192.168.0.5:8000/api/v1/getstudentdata",
      data:{
        student_id : user_id
      }
    }).then(response => {
      this.setState({
        data: {
          borrowing: response.data.serve.borrowing,
          notreturn: response.data.serve.notreturn,
          nottaken: response.data.serve.nottaken,
          returned: response.data.serve.return,
        },
        loading: false
      })
    }).catch(error => {
      Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve")
    })
  };

  render() {
    const { navigation } = this.props;
    if(this.state.loading){
      return(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
    )}

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

                <Text>{this.state.data.borrowing}</Text>

                <Text>Dipinjam</Text>

              </View>

              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

                <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>{this.state.data.returned}</Text>

                <Text>Dikembalikan</Text>

              </View>

            </View>

          </View>

          <View style={{flex: 1, justifyContent: 'space-around', flexDirection: 'row'}}>
            <View style={{flex:1, justifyContent: 'space-around', flexDirection: 'row'}}>
              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

               <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>{this.state.data.nottaken}</Text>

                <Text>Belum Diambil</Text>

              </View>

              <View style={{width: 150, height: 100, justifyContent: "center",alignItems: "center"}}>

               <Avatar overlayContainerStyle={{backgroundColor: 'red'}} size="medium" rounded icon={{ name: 'archive', type:'font-awesome'}}  />

                <Text>{this.state.data.notreturn}</Text>

                <Text>Belum dikembalikan</Text>

              </View>
            
            </View>
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
   loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
})
