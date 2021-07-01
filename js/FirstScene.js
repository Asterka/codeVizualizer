"use strict";

import React, { Component } from "react";
import axios from "axios";

import { StyleSheet, Alert } from "react-native";
import { codeVisualizerServer } from "../config";

var XMLParser = require("react-xml-parser");

var SecondScene = require("./SecondScene");

import {
  ViroPortal,
  ViroPortalScene,
  Viro3DObject,
  ViroARScene,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroMaterials,
  ViroText,
  ViroBox,
  ViroDirectionalLight,
} from "react-viro";
let portal3D = {};
export class FirstScene extends Component {
  constructor() {
    super();
    this.state = {
      text: "Initial text",
      chosen_project: 0,
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
      isLoading: false,
      rotation: [0, 0, 0],
      loadedData: {},
    };

    // bind 'this' to functions
    this._logText = this._logText.bind(this);
    this._setStartValue = this._setStartValue.bind(this);
    this._pushNextScene = this._pushNextScene.bind(this);
    this._updateCoordinates = this._updateCoordinates.bind(this);
    this._setPortalLoadingStatus = this._setPortalLoadingStatus.bind(this);
    this._metricGenerator = this._metricGenerator.bind(this);
  }
  componentDidMount() {
    if (this.state.isLoaded != true) {
      /* Set initial state  */
      this.setState({ isLoading: true });
      this.setState({ isLoaded: false });
      this._metricGenerator();
    }
  }

