import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'react-native-axios';

export default class ChangePasswordScreen extends Component {
	static navigationOptions = {
    	title: 'Ganti password',
  	};

  	constructor(props) {
  	  super(props);
  	  this.changePassword = this.changePassword.bind(this);
  	  this.state = {
		password: '',
		confirmpassword: '',
  	  };
  	}

  	changePassword = async () => {
  		let { password, confirmpassword } = this.state;
  		const user_id = await AsyncStorage.getItem('userId');
  		if(password !== confirmpassword){
  			Alert.alert("Kesalahan", "Password tidak sama!!")
  		}else{
  			axios.request({
  				method: 'POST',
  				url: 'http://192.168.0.4:8000/api/v1/studentchangepassword',
  				data: {
  					student_id : user_id,
  					student_password: password
  				}
  			}).then(response => {
  				Alert.alert("Berhasil", response.data.message);
  				this.props.navigation.goBack();
  			}).catch(error => {
    			Alert.alert("Terjadi kesalahan", "Telah terjadi kesalahan")
  			})
  		}
  	}

  render() {
    return (
      <View style={styles.container}>
     	<Input
          inputContainerStyle={styles.fieldcontainer}
          labelStyle={styles.label}
          label="Password baru"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})}
        />

        <Input
          inputContainerStyle={styles.fieldcontainer}
          labelStyle={styles.label}
          label="Konfirmasi password"
          secureTextEntry={true}
          onChangeText={confirmpassword => this.setState({confirmpassword})}
        />

        <View style={styles.buttonContainer}>
          <Button
            onPress={this.changePassword}
            title="Save"
            type="solid"
            raised={true}
            buttonStyle={styles.submitButton}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	fieldcontainer: {
    	borderStyle: 'solid',
	    borderWidth: 1,
	    borderRadius: 10,
	    borderColor: '#31AFB4',
	    backgroundColor: '#fff',
	    marginBottom: 20
  	},
   submitButton: {
	    borderRadius: 25,
	    width: 250,
      backgroundColor: '#31AFB4',
      borderColor: 'transparent',
      elevation: 0.50,
  },
});
