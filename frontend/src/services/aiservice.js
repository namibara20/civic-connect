import axios from "axios";

const API_URL = "https://civicconnect-backend-qxeh.onrender.com";

export const improveComplaint = async (description) => {
  const response = await axios.post(
    `${API_URL}/improve-description`,
    {
      description,
    }
  );

  return response.data;
};