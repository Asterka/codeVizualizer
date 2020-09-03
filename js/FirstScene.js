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
      loadedData: []
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
    return fetch("http://192.168.0.101:3001/api?metric=CBO")
      .then(res => res.json())
      .then((json) => {
          this.setState({
            isLoaded: true,
            loadedData: json.values,
            });
        },
        (error) => {
          this.setState({
            isLoaded: true,
          });
        }
      )
  }


  render() {
    if(!this.state.isLoaded){
    return (
      <ViroARScene>
        <ViroText text={"Loading..."} scale={[0.5, 0.5, 0.5]} position={[1, 1.5, -2.5]} style={styles.helloWorldTextStyle}
        materials={["frontMaterial", "backMaterial", "sideMaterial"]}
        extrusionDepth={8}/>
        {/* <ViroText text={"test"} scale={[0.5, 0.5, 0.5]} position={[1, 0.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
        />

        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} /> */}

        {/* <ViroText text="Next Scene" scale={[0.5, 0.5, 0.5]} position={[1, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
          onClick={(props) => { this._pushNextScene(props) }} /> */}
        {/* 
        <ViroBox position={[-1, 0, -1]} scale={[scaleVal[0], scaleVal[0], scaleVal[0]]} materials={["grid"]}
          onClick={this._logText} />

        <ViroBox position={[1, 0, -1]} scale={[scaleVal[1], scaleVal[1], scaleVal[1]]} materials={["grid"]}
          onClick={this._logText} /> */}
      </ViroARScene>
    );}
    else{
      let counter = 0;
      let length = this.state.loadedData.length
      let max = 0;
      let min = 1000;
      //Find min and max
      this.state.loadedData.forEach(element => {
        if(max <= element.value){
          max = element.value
        }
        if(min >= element.value){
          min = element.value
        }
      });

      let side = 0;
      let fieldCapacity = 5
      let fieldSize = 2;
      let initX, initY = 0;
      //find the square size
      for(let i = 2;i < 100;i++){
        if(i*i >= length){
          side = i + "";
          break;
        }
      }
      
      let data = this.state.loadedData.map((val, key)=>{
        counter++;
         return <ViroBox position={[Math.floor(counter%fieldCapacity),
           -2,
            Math.floor(counter/fieldCapacity)
          
          ]} scale={[fieldSize/fieldCapacity, 4*val.value/max + 1, fieldSize/fieldCapacity]} key={key} materials={["grid"]}
         onClick={this._logText} />
        
      })
      return(
        <ViroARScene>
          {data}
          <ViroText text="Next Scene" scale={[0.5, 0.5, 0.5]} position={[1, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
          onClick={(props) => { this._pushNextScene(props) }} /> 
          <ViroText text={fieldSize/fieldCapacity} scale={[1, 1, 1]} position={[-2, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
           />  
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
