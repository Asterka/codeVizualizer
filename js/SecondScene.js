'use strict';

import React, { Component } from 'react';

import {
  ViroARScene,
  ViroText,
} from 'react-viro';

var FirstScene = require('./FirstScene');

export class SecondScene extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text : "Move to the first scene",
    };
    this._pushNextScene = this._pushNextScene.bind(this);
    }

  render() {
    return (
      <ViroARScene>
        {/* Development Console */}
        <ViroText text={this.state.text} scale={[0.5, 0.5, 0.5]} position={[1, 0, -1]}
        onClick={(props)=>{this._pushNextScene(props)}}
        />
			</ViroARScene>
    );
  }
  _pushNextScene(){
    this.props.sceneNavigator.push({scene:state.scenes[0], state:state});
  }
}

module.exports = SecondScene;
