'use strict';

import React, { Component } from 'react';

import {
  ViroARScene,
  ViroText,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight
} from 'react-viro';


import { StyleSheet } from 'react-native';

var FirstScene = require('./FirstScene');

export class SecondScene extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text : "First scene",
    };
    this._pushNextScene = this._pushNextScene.bind(this);
    }

  render() {
    return (
      <ViroARScene>
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

        <ViroText text={this.state.text} scale={[0.5, 0.5, 0.5]} position={[1, 0.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
          onClick={(props)=>{this._pushNextScene(props)}}
        />
        <Viro3DObject
            source={require('./res/emoji_smile/emoji_smile.vrx')}
            resources={[require('./res/emoji_smile/emoji_smile_diffuse.png'),
                require('./res/emoji_smile/emoji_smile_normal.png'),
                require('./res/emoji_smile/emoji_smile_specular.png')]}
            position={[1, -0.5, -1]}
            scale={[.2, .2, .2]}
            type="VRX" />

			</ViroARScene>
    );
  }
  _pushNextScene(){
    this.props.sceneNavigator.push({scene:state.scenes[0], state:state});
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    backgroundColor: "#000000",
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  frontMaterial: {
    diffuseColor: '#FFFFFF',
  },
  backMaterial: {
    diffuseColor: '#FF0000',
  },
  sideMaterial: {
    diffuseColor: '#0000FF',
  },
});

module.exports = SecondScene;
