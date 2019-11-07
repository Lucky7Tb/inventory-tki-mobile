import React, {Component} from 'react';
import {Input, Button, Image} from 'react-native-elements';
import {StyleSheet, View, BackHandler, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'react-native-axios';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      Nis: '',
      Password: '',
      loading: false,
    };
  }

  Login = () => {
    this.setState({loading: true});
    axios
      .request({
        method: 'POST',
        url: 'http://192.168.43.84:8000/api/v1/auth',
        data: {
          Nis: this.state.Nis,
          Password: this.state.Password,
        },
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      })
      .then(async response => {
        if (response.data.serve != null) {
          try {
            await AsyncStorage.setItem(
              'userId',
              response.data.serve.student_id,
            );
            this.setState({loading: false});
            this.props.navigation.navigate('Home');
          } catch (e) {
            console.log(e);
          }
        } else {
          Alert.alert(
            'Nis atau password salah',
            'Harap cek kembali nis dan password',
          );
          this.setState({loading: false});
        }
        console.log(response.data.message);
        console.log(response.data.serve);
      })
      .catch(err => {
        console.log(err);
      });
  };

  state: {
    backHandle: '',
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
            label="Nis"
            labelStyle={styles.label}
            placeholder="e.g 171810518"
            onChangeText={Nis => this.setState({Nis})}
            leftIcon={<Icon name="user" size={20} color="#000" />}
          />
          <Input
            containerStyle={styles.passwordfieldcontainer}
            inputContainerStyle={styles.fieldcontainer}
            label="Password"
            labelStyle={styles.label}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={Password => this.setState({Password})}
            leftIcon={<Icon name="lock" size={20} color="#000" />}
          />

          <View style={styles.loginbuttoncontainer}>
            <Button
              buttonStyle={styles.loginbutton}
              onPress={this.Login.bind(this)}
              title="Login"
              loading={this.state.loading}
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
    borderRadius: 10,
    borderColor: '#039be5',
    backgroundColor: '#fff',
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
    borderRadius: 90,
    borderWidth: 1,
    width: 250,
    backgroundColor: '#039be5',
    borderColor: 'transparent',
  },
  loginbuttoncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
