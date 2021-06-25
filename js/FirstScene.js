"use strict";

import React, { Component } from "react";

import { StyleSheet, Alert } from "react-native";

var XMLParser = require("react-xml-parser");

var SecondScene = require("./SecondScene");

import PortalAsset from "./res/portal";

import {
  ViroPortal,
  ViroPortalScene,
  Viro360Image,
  Viro3DObject,
  ViroARScene,
  ViroARPlane,
  ViroBox,
  ViroAmbientLight,
  ViroMaterials,
  ViroText,
  ViroNode,
  lightingModel,
  ViroQuad,
  ViroDirectionalLight,
  ViroARCamera,
} from "react-viro";
let portal3D = {};
export class FirstScene extends Component {
  constructor() {
    super();
    this.state = {
      text: "Initial text",
      textPosX: -1,
      textPosY: -1,
      textPosZ: -1,
      portals: {
        portalsShown: false,
        portalsLoading: false,
      },
      cameraPosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      standPos: {
        isSet: false,
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      isLoaded: false,
      rotation: [0, 0, 0],
      loadedData: [],
    };

    // bind 'this' to functions
    this._logText = this._logText.bind(this);
    this._setStartValue = this._setStartValue.bind(this);
    this._pushNextScene = this._pushNextScene.bind(this);
    this._updateCoordinates = this._updateCoordinates.bind(this);
    this._setPortalLoadingStatus = this._setPortalLoadingStatus.bind(this);
  }

  componentDidMount() {
    //fetch the data for the scene,
    //here I use the servers API, providing the short form of the metric name
    //full information about the shortnames mapping should be added to the project's
    //repository page
    return fetch("http://192.168.0.105:3001/api?metric=CBO")
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
              text={val.value}
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
        <ViroARScene
          onCameraTransformUpdate={(data) => this._updateCoordinates(data)}
        >
          <ViroAmbientLight color="#FFFFFF" intensity={250} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, 0]} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, 0, -1]} />
          <ViroARPlane
            minHeight={0.5}
            minWidth={0.5}
            alignment={"Horizontal"}
            onAnchorFound={(data) => this._setStartValue(data)}
            ignoreEventHandling={this.state.standPos.isSet}
          >
            <ViroBox
              position={[0, -1, 0]}
              scale={[1, 0.05, 1]}
              materials={["basic"]}
            />
          </ViroARPlane>

          {this.state.portals.portalsShown ? (
            <>
              {this.state.portals.portalsLoading ? (
                <ViroText
                  text="Loading..."
                  scale={[0.5, 0.5, 0.5]}
                  position={[
                    this.state.standPos.posX,
                    0,
                    this.state.standPos.posY,
                  ]}
                  style={styles.helloWorldTextStyle}
                  materials={["frontMaterial", "backMaterial", "sideMaterial"]}
                  extrusionDepth={8}
                  onClick={() => {
                    Alert.alert("First, enter the square");
                  }}
                />
              ) : (
                <></>
              )}
              <ViroPortalScene
                passable={true}
                dragType="FixedDistance"
                onDrag={() => {}}
              >
                <ViroPortal
                  position={[
                    this.state.standPos.posX,
                    0,
                    this.state.standPos.posY,
                  ]}
                  scale={[0.1, 0.1, 0.1]}
                >
                  <Viro3DObject
                    source={require("./res/portal_res/portal_ship/portal_ship.vrx")}
                    resources={[
                      require("./res/portal_res/portal_ship/portal_ship_diffuse.png"),
                      require("./res/portal_res/portal_ship/portal_ship_normal.png"),
                      require("./res/portal_res/portal_ship/portal_ship_specular.png"),
                    ]}
                    type="VRX"
                    onLoadStart={()=>{this._setPortalLoadingStatus(true)}}
                    onLoadEnd={()=>{this._setPortalLoadingStatus(false)}}
                  />
                </ViroPortal>
                {data}
              </ViroPortalScene>
            </>
          ) : (
            <ViroText
              text="Stand here"
              scale={[0.5, 0.5, 0.5]}
              position={[this.state.standPos.posX, 0, this.state.standPos.posY]}
              style={styles.helloWorldTextStyle}
              materials={["frontMaterial", "backMaterial", "sideMaterial"]}
              extrusionDepth={8}
              onClick={() => {
                Alert.alert("First, enter the square");
              }}
            />
          )}
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
        </ViroARScene>
      );
    }
  }

  _updateCoordinates(data) {
    if (this.state.standPos.isSet) {
      let diff = Math.sqrt(
        Math.pow(this.state.standPos.posX - data.position[0], 2) +
          Math.pow(this.state.standPos.posY - data.position[2], 2)
      );
      if (diff != undefined) {
        if (diff <= 1.3) {
          this.setState({
            portals: Object.assign({}, this.state.portals, {portalsShown: true}),
          });
        } else {
          this.setState({
            portals: Object.assign({}, this.state.portals, {portalsShown: false, portalsLoading: false}),
          });
        }
      } else {
        this.setState({
          portals: Object.assign({}, this.state.portals, {portalsShown: true, portalsLoading: false}),
        });
      }
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
      });
    } else {
      this.setState({
        text: "text 1",
      });
    }
  }
  _setPortalLoadingStatus(loading){
    this.setState({
      portals: Object.assign({}, this.state.portals, {portalsLoading: loading})
    })
  }
  _setStartValue(data) {
    this.setState({
      standPos: {
        isSet: true,
        posX: data.position[0],
        posZ: data.position[1],
        posY: data.position[2],
      },
    });
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
