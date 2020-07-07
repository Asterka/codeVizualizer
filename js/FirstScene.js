'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';


var SecondScene = require('./SecondScene');

import {
  ViroARScene,
  ViroBox,
  ViroAmbientLight,
  ViroMaterials,
  ViroSpotLight,
  ViroText,
} from 'react-viro';

export class FirstScene extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text : "Move Next",
      scaleUp : true,
    };

    // bind 'this' to functions
    this.scaleBox = this.scaleBox.bind(this);
    this._logText = this._logText.bind(this);
    this._pushNextScene = this._pushNextScene.bind(this);
    }

  render() {
    return (
      <ViroARScene>
        {/* Development Console */}
        <ViroText text={this.state.text} scale={[0.5, 0.5, 0.5]} position={[1, 0, -1]} style={styles.helloWorldTextStyle}
        materials={["frontMaterial", "backMaterial", "sideMaterial"]}
        extrusionDepth={8}
        />

        <ViroText text="Next Scene" scale={[0.5, 0.5, 0.5]} position={[-1, -1, -2]} style={styles.helloWorldTextStyle}
        materials={["frontMaterial", "backMaterial", "sideMaterial"]}
        extrusionDepth={8}
        onClick={(props)=>{this._pushNextScene(props)}}/>
                   
        <ViroBox position={[0, -.5, -1]} scale={[scaleVal[0], scaleVal[0], scaleVal[0]]} materials={["grid"]}
         onClick={this._logText} />

        <ViroBox position={[0, -2, -1]} scale={[scaleVal[1], scaleVal[1], scaleVal[1]]} materials={["grid"]}
         onClick={this._logText} />
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
        

			</ViroARScene>
    );
  }

  _pushNextScene(){
    this.props.sceneNavigator.push({scene:state.scenes[1], state:state});
  }

  _logText(){
    if(this.state.text === "text 1"){
      this.setState({
        text: "text 2"
      });
    }else{
      this.setState({
        text: "text 1"
      });
    }

  };

  scaleBox(value){
    if(this.state.scaleUp == true){
      scaleVal[0] += 0.1;
    }
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

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg'),
  },
});

var scaleVal = [0.5, 0.5]
module.exports = FirstScene;
