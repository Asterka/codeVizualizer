'use strict';

import React, { Component } from 'react';

import { StyleSheet, Text } from 'react-native';

var XMLParser = require('react-xml-parser');

var SecondScene = require('./SecondScene');

import {
  ViroPortal,
  ViroPortalScene,
  Viro360Image,
  Viro3DObject,
  ViroARScene,
  ViroARPlaneSelector,
  ViroBox,
  ViroAmbientLight,
  ViroMaterials,
  ViroSpotLight,
  ViroText,
  ViroNode,
} from 'react-viro';

export class FirstScene extends Component {

  constructor() {
    super();
    this.state = {
      text: "Initial text",
      isLoaded: false,
      
    };

    // bind 'this' to functions
    this._logText = this._logText.bind(this);
    this._pushNextScene = this._pushNextScene.bind(this);
  }

  componentDidMount() {
    //fetch the data for the scene,
    //here I use the servers API, providing the short form of the metric name
    //full information about the shortnames mapping should be added to the project's
    //repository page
    fetch("http://192.168.0.101:3001/api?metric=CBO")
      .then(res => res.json())
      .then((json) => {
          this.setState(
            {"isLoaded": "true",
            
          }
          );
        },
        (error) => {
          this.setState({
            isLoaded: true,
          });
        }
      )
  }


  render() {
    if(!state.isLoaded){
    return (
      <ViroARScene>
        {/* Development Console */}
        <ViroText text={this.state.text} scale={[0.5, 0.5, 0.5]} position={[1, 0.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
        />

        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

        <ViroText text="Next Scene" scale={[0.5, 0.5, 0.5]} position={[1, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
          onClick={(props) => { this._pushNextScene(props) }} />
        <ViroBox position={[-1, 0, -1]} scale={[scaleVal[0], scaleVal[0], scaleVal[0]]} materials={["grid"]}
          onClick={this._logText} />

        <ViroBox position={[1, 0, -1]} scale={[scaleVal[1], scaleVal[1], scaleVal[1]]} materials={["grid"]}
          onClick={this._logText} />

        <ViroPortalScene passable={true} dragType="FixedDistance" onDrag={() => { }}>
          <ViroPortal position={[0, 0, -1]} scale={[.1, .1, .1]}>
            <Viro3DObject source={require('./res/portal_res/portal_ship/portal_ship.vrx')}
              resources={[require('./res/portal_res/portal_ship/portal_ship_diffuse.png'),
              require('./res/portal_res/portal_ship/portal_ship_normal.png'),
              require('./res/portal_res/portal_ship/portal_ship_specular.png')]}
              type="VRX" />
          </ViroPortal>
          <Viro360Image source={require("./res/pic.jpg")} />
          <ViroBox position={[1, 0, -3]} scale={[scaleVal[1], scaleVal[1], scaleVal[1]]} materials={["grid"]}
          onClick={this._logText} />
        </ViroPortalScene>
      </ViroARScene>
    );}
    else{
      return(
        <ViroARScene>
        <ViroText text="Next Scene" scale={[0.5, 0.5, 0.5]} position={[1, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
          onClick={(props) => { this._pushNextScene(props) }} />
        </ViroARScene>);
    }
  }

  _pushNextScene() {
    //Pass the scenes to the ARScene
    this.props.sceneNavigator.push({ scene: state.scenes[1], state: state });
  }

  _logText() {

      if(this.state.isLoaded){
      this.setState({
        text: this.state.text,
      });
    } else {
      this.setState({
        text: "text 1"
      });
    }

  };
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
