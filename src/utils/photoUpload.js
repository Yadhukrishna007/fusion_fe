import axios from "axios";
const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;
export const photoUpload = async (fileDefault) => {
  let formData = new FormData();
  formData.append("upload_preset", cloud_secret);
  formData.append("file", fileDefault);
  try {
    let res = await uploadToCloudinary(formData);
    return res;
  } catch (error) {
    throw error;
  }
};

const uploadToCloudinary = async (formData) => {
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
      formData
    );
    return data;
  } catch (error) {
    throw error;
  }
};
