import React from "react";
import { Viro3DObject } from "react-viro";
export default function PortalAsset(props) {
  return (
    <Viro3DObject
      source={require("./portal_res/portal_ship/portal_ship.vrx")}
      resources={[
        require("./portal_res/portal_ship/portal_ship_diffuse.png"),
        require("./portal_res/portal_ship/portal_ship_normal.png"),
        require("./portal_res/portal_ship/portal_ship_specular.png"),
      ]}
      type="VRX"
      onLoadEnd={()=>props.setSceneLoading()}
    />
  );
}
