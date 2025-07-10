import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { useUser } from "../services/UserContext";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "../components/ToastUtils";

// Email regex for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userdata, setUser } = useUser();
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  const handleEditClick = () => {
    setStudentEmail(userdata?.email || "");
    setEmailError("");
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentEmail(value);
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Only recall the user context after saving, do not reload the page
  const handleSave = async () => {
    // Validate email before proceeding
    if (!EMAIL_REGEX.test(studentEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    const data = {
      model: "schedulesModel",
      function_name: "updateStudentEmail",
      payload: {
        student_id: userdata?.student_id,
        student_email: studentEmail,
      },
    };
    setIsButtonLoading(true);
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/scheduling-system/user",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // Refetch user data and update context, do not reload the page
      try {
        const student_id = userdata?.student_id;
        const res = await axios.post(
          "http://localhost:5000/api/auth/get-user-data",
          { id: student_id },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setUser(res.data.data[0]);
        notifySuccess("Profile updated successfully!");
      } catch {
        notifyInfo("Profile updated, but failed to refresh user data.");
      }
      setIsModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        notifyError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update profile. Please try again."
        );
      } else if (err instanceof Error) {
        notifyError(
          err.message || "Failed to update profile. Please try again."
        );
      } else {
        notifyError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsButtonLoading(false);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsButtonLoading(false);
    setEmailError("");
  };

  return (
    <>
      {isLoading && <Loading />}
      <NavBar />
      <div
        style={{
          backgroundColor: "#f3f4f6",
          backgroundImage: `
        repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
        repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
      `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
          <Paper
            elevation={2}
            className="w-full max-w-md rounded-2xl shadow bg-white"
            style={{ padding: 20 }}
            sx={{ borderRadius: 4 }}
          >
            {/* Profile Header with Icon */}
            <Box className="flex flex-col items-center mb-4">
              <AccountCircleIcon sx={{ fontSize: 64, color: "#2563eb" }} />
              <Typography variant="h6" className="font-semibold mt-2">
                Student Profile
              </Typography>
            </Box>

            {/* Profile Info */}
            <Box className="flex flex-col gap-3 text-gray-700">
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Full Name:
                </Typography>
                <Typography variant="body2">
                  {userdata?.student_details?.student_name}
                </Typography>
              </Box>
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Student ID:
                </Typography>
                <Typography variant="body2">
                  {userdata?.student_details?.student_id}
                </Typography>
              </Box>
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body2">{userdata?.email}</Typography>
              </Box>
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Department:
                </Typography>
                <Typography variant="body2">
                  {userdata?.student_details?.college}
                </Typography>
              </Box>
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Program:
                </Typography>
                <Typography variant="body2">
                  {userdata?.student_details?.program}
                </Typography>
              </Box>
              <Box className="flex justify-start gap-3">
                <Typography variant="body2" color="text.secondary">
                  Sex:
                </Typography>
                <Typography variant="body2">
                  {userdata?.student_details?.sex}
                </Typography>
              </Box>
            </Box>

            {/* Edit Button */}

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              style={{ marginTop: 10 }}
              className="normal-case"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "none",
              }}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          </Paper>

          <Dialog
            open={isModalOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <Box className="flex flex-col gap-4 mt-2" style={{ padding: 20 }}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={userdata?.student_details?.student_name}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Student ID"
                  name="student_id"
                  value={userdata?.student_details?.student_id}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={studentEmail}
                  onChange={handleChange}
                  fullWidth
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  label="College Department"
                  name="college_department"
                  value={userdata?.student_details?.college}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Program / Course"
                  name="program"
                  value={userdata?.student_details?.program}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Sex"
                  name="sex"
                  value={userdata?.student_details?.sex}
                  fullWidth
                  disabled
                />
              </Box>
            </DialogContent>
            <DialogActions className="px-6 pb-4">
              <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                disabled={isButtonLoading || !!emailError}
                startIcon={
                  isButtonLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isButtonLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
                disabled={isButtonLoading}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
