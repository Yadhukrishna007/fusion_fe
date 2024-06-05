import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name should be atleast 2 characters")
    .max(20, "Name should not exceed 20 characters")
    .matches(/^[aA-zZ]/, "Numbers and special characters are not allowed"),
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),

  password: Yup.string()
    .required("Please enter a password")

    .min(8, "Password should be atleast 8 characters")
    .max(16, "Password should not exceed 16 characters"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),

  password: Yup.string().required("Please enter a password"),
});
