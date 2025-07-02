import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../components/ToastUtils";

import { IconButton, InputAdornment } from "@mui/material";

function LoginPageStudent() {
  type dataProps = {
    student_id: string;
    password: string;
    user_level: string;
  };

  const { register, handleSubmit } = useForm<dataProps>();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Extracts only safe user data for session storage (no password).
   */
  function extractSafeUserData(user: any) {
    if (!user) return {};
    const {
      student_id,
      user_id,
      last_name,
      first_name,
      user_level,
      middle_name,
      mobile_number,
    } = user;
    return {
      student_id,
      user_id,
      last_name,
      first_name,
      user_level,
      middle_name,
      mobile_number,
    };
  }

  const handleLogin: SubmitHandler<dataProps> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login-student",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      notifySuccess("Login successful!");

      sessionStorage.setItem(
        "user",
        JSON.stringify(extractSafeUserData(response.data.user))
      );

      const userLevel = response.data?.user.user_level;
      if (userLevel === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (userLevel === "STUDENT") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err.response?.status);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        notifyInfo(
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
        );
      } else {
        notifyError(
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
        );
        // Do not open the modal for non-401 errors
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <form
          className="flex flex-col justify-center items-center gap-4"
          style={{ padding: "30px" }}
          onSubmit={handleSubmit(handleLogin)}
        >
          <img src="/LogoPNG.png" alt="logo" className="w-20 h-20" />
          <h1 className="text-2xl font-bold mb-4">DSASSchedule-System</h1>
          <TextField
            label="Student ID"
            variant="outlined"
            type="text"
            required
            className="w-full max-w-sm"
            {...register("student_id")}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            required
            className="w-full max-w-sm"
            {...register("password")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="w-full max-w-sm"
          >
            Login
          </Button>

          <p className="text-md text-blue-600">
            <i>Develop By:</i> Robert Mayo/Marklan
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPageStudent;
