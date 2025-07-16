import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../components/ToastUtils";
import apiClient from "../services/apiClient";

import { IconButton, InputAdornment } from "@mui/material";
import { useUser } from "../services/UserContext";
import { verifyToken } from "../services/verifyToken";

function LoginPageStudent() {
  type dataProps = {
    studentId: string;
    password: string;
    user_level: string;
  };

  const { register, handleSubmit } = useForm<dataProps>();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { userdata, setUser } = useUser();

  useEffect(() => {
    const checkToken = async () => {
      const result = await verifyToken();

      if (result?.success) {
        navigate("/dashboard");
      }
    };
    checkToken();
  }, [userdata, navigate]);

  const handleLogin: SubmitHandler<dataProps> = async (data) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/login-student", data, {
        headers: { "Content-Type": "application/json" },
      });

      notifySuccess("Login successful!");

      setUser(response.data.user);
      const userLevel = response.data?.user.user_level;
      if (userLevel === "STUDENT") {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        notifyError(
          error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again."
        );
      } else {
        notifyError(
          error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again."
        );
        // Do not open the modal for non-401 errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#f3f4f6",
        backgroundImage: `
        repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
        repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
      `,
        backgroundSize: "40px 40px",
      }}
    >
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
            {...register("studentId")}
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
          <Typography
            variant="body2"
            color="textSecondary"
            className="w-full text-center mb-2"
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              padding: "8px",
              fontStyle: "italic",
            }}
          >
            Hint: Your password is the same as your ARMS Portal password.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="w-full max-w-sm"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Logging in..." : "Login"}
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
