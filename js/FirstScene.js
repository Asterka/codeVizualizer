"use strict";

import React, { Component } from "react";

import { StyleSheet, Alert} from "react-native";

var XMLParser = require("react-xml-parser");

var SecondScene = require("./SecondScene");

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
  lightingModel,
  ViroQuad,
  ViroDirectionalLight,
  ViroARCamera,
} from "react-viro";

export class FirstScene extends Component {
  constructor() {
    super();
    this.state = {
      text: "Initial text",
      textPosX: -100,
      textPosY: -100,
      textPosZ: -100,
      isLoaded: false,
      rotation: [0, 0, 0],
      loadedData: [],
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
    Alert.alert(state.connectInfo);
    return fetch("http://192.168.1.38:3001/api?metric=CBO")
      .then((res) => res.json())
      .then(
        (json) => {
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
      );
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <ViroARScene>
          <ViroText
            text={"Loading..."}
            scale={[0.5, 0.5, 0.5]}
            position={[1, 1.5, -2.5]}
            style={styles.helloWorldTextStyle}
            materials={["frontMaterial", "backMaterial", "sideMaterial"]}
            extrusionDepth={8}
          />
        </ViroARScene>
      );
    } else {
      let counter = 0;
      let length = this.state.loadedData.length;
      let max = 0;
      let min = 1000;
      //Find min and max
      this.state.loadedData.forEach((element) => {
        if (max <= element.value) {
          max = element.value;
        }
        if (min >= element.value) {
          min = element.value;
        }
      });

      let side = 0;
      let fieldCapacity = 5;
      let fieldSize = 2;
      let initX,
        initY = 0;
      //find the square size
      for (let i = 2; i < 100; i++) {
        if (i * i >= length) {
          side = i + "";
          break;
        }
      }

      let data = this.state.loadedData.map((val, key) => {
        counter++;
        return (
          <>
            <ViroBox
              position={[
                Math.floor(counter % fieldCapacity),
                -2,
                Math.floor(counter / fieldCapacity),
              ]}
              scale={[
                fieldSize / fieldCapacity,
                (4 * val.value) / max + 1,
                fieldSize / fieldCapacity,
              ]}
              key={key}
              onClick={() => {
                this._displayName({
                  name: val.className,
                  posX: Math.floor(counter % fieldCapacity),
                  posY: -2 + (4 * val.value) / max,
                  posZ: Math.floor(counter / fieldCapacity),
                });
              }}
              materials={["basic"]}
            />
            <ViroText
              text={this.state.text}
              position={[
                this.state.textPosX,
                this.state.textPosZ,
                this.state.textPosY,
              ]}
              rotation={this.state.rotation}
              style={styles.helloWorldTextStyle}
              materials={["frontMaterial", "backMaterial", "sideMaterial"]}
              extrusionDepth={8}
            />
          </>
        );
      });
      return (
        <ViroARScene>
          <ViroAmbientLight color="#FFFFFF" intensity={250} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, 0]} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, 0, -1]} />
          {data}
          <ViroText
            text="Next Scene"
            scale={[0.5, 0.5, 0.5]}
            position={[1, 1.5, -2.5]}
            style={styles.helloWorldTextStyle}
            materials={["frontMaterial", "backMaterial", "sideMaterial"]}
            extrusionDepth={8}
            onClick={(props) => {
              this._pushNextScene(props);
            }}
          />

          <ViroText
            text={this.state.text}
            scale={[0.3, 0.3, 0.3]}
            position={[
              this.state.textPosY,
              this.state.textPosZ,
              this.state.textPosX,
            ]}
            style={styles.helloWorldTextStyle}
            materials={["frontMaterial", "backMaterial", "sideMaterial"]}
            extrusionDepth={8}
          />
          {/* <ViroText text={fieldSize/fieldCapacity} scale={[1, 1, 1]} position={[-2, 1.5, -2.5]} style={styles.helloWorldTextStyle}
          materials={["frontMaterial", "backMaterial", "sideMaterial"]}
          extrusionDepth={8}
           />   */}
          <ViroQuad
            position={[1.5, -3, 1.5]}
            rotation={[-90, 0, 0]}
            width={5}
            height={5}
          />
        </ViroARScene>
      );
    }
  }

  _pushNextScene() {
    //Pass the scenes to the ARScene
    this.props.sceneNavigator.push({ scene: state.scenes[1], state: state });
  }

  _logText() {
    if (this.state.isLoaded) {
      this.setState({
        text: this.state.text,
        textPosX: "",
      });
    } else {
      this.setState({
        text: "text 1",
      });
    }
  }
  _displayName({ name, posX, posY, posZ }) {
    this.setState({
      text: name,
      textPosX: posX,
      textPosY: posY,
      textPosZ: posZ,
    });
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    backgroundColor: "#000000",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

ViroMaterials.createMaterials({
  frontMaterial: {
    diffuseColor: "#FFFFFF",
  },
  backMaterial: {
    diffuseColor: "#FF0000",
  },
  sideMaterial: {
    diffuseColor: "#0000FF",
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require("./res/grid_bg.jpg"),
  },
  basic: {
    diffuseColor: "red",
    lightingModel: "Lambert",
    bloomThreshold: 0.5,
  },
});

var scaleVal = [0.5, 0.5];
module.exports = FirstScene;
