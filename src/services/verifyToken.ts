import axios from "axios";

export const verifyToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/verify-jwt",
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
