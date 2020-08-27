import React, { Component } from 'react';

import {
  ViroARSceneNavigator,
  ViroARPlaneSelector,
  ViroNode,
} from 'react-viro';

import { Text, View } from 'react-native';

var FirstScene = require('./js/FirstScene');
var SecondScene = require('./js/SecondScene');

export default class ViroSample extends Component {
  constructor() {
    super();
    /*Generate and pass scenes*/
    state = {
      savedText: [],
      text: "Text",
      isLoaded: false,
      scenes:[FirstScene, SecondScene],
    }
  }
  
  

  render() {
      return (
        <ViroARSceneNavigator
          initialScene={{scene: state.scenes[0], state: state}} />
      );
  }

  

}
