import React, { Component } from 'react';

import {
  ViroARSceneNavigator,
} from 'react-viro';

var FirstScene = require('./js/FirstScene');
var SecondScene = require('./js/SecondScene');

export default class ViroSample extends Component {
  constructor() {
    super();
    /*Generate and pass scenes*/
    state = {
      scenes:[FirstScene, SecondScene]
    }
  }

  render() {
      return (
        <ViroARSceneNavigator
          initialScene={{scene: state.scenes[0], state: state}} />
      );
  }

}
