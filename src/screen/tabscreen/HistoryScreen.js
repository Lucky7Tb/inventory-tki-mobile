import React, { Component } from 'react';
import { View, BackHandler, ActivityIndicator, StyleSheet, Alert, FlatList, ScrollView,
  RefreshControl, SafeAreaView, TouchableOpacity} from 'react-native';
import { ListItem, Text, Header, Overlay} from 'react-native-elements'
import axios from 'react-native-axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
export default class HistoryScreen extends Component{

  constructor(props) {
    super(props);
    this._signOutAsync = this._signOutAsync.bind(this);
    this.logout = this.logout.bind(this);
    this.showSettingsMenu = this.showSettingsMenu.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
    this.state = {
       loading: true,
       refreshloader: false,
       overlay: false,
       user_id: '',
       data: []
    };
  };

  componentDidMount(){
    this.getDataBorrowing();
  };

   _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.setState({overlay: false});
    this.props.navigation.navigate("Login");
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

  changePassword = () => {
    this.setState({overlay: false});
    this.props.navigation.navigate('ChangePassword');
  };

  getDataBorrowing = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    axios.request({
      method: "POST",
      url: "http://192.168.0.4:8000/api/v1/getborrowdata",
      data: { 
        student_id : user_id
      }
    }).then(response => {
      this.setState({data:response.data.serve, loading:false})
    }).catch(error => {
       Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve")
    })
  };

  wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  refresh = () => {
    this.setState({refreshloader: true})
    this.getDataBorrowing()
    this.wait(2000).then( () => this.setState({refreshloader: false}) )
  };

  showSettingsMenu = () => {
    this.setState({overlay: true})
  };

  closeSettingsMenu = () => {
    this.setState({overlay: false})
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.item_id.item_name}
      subtitle={'Meminjam sebanyak: ' + item.item_ammount + ' tanggal : ' + item.borrowing_date}
      bottomDivider
      onPress={() => {
        Alert.alert('Kode peminjaman', item.borrowing_id )
      }}
    />
  )

  render(){
    if(this.state.loading){
      return(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#31AFB4"/>
        </View>
    )}

    if(this.state.data.length === 0){
      return(
         <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshloader} onRefresh={this.refresh} />
              }
            >
              <Text h4>Tidak ada barang yang dipinjam</Text>
            </ScrollView>
        </SafeAreaView>
    )}

    return(
      <View>
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
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.data}
          renderItem={this.renderItem}
          refreshing={this.state.refreshloader}
          onRefresh={this.refresh}
        />
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
   loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
   container: {
    flex: 1,
  },
   scrollView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
   buttonStyle:{
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    height:50
   }
})