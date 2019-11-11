import React, { Component } from 'react';
import { View, BackHandler, ActivityIndicator, StyleSheet, Alert, FlatList} from 'react-native';
import { ListItem, Text } from 'react-native-elements'
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class HistoryScreen extends Component{

  constructor(props) {
    super(props);
    this.state = {
       loading: true,
       user_id: '',
       data: []
    };
  };

  componentDidMount(){
    this.getDataBorrowing();
  };

  getDataBorrowing = async () => {
    const user_id = await AsyncStorage.getItem('userId');
    axios.request({
      method: "POST",
      url: "http://192.168.0.5:8000/api/v1/getborrowdata",
      data: { 
        student_id : user_id
      }
    }).then(response => {
      this.setState({data:response.data.serve, loading:false})
    }).catch(error => {
       Alert.alert("Terjadi kesalahan", "Maaf telah terjadi kesalahan pada serve")
    })
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.item_id.item_name}
      subtitle={'Meminjam sebanyak: ' + item.item_ammount + ' tanggal : ' + item.borrowing_date}
      bottomDivider
      chevron
      onPress={() => {
        Alert.alert('Kode peminjaman', item.borrowing_id )
      }}
    />
  )

  render(){
    if(this.state.loading){
      return(
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
    )}

    if(this.state.data.length === 0){
      return(
        <View style={styles.loader}>
          <Text h4>Tidak ada barang yang dipinjam</Text>
        </View>
    )}

    return(
      <View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.data}
          renderItem={this.renderItem}
        />
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