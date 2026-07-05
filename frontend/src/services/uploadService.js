import axios from "axios";

export const uploadImage = async (image) => {
  if (!image) return null;

  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.post(
    "http://127.0.0.1:5000/upload",
    formData
  );

  return response.data;
};