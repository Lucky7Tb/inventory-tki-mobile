import React, { Component } from 'react';
import {Text, View, BackHandler,ToastAndroid} from 'react-native';
import { DataTable, List } from 'react-native-paper';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, } from 'react-navigation';
export default class HistoryScreen extends Component{
	
  render(){
    return(
      <View>
        <List.Item
          title="First Item"
          description="Item description"
          left={props => <List.Icon {...props} icon="folder" />}
        />
        <List.Item
          title="First Item"
          description="Item description"
          left={props => <List.Icon {...props} icon="folder" />}
        />
      </View>
    );
  }
}