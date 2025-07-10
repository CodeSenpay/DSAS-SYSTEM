import axios from "axios";

export const fetchShoolYear = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/utility/school-year",
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      return "No School Year Fetch";
    } else {
      return "Failed to fetch school year";
    }
  }
};

export const fetchSemester = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/utility/semester",
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      return "No Semester Fetch";
    } else {
      return "Failed to Fetch Semester";
    }
  }
};
