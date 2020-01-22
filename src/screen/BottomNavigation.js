import React, { Component } from 'react';
import { DrawerNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import History from './tabscreen/HistoryScreen';
import Borrow from './tabscreen/BorrowScreen';
import Home from './tabscreen/HomeScreen';
import ChangePassword from './tabscreen/ChangePasswordScreen';
import Login from './LoginScreen';

const Route = {
  Login: Login,
  ChangePassword: ChangePassword,
};

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  ...Route
});

const BorrowStack = createStackNavigator({
  Borrow: {
    screen: Borrow,
    navigationOptions: {
      header: null
    }
  },
  ...Route
});

const HistoryStack = createStackNavigator({
  History: {
    screen: History,
    navigationOptions: {
      header: null
    }
  },
  ...Route
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

BorrowStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

HistoryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        activeColor: '#ffffff',
        inactiveColor: '#34515e',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={20} style={[{ color: tintColor }]} />
        ),
      },
    },
    Borrow: {
      screen: BorrowStack,
      navigationOptions: {
        tabBarLabel: 'Peminjaman',
        activeColor: '#ffffff',
        inactiveColor: '#34515e',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="archive" size={20} style={[{ color: tintColor }]} />
        ),
      },
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel: 'History',
        activeColor: '#ffffff',
        inactiveColor: '#34515e',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="list-alt" size={20} style={[{ color: tintColor }]} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#226557',
    tabBarBadge: true,
    tabBarIcon: {
      focused: true,
    },
    barStyle: { backgroundColor: '#31AFB4', zIndex: -9 },
  },
);


export default createAppContainer(TabNavigator);