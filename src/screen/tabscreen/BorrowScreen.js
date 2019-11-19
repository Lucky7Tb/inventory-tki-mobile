import React, {Component} from 'react';
import { StyleSheet, Modal, View, Alert, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Button, Input, Header, Card, Text, SearchBar, Overlay } from 'react-native-elements';
import {createFilter} from 'react-native-search-filter';
import Loading from 'react-native-whc-loading'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';

export default class BorrowScreen extends Component {
  constructor(props) {
    super(props);
    this._signOutAsync = this._signOutAsync.bind(this);
    this.logout = this.logout.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.showSettingsMenu = this.showSettingsMenu.bind(this);
    this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.borrowItem = this.borrowItem.bind(this);
    this.state = {
      item: [],
      user_id: '',
      item_id: '',
      item_name: '',
      item_ammount: '',
      keyword: '',
      refreshloader: false,
      modal_visible: false,
      loading: true,
      overlay: false
    };
  };

  componentDidMount() {
    this.getItem();
    this.getUserId();
  };

   _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.setState({overlay: false});
    this.props.navigation.navigate("Login");
  };

  changePassword = () => {
    this.setState({overlay: false});
    this.props.navigation.navigate('ChangePassword');
  };

  logout = () => {
  	Alert.alert(
  		"Konfirmasi", 
  		"Anda yakin ingin keluar",
  		[
		    { text: 'Cancel' },
		    { text: 'Ok', onPress: this._signOutAsync },
	  	],
  	)
  };

  showSettingsMenu = () => {
   	this.setState({overlay: true})
  };

  closeSettingsMenu = () => {
   	this.setState({overlay: false})
  };

  showModal = (id, name) => {
    this.setState({
      item_id: id,
      item_name: name,
      modal_visible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modal_visible: false,
    });
  };

  getUserId = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({
      user_id: user_id,
    });
  };

  getItem = () => {
    axios.request({
        method: 'GET',
        url: 'http://192.168.0.4:8000/api/v1/item',
      })
      .then(response => {
        this.setState({item: response.data.serve, loading: false});
      })
      .catch(err => {
        Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve")
      });
  };

  borrowItem = () => {
    this.refs.loading.show();
    if(this.state.item_ammount == null || this.state.item_ammount == ''){
        this.refs.loading.show(false);
        Alert.alert("Inputan kosong", "Harap isi jumlah yang ingin dipinjam")
    }else if(isNaN(this.state.item_ammount)){
        this.refs.loading.show(false);
        Alert.alert("Inputan salah", "Harap isi dengan benar")
    }else{
      axios.request({
        method: 'POST',
        url: 'http://192.168.0.4:8000/api/v1/borrow',
        data: {
          student_id: this.state.user_id,
          item_id: this.state.item_id,
          item_ammount: this.state.item_ammount,
        }
      })
      .then(response => {
        Alert.alert('Berhasil', 'Berhasil dipinjam');
        this.setState({modal_visible: false});
        this.GetItem();
        if(response.message == "Sukses"){
          this.refs.loading.show(false);
        }
      })
      .catch(err => {
        this.refs.loading.show(false);
        if(err.response.status == 400){
          Alert.alert("Barang kurang", "Barang yang ingin anda pinjam kurang")
        }else{
          Alert.alert("Terjadi kesalahan", "Telah terjadi kesalahan")
        }
      });
    }
  };

  wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  refresh = () => {
    this.setState({refreshloader: true})
    this.getItem()
    this.wait(2000).then( () => this.setState({refreshloader: false}) )
  };


  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item, index }) => (
    <Card key={index}>
      <Text style={{marginBottom: 10}}>{item.item_name}</Text>
      <Text>Sisa barang: {item.item_ammount}</Text>

      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.submitButton}
          titleStyle={{fontWeight: 'bold'}}
          onPress={() => {
            this.showModal(item.item_id, item.item_name);
          }}
          title="Pinjam"
          type="solid"
          raised={true}
        />
      </View>
    </Card>
  )

  render() {
    const { item } = this.state;
    const items = item.filter(createFilter(this.state.keyword, 'item_name'));
    if(this.state.loading){
      return(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#31AFB4"/>
        </View>
    )}

    return (
      <View style={{height: 550}}>
        <Header
            placement="left"
            backgroundColor="#31AFB4"
            rightComponent={
              <Icon
                name="bars"
                color="#fff"
                size={20}
                style={{marginBottom: 20}}
                onPress={this.showSettingsMenu}
              />
            }
          />
        <SearchBar
          lightTheme={true}
          round={true}
          inputStyle={{backgroundColor:'#fff'}}
          inputContainerStyle={{backgroundColor:'#fff'}}
          searchIcon={ 
            <Icon
              name="search"
              size={20}
              color="#86939e"
            />
          }
          clearIcon={
            <Icon
              name="times"
              size={20}
              color="#86939e"
            />
          }
          onChangeText={keyword => this.setState({keyword})}
          value={this.state.keyword}
          placeholder="Cari barang"
        />

        <FlatList
          keyExtractor={this.keyExtractor}
          data={items}
          renderItem={this.renderItem}
          refreshing={this.state.refreshloader}
          onRefresh={this.refresh}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal_visible}
          onRequestClose={this.closeModal}>
          <View>
            <Loading
              ref="loading"
              backgroundColor='#fff'
              borderRadius={5}
              size={70}
              imageSize={40}
              indicatorColor='#039be5'
            />
            <Icon
              style={{top: 15, left: 10, marginBottom: 20, color: '#808080'}}
              size={25}
              onPress={this.closeModal}
              name="chevron-left"
            />

            <Text style={{marginLeft: 10, marginBottom: 15, marginTop: 15}}>
              {this.state.item_name}
            </Text>

            <Input
              inputContainerStyle={styles.fieldcontainer}
              labelStyle={styles.label}
              label="Jumlah barang yang di pinjam"
              onChangeText={item_ammount => this.setState({item_ammount})}
            />

            <View style={styles.buttonContainer}>
              <Button
                onPress={this.borrowItem}
                title="Pinjam"
                type="solid"
                raised={true}
                buttonStyle={styles.submitButton}
              />
            </View>

          </View>
        </Modal>

        <Overlay
    		  isVisible={this.state.overlay}
    		  width={250}
    		  height={250}
    		  onBackdropPress={this.closeSettingsMenu}
    		>
    		  <View style={{flex:1}}>
    		  	<View style={{flex: 1, justifyContent: 'center'}}>
    		  		<TouchableOpacity
    		  			style={styles.buttonStyle}
            			onPress={this.changePassword}
    		  		>
    		  			<Text style={{color:'#31AFB4'}}>Ganti Password</Text>
    		  		</TouchableOpacity>
    		  	</View>
    		  	<View style={{flex: 1, justifyContent: 'center'}}>
      		  		<TouchableOpacity
      		  			style={styles.buttonStyle}
              		onPress={this.logout}
      		  		>
    		  			<Text style={{color:'#31AFB4'}}>Logout</Text>
    		  		</TouchableOpacity>
    		  	</View>
    		  </View>
		    </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitButton: {
    borderRadius: 25,
    width: 250,
    backgroundColor: '#31AFB4',
    borderColor: 'transparent',
    elevation: 0.50,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25
  },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
 fieldcontainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#31AFB4',
    backgroundColor: '#fff',
  },
  label: {
    paddingBottom: 10,
  },
  buttonStyle:{
   	backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    height:50
   }
});
