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
      num: 0,
      classKeys: [],
      scaleUp: true,
      isLoaded: false,
      savedText: ""
    };

    // bind 'this' to functions
    this._calculateMetrics = this._calculateMetrics.bind(this);
    this._logText = this._logText.bind(this);
    this._pushNextScene = this._pushNextScene.bind(this);
  }

  componentDidMount() {
    fetch("http://192.168.0.101:3001/")
      .then(res => res.text())
      .then(
        (result) => { 
          let xml = new XMLParser().parseFromString(result);
          this.setState(
            {...{"isLoaded": "true",
            }, ...this._calculateMetrics(xml)}
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
  _calculateMetrics(str){
    let array = {};
    let classes = []
    str.getElementsByTagName("METRICS")[0]["children"].forEach(element => {
      array[element["attributes"]["name"]] = {}
      element["children"].forEach(valueForClass => {
        array[element["attributes"]["name"]][valueForClass["attributes"]["measured"]] = valueForClass["attributes"]["value"]
      });
      element["children"].forEach(classCounter => {
        classes[classes.length] = classCounter["attributes"]["measured"]
      });
      this.setState({
        classKeys: classes
      })
    });
    return array
  }
  _pushNextScene() {
    this.props.sceneNavigator.push({ scene: state.scenes[1], state: state });
  }

  _logText() {

      if(this.state.isLoaded){
      this.setState({
        text: "Class" + this.state.classKeys[this.state.num+1] + " " + this.state["Coupling between objects"][this.state.classKeys[this.state.num+1]],
        num: this.state.num < this.state.classKeys.length ? this.state.num +1:0
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
