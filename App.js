import React, { Component } from "react";

import {
  ViroARSceneNavigator,
  ViroARPlaneSelector,
  ViroNode,
} from "react-viro";

import { Text, View } from "react-native";
import ModalDemo from "./js/shared/components/Modal";

var FirstScene = require("./js/FirstScene");
var SecondScene = require("./js/SecondScene");


export default class ViroSample extends Component {
  constructor() {
    super();
    /*Generate and pass scenes*/
    state = {
      savedText: [],
      text: "Text",
      isLoggedIn: false,
      isLoaded: false,
      scenes: [FirstScene, SecondScene],
      credentials: ['', '']
    };
  }
  
  render() {
      return (
        <ViroARSceneNavigator
          initialScene={{ scene: state.scenes[0], state: state }}
        />
      );
  }
}
