import axios from "axios";

const API_URL = "https://provinces.open-api.vn/api/v2/";

export const getProvinces = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};
