import {
  MdMarkEmailUnread,
  FaRegCircleUser,
  RiLockPasswordFill,
} from "../../icons";
export default function InputForm({
  name,
  type,
  placeholder,
  register,
  error,
  icon,
}) {
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
          className="w-full  outline-none"
          type={type}
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
