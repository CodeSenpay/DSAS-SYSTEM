import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError, notifyInfo } from "../components/ToastUtils";
import CustomModal from "../components/Modal.tsx";
import { useState } from "react";

function LoginPage() {
  type dataProps = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
  } = useForm<dataProps>();

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sendOtpToEmail: SubmitHandler<dataProps> = async (data) => {
    try {
      await axios.post(
        "http://localhost:5000/api/send-otp",
        data,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        notifyInfo(
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
        );
        openModal();
      } else {
        notifyError(
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
        );
        // Do not open the modal for non-401 errors
      }
      throw err;
    }
  };

  const handleLogin: SubmitHandler<dataProps> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        data,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log(response.data);
      notifySuccess("Login successful!");

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
        sendOtpToEmail(data);
        openModal();
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
  function maskEmail(email: string) {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    const maskedUser =
      user.length <= 2
        ? user[0] + "*".repeat(user.length - 1)
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
    return `${maskedUser}@${domain}`;
  }

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
            {...register("email")}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            required
            className="w-full max-w-sm"
            {...register("password")}
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
        <CustomModal
          isOpen={isModalOpen}
          handleClose={closeModal}
          backgroundColor="white">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Login Failed</h2>
            <p className="text-gray-700 mb-4">
              Please check your Email:{" "}
              <span className="font-semibold">
                {maskEmail(
                  (document.querySelector('input[name="email"]') as HTMLInputElement)?.value || "your email"
                )}
              </span>
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const otp = (e.currentTarget.elements.namedItem("otp") as HTMLInputElement)?.value;
                const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
                try {
                  // Send both OTP and email as JSON payload
                  const res = await axios.post(
                  "http://localhost:5000/api/verify-otp",
                  { otp, email },
                  { headers: { "Content-Type": "application/json" }, withCredentials: true }
                  );
                  notifySuccess("OTP verified!");
                  closeModal();
                  // Automatically log in after OTP verification
                  await handleLogin({ email, password: (document.querySelector('input[name="password"]') as HTMLInputElement)?.value });
                } catch (err: any) {
                  notifyError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "OTP verification failed."
                  );
                }
              }}
            >
              <TextField
                label="Enter OTP"
                name="otp"
                variant="outlined"
                required
                className="w-full"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="w-full"
              >
                Submit OTP
              </Button>
            </form>
            <Button
              variant="outlined"
              color="secondary"
              onClick={closeModal}
              className="w-full mt-2"
            >
              Close
            </Button>
          </div>
        </CustomModal>
      </div>
    </div>
  );
}

export default LoginPage;
