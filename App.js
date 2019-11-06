import React, {Component} from 'react';
import Route from './src/Route';
import OneSignal from 'react-native-onesignal';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';

export default class App extends Component {
  constructor(properties) {
    super(properties);
    OneSignal.init('8305cdb3-df3d-4721-8fbe-3f66317ca720');
  }

  render() {
    return (
      <PaperProvider>
        <Route />
      </PaperProvider>
    );
  }
}
