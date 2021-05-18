import React from "react";
import { Formik } from "formik";
import { Button, TextInput, View, Alert } from "react-native";

import LoginFormSchema from "./shared/validators/LoginFormSchema";

export default function LoginForm() {
  return (
    <>
      <Formik
        initialValues={{
          userID: "",
          projectID: "",
        }}
        onSubmit={(values) => Alert.alert(values)}
        validationSchema={LoginFormSchema}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TextInput
              onChangeText={handleChange("userID")}
              value={values.email}
              style={{ backgroundColor: "white", borderRadius: 8, height: 25 }}
            />
            <TextInput
              onChangeText={handleChange("projectID")}
              value={values.email}
              style={{ backgroundColor: "white", borderRadius: 8, height: 25, marginTop: 10 }}
            />

            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </>
  );
}
