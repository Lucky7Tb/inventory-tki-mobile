import React, {Component} from 'react';
import Route from './src/Route';
import OneSignal from 'react-native-onesignal';

export default class App extends Component {
  constructor(properties) {
    super(properties);
    OneSignal.init('8305cdb3-df3d-4721-8fbe-3f66317ca720');
  }

  render() {
    return <Route />
  }
}
