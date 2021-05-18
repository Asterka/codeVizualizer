import * as Yup from "yup";

const LoginFormSchema = Yup.object().shape({
  userID: Yup.string()
    .min(4, "userID is too short")
    .max(8, "userID is too long")
    .required("required"),
});
export default LoginFormSchema;