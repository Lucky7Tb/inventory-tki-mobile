import React, {Component} from 'react';
import {Input, Button, Image} from 'react-native-elements';
import {StyleSheet, View, BackHandler, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import axios from 'react-native-axios';
export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.Login = this.Login.bind(this);
    this.state = {
      Nis: '',
      Password: '',
      loading: false,
      disabled: false,
      player_id: '',
      user_id: '',
      backHandle: '',
    };
  }

  Login = () => {
    this.setState({loading: true, disabled: true});
    axios
      .request({
        method: 'POST',
        url: 'http://192.168.0.4:8000/api/v1/auth',
        data: {
          Nis: this.state.Nis,
          Password: this.state.Password,
        },
      })
      .then(async response => {
        if (response.data.serve != null) {
          try {
            await AsyncStorage.setItem(
              'userId',
              response.data.serve.student_id,
            );
            this.setState({loading: false, disabled: false});
            OneSignal.addEventListener('ids', this.onIds);
            this.props.navigation.navigate('Home');
          } catch (e) {
            console.log(e);
          }
        } else {
          Alert.alert(
            'Nis atau password salah',
            'Harap cek kembali nis dan password',
          );
          this.setState({loading: false, disabled: false});
        }
      })
      .catch(err => {
        this.setState({loading: false, disabled: false});
        Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve");
      });
  };

  onIds = async device => {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({
      user_id: user_id,
    });
    axios.request({
        method: 'POST',
        url: 'http://192.168.0.4:8000/api/v1/student',
        data: {
          student_id: user_id,
          player_id: device.userId,
        },
      }).then(response => {

      })
      .catch(err => {
        Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve");
        console.log(err)
      });
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form2}>
          <Image
            source={require('../assets/logo.png')}
            style={{width: 200, height: 200}}
          />
        </View>
        <View style={styles.form}>
          <Input
            containerStyle={styles.nisfieldcontainer}
            inputContainerStyle={styles.fieldcontainer}
            leftIconContainerStyle={styles.iconcontainer}
            label="Nis"
            labelStyle={styles.label}
            placeholder="e.g 171810518"
            onChangeText={Nis => this.setState({Nis})}
            leftIcon={<Icon name="user" size={20} color="#31AFB4" />}
          />
          <Input
            containerStyle={styles.passwordfieldcontainer}
            inputContainerStyle={styles.fieldcontainer}
            leftIconContainerStyle={styles.iconcontainer}
            label="Password"
            labelStyle={styles.label}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={Password => this.setState({Password})}
            leftIcon={<Icon name="lock" size={20} color="#31AFB4" />}
          />

          <View style={styles.loginbuttoncontainer}>
            <Button
              buttonStyle={styles.loginbutton}
              titleStyle={{fontWeight: 'bold', fontSize:15}}
              onPress={this.Login}
              title="LOGIN"
              loading={this.state.loading}
              disabled={this.state.disabled}
              raised={true}
              type="solid"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    paddingBottom: 10,
  },
  nisfieldcontainer: {
    paddingBottom: 20,
  },
  passwordfieldcontainer: {
    paddingBottom: 50,
  },
  fieldcontainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#31AFB4',
    backgroundColor: '#fff',
  },
  iconcontainer:{
    marginRight: 10
  },
  form: {
    flex: 1,
    flexDirection: 'column',
  },
  form2: {
    flex: 0.66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginbutton: {
    borderRadius: 25,
    width: 250,
    backgroundColor: '#31AFB4',
    borderColor: 'transparent',
    elevation: 0.50
  },
  loginbuttoncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
