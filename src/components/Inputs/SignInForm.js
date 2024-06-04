import { ErrorMessage, useField } from "formik";
import {
  MdMarkEmailUnread,
  FaRegCircleUser,
  RiLockPasswordFill,
} from "../../icons";

const SignInForm = ({ icon, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-full px-6 py-2 flex space-x-2 items-center w-full   box_shadow ">
        <div className="text-2xl fill-violet-700">
          {icon == "name" ? (
            <FaRegCircleUser className="svg_color" />
          ) : icon == "email" ? (
            <MdMarkEmailUnread className="svg_color" />
          ) : icon == "password" ? (
            <RiLockPasswordFill className="svg_color" />
          ) : (
            ""
          )}
        </div>

        <input
          className=" w-full  outline-none"
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          {...field}
          {...props}
        />
      </div>

      {meta.touched && meta.error && (
        <div className="text-red-600 text-center ">
          <ErrorMessage name={field.name} />
        </div>
      )}
    </div>
  );
};

export default SignInForm;
