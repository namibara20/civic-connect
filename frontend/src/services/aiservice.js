import axios from "axios";

export const improveComplaint = async (description) => {
  const response = await axios.post(
    "http://127.0.0.1:5000/improve-description",
    {
      description,
    }
  );

  return response.data;
};