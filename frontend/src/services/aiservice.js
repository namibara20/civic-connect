import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const improveComplaint = async (description) => {
  const response = await axios.post(
    `${API}/improve-description`,
    {
      description,
    }
  );

  return response.data;
};