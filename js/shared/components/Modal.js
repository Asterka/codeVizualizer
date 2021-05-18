import React, { useState } from "react";
import { Button, View, StyleSheet, Text} from "react-native";
import Modal from "react-native-modal";
import LoginForm from "../../LoginForm";

const ModalDemo = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.baseText}>You have to login by providing your userID and projectID from the frontend.</Text>
      <Button title="Click here to login" onPress={toggleModal} />
      <Modal isVisible={isModalVisible}>
        <View>
          <LoginForm />
          <View style={{ backgroundColor: "white" }}>
            <Button title="Hide modal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  baseText: {
    fontFamily: "roboto-medium",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ModalDemo;
