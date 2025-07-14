import apiClient from "./apiClient";
export const fetchShoolYear = async () => {
  try {
    const response = await apiClient.get("/utility/school-year", {
      headers: { "Content-Type": "application/json" },
    });

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
    const response = await apiClient.get("/utility/semester", {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      return "No Semester Fetch";
    } else {
      return "Failed to Fetch Semester";
    }
  }
};

export const fetchTotalSlots = async () => {
  try {
  } catch (err) {
    console.log(err);
  }
};

export const fetchPendingAppointments = async () => {
  try {
  } catch (err) {
    console.log(err);
  }
};
