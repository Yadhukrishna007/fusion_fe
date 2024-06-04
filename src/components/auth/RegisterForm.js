import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/userSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/authValidation";
import InputForm from "./InputForm";

const RegisterForm = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialvalues = {
    error_message: "",
    success_message: "",
  };
  const [message, setMessage] = useState(initialvalues);
  const { error_message, success_message } = message;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (values) => {
    const { name, email, password } = values;
    setLoading(true);
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      if (user) {
        setMessage({
          success_message: user.data.message,
          error_message: "",
        });
        dispatch(registerUser(user.data.user));
        sessionStorage.setItem("hasReloaded", "true");
        navigate("/");
      }
    } catch (error) {
      setMessage({
        error_message: error.response.data.Error.message,
        success_message: "",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-[80%] h-[60%] sm:w-[60%] lg:max-w-[800px]  lg:max-h-[500px]  flex ">
      <div className=" flex flex-col w-full h-full space-y-5  bg-white  items-center justify-between  p-5 py-20 rounded-xl lg:rounded-r-none ">
        <h1 className="font-sans text-xl">Hello,friend</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 w-3/4"
        >
          <InputForm
            name="name"
            type="text"
            placeholder="Name"
            register={register}
            icon="name"
            error={errors?.name?.message}
          />
          <InputForm
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            icon="email"
            error={errors?.email?.message}
          />
          <InputForm
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            icon="password"
            error={errors?.password?.message}
          />

          <button type="submit" className="signin_or_signup_button">
            {loading ? (
              <PulseLoader color="hsla(360, 100%, 100%, 1)" size={10} />
            ) : (
              <span>CREATE ACCOUNT</span>
            )}
          </button>
        </form>

        {error_message && <div className="text-red-600">{error_message}</div>}
        {success_message && (
          <div className="text-green-500">{success_message}</div>
        )}
        <div>
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-violet-600">
            Sign in
          </Link>
        </div>
      </div>
      <div className=" hidden lg:block bg-gradient-to-b from-violet-600 to-blue-700  w-1/2  text-white rounded-r-xl ">
        <div className="flex flex-col mt-32 space-y-4 w-60  mx-auto">
          <h1 className="font-allura text-6xl  font-bold text-center">
            fusion
          </h1>
          <img src="../../../login.svg"></img>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