  render() {
    if (this.state.isLoaded !== true) {
      return (
        <ViroARScene>
          <ViroText
            text={`Loading ${codeVisualizerServer.project_ids[this.state.chosen_project]} ...`}
            scale={[0.5, 0.5, 0.5]}
            position={[1, 1.5, -2.5]}
            style={styles.helloWorldTextStyle}
            materials={["frontMaterial", "backMaterial", "sideMaterial"]}
            extrusionDepth={8}
          />
        </ViroARScene>
      );
    } else {
      return (
        <ViroARScene
          onCameraTransformUpdate={(data) => this._updateCoordinates(data)}
        >
          <ViroAmbientLight color="#FFFFFF" intensity={250} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, 0]} />
          <ViroDirectionalLight color="#FFFFFF" direction={[0, 0, -1]} />
          <ViroARPlaneSelector
            minHeight={0.5}
            minWidth={0.5}
            alignment={"Horizontal"}
            onPlaneSelected={(data) => this._setStartValue(data)}
            ignoreEventHandling={this.state.standPos.isSet}
          >
            <Viro3DObject
              source={require("./res/portal/button_floor_export.obj")}
              position={[
                this.state.standPos.posX,
                this.state.standPos.posY,
                this.state.standPos.posZ,
              ]}
              scale={[1, 1, 1]}
              type="OBJ"
            ></Viro3DObject>
          </ViroARPlaneSelector>

          {this.state.portals.portalsShown ? (
            <>
              {this.state.portals.portalsLoading ? (
                <ViroText
                  text="Loading..."
                  scale={[0.5, 0.5, 0.5]}
                  position={[
                    this.state.standPos.posX,
                    this.state.standPos.posY,
                    this.state.standPos.posZ,
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
              <ViroText
                text="LOC"
                scale={[0.5, 0.5, 0.5]}
                position={[
                  this.state.standPos.posX,
                  this.state.standPos.posY + 1,
                  this.state.standPos.posZ,
                ]}
                style={styles.helloWorldTextStyle}
                materials={["frontMaterial", "backMaterial", "sideMaterial"]}
                extrusionDepth={8}
                onClick={() => {
                  Alert.alert("Enter this scene to inspect LoC metric");
                }}
              />
              <ViroPortalScene
                passable={true}
                dragType="FixedDistance"
                onDrag={() => {}}
              >
                {this.state.loadedData.LOC.data ? (
                  this.state.loadedData.LOC.data
                ) : (
                  <></>
                )}
                <ViroPortal
                  position={[
                    this.state.standPos.posX,
                    this.state.standPos.posY,
                    this.state.standPos.posZ,
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
                    onLoadStart={() => {
                      this._setPortalLoadingStatus(true);
                    }}
                    onLoadEnd={() => {
                      this._setPortalLoadingStatus(false);
                    }}
                  />
                </ViroPortal>
              </ViroPortalScene>
              <ViroText
                text="COMPLEXITY"
                scale={[0.5, 0.5, 0.5]}
                position={[
                  this.state.standPos.posX + 1,
                  this.state.standPos.posY + 1,
                  this.state.standPos.posZ,
                ]}
                style={styles.helloWorldTextStyle}
                materials={["frontMaterial", "backMaterial", "sideMaterial"]}
                extrusionDepth={8}
                onClick={() => {
                  Alert.alert("Enter this scene to inspect LoC metric");
                }}
              />
              <ViroPortalScene
                passable={true}
                dragType="FixedDistance"
                onDrag={() => {}}
              >
                <ViroPortal
                  position={[
                    this.state.standPos.posX + 1,
                    this.state.standPos.posY,
                    this.state.standPos.posZ,
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
                    onLoadStart={() => {
                      this._setPortalLoadingStatus(true);
                    }}
                    onLoadEnd={() => {
                      this._setPortalLoadingStatus(false);
                    }}
                  />
                </ViroPortal>
              </ViroPortalScene>
              <ViroText
                text="CBO"
                scale={[0.5, 0.5, 0.5]}
                position={[
                  this.state.standPos.posX + 2,
                  this.state.standPos.posY + 1,
                  this.state.standPos.posZ,
                ]}
                style={styles.helloWorldTextStyle}
                materials={["frontMaterial", "backMaterial", "sideMaterial"]}
                extrusionDepth={8}
                onClick={() => {
                  Alert.alert("Enter this scene to inspect LoC metric");
                }}
              />
              <ViroPortalScene
                passable={true}
                dragType="FixedDistance"
                onDrag={() => {}}
              >
                <ViroPortal
                  position={[
                    this.state.standPos.posX + 2,
                    this.state.standPos.posY,
                    this.state.standPos.posZ,
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
                    onLoadStart={() => {
                      this._setPortalLoadingStatus(true);
                    }}
                    onLoadEnd={() => {
                      this._setPortalLoadingStatus(false);
                    }}
                  />
                </ViroPortal>
              </ViroPortalScene>
            </>
          ) : (
            <ViroText
              text="Stand here"
              scale={[0.5, 0.5, 0.5]}
              position={[
                this.state.standPos.posX,
                this.state.standPos.posY,
                this.state.standPos.posZ,
              ]}
              style={styles.helloWorldTextStyle}
              materials={["frontMaterial", "backMaterial", "sideMaterial"]}
              extrusionDepth={8}
              onClick={() => {
                Alert.alert("First, enter the square");
              }}
            />
          )}
          <ViroText
            text="Next Project"
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
            portals: Object.assign({}, this.state.portals, {
              portalsShown: true,
            }),
          });
        } else {
          if (!this.state.portals.portalsShown) {
            this.setState({
              portals: Object.assign({}, this.state.portals, {
                portalsShown: false,
                portalsLoading: false,
              }),
            });
          }
        }
      } else {
        this.setState({
          portals: Object.assign({}, this.state.portals, {
            portalsShown: true,
            portalsLoading: false,
          }),
        });
      }
    }
  }

  _pushNextScene() {
    let current = this.state.chosen_project + 1 <= codeVisualizerServer.project_ids.length - 1 ? this.state.chosen_project + 1 : 0;
    this.setState({chosen_project: current})
    //Pass the scenes to the ARScene
    this.props.sceneNavigator.push({ scene: state.scenes[0], state: state });
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
  _setPortalLoadingStatus(loading) {
    this.setState({
      portals: Object.assign({}, this.state.portals, {
        portalsLoading: loading,
      }),
    });
  }
  /* Fetcher for the Metrics */
  async _metricGenerator() {
    let promises = codeVisualizerServer.metrics.map(async (element) => {
      await axios
        .get(
          `${codeVisualizerServer.address}/metrics/${codeVisualizerServer.user_id}/${codeVisualizerServer.project_ids[this.state.chosen_project]}/${element}`,
          {}
        )
        .then((res) => {
          let filteredData = res.data.files.map((element) => {
            return {
              violations: element.violations.filter((violation) => {
                return violation.endline - violation.beginline;
              }),
              filename: element.filename,
            };
          });

          let counter = 0;
          let length = res.data.files.length;
          let fieldSize = 3;
          let max = 0;
          let min = 1000;
          //Find min and max
          filteredData.forEach((element) => {
            let violation =
              element.violations[element.violations.length - 1].endline -
              element.violations[element.violations.length - 1].beginline;
            if (max <= violation) {
              max = violation;
            }
            if (min >= violation) {
              min = violation;
            }
          });

          filteredData = filteredData.map((val, key) => {
            counter++;
            return (
              <>
                <ViroBox
                  position={[
                    Math.floor(counter % 5),
                    2*(val.violations[val.violations.length-1].endline -
                      val.violations[val.violations.length-1].beginline - min) /
                      (max - min),
                    Math.floor(counter / 5),
                  ]}
                  scale={[
                    fieldSize / (length + 5),
                    2*(val.violations[val.violations.length-1].endline -
                      val.violations[val.violations.length-1].beginline - min) /
                      (max - min),
                    fieldSize / (length + 5),
                  ]}
                  key={key}
                  materials={["basic"]}
                  onClick={()=>{
                    Alert.alert(val.filename)
                  }}
                />
                <ViroText
                  text={
                    " " +
                    val.violations[val.violations.length-1].endline -
                    val.violations[val.violations.length-1].beginline
                  }
                  position={[
                    Math.floor(counter % 5),
                    2 +
                      (val.violations[val.violations.length-1].endline -
                        val.violations[val.violations.length-1].beginline) /
                        max,
                    Math.floor(counter / 5),
                  ]}
                  rotation={this.state.rotation}
                  style={styles.helloWorldTextStyle}
                  materials={["frontMaterial", "backMaterial", "sideMaterial"]}
                  extrusionDepth={8}
                />
              </>
            );
          });

          this.setState({
            loadedData: Object.assign(
              {},
              { ...this.state.loadedData },
              {
                [element]: {
                  isMetricLoaded: true,
                  data: filteredData,
                  max: max,
                  min: min,
                },
              }
            ),
          });
        })
        .catch((err) => {
          Alert.alert("error");
        });
    });
    await Promise.all(promises)
      .then(() => {
        this.setState({ isLoaded: true });
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        Alert.alert(JSON.stringify(err));
      });
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
