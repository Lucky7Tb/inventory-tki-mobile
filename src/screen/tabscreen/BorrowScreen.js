import React, {Component} from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
  ListItem,
  Button,
  Input,
  Header,
  Card,
  Text,
  SearchBar,
} from 'react-native-elements';
import SearchInput, {createFilter} from 'react-native-search-filter';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import OneSignal from 'react-native-onesignal';
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

export default class BorrowScreen extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.BorrowItem = this.BorrowItem.bind(this);
    this.state = {
      item: [],
      user_id: '',
      item_id: '',
      item_name: '',
      item_ammount: '',
      player_id: '',
      keyword: '',
      modal_visible: false,
      loading: true,
    };
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onIds = async device => {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({
      user_id: user_id,
    });
    axios
      .request({
        method: 'POST',
        url: 'http://192.168.0.3:8001/api/v1/student',
        data: {
          student_id: user_id,
          player_id: device.userId,
        },
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.GetItem();
  }

  showModal = (id, name) => {
    this.setState({
      item_id: id,
      item_name: name,
      modal_visible: true,
    });
  };

  GetItem = async () => {
    axios
      .request({
        method: 'GET',
        url: 'http://192.168.0.3:8001/api/v1/item',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      })
      .then(response => {
        let dataItem = response.data.serve;
        this.setState({item: dataItem, loading: false,});
      })
      .catch(err => {
        console.log(err);
      });
  };

  BorrowItem = () => {
    axios
      .request({
        method: 'POST',
        url: 'http://192.168.0.3:8001/api/v1/borrow',
        data: {
          student_id: this.state.user_id,
          item_id: this.state.item_id,
          item_ammount: this.state.item_ammount,
        },
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      })
      .then(response => {
        console.log(response.data.message);
        console.log(response.data.serve);
        Alert.alert('Berhasil', 'Berhasil dipinjam');
        this.setState({modal_visible: false});
        this.GetItem();
      })
      .catch(err => {
        console.log(err);
      });
  };

  searchItem(keyword) {
    this.setState({keyword: keyword});
  }

  render() {
    const item = this.state.item;
    const items = item.filter(createFilter(this.state.keyword, 'item_name'));
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
          leftComponent={<ImageView />}
          rightComponent={
            <Icon
              name="user"
              color="#fff"
              size={20}
              style={{marginBottom: 20}}
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}
            />
          }
        />
        <SearchBar
          platform="android"
          onChangeText={keyword => {
            this.searchItem(keyword);
          }}
          value={this.state.keyword}
          placeholder="Cari barang"
        />
        <ScrollView>
          {items.map((object, index) => (
            <Card key={index}>
              <Text style={{marginBottom: 10}}>{object.item_name}</Text>
              <Text>Sisa barang: {object.item_ammount}</Text>

              <View style={styles.buttonContainer}>
                <Button
                  buttonStyle={styles.submitButton}
                  onPress={() => {
                    this.showModal(object.item_id, object.item_name);
                  }}
                  title="Pinjam"
                  type="clear"
                />
              </View>
            </Card>
          ))}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal_visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View>
            <Icon
              style={{top: 15, left: 10, marginBottom: 20, color: '#808080'}}
              size={25}
              onPress={() => {
                this.setState({modal_visible: false});
              }}
              name="chevron-left"
            />

            <Text style={{marginLeft: 10, marginBottom: 15, marginTop: 15}}>
              {this.state.item_name}
            </Text>

            <Input
              label="Jumlah barang yang di pinjam"
              onChangeText={item_ammount => this.setState({item_ammount})}
            />

            <Button
              onPress={this.BorrowItem}
              title="Pinjam"
              type="outline"
              buttonStyle={styles.submitButton}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitButton: {
    borderRadius: 90,
    borderWidth: 1,
    width: 250,
    marginTop: 25,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
});
