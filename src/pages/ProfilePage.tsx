import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../components/ToastUtils";
import { useUser } from "../services/UserContext";

// Email regex for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userdata, setUser } = useUser();
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  // const [preview, setPreview] = useState<string | null>(null);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // --- Upload feature commented out below ---

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setPreview(URL.createObjectURL(file)); // Preview image
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!selectedFile) {
  //     alert("Please select a file first.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", selectedFile);

  //   // Also send the student_id
  //   if (userdata?.student_id) {
  //     formData.append("student_id", userdata.student_id);
  //   } else if (userdata?.student_details?.student_id) {
  //     formData.append("student_id", userdata.student_details.student_id);
  //   } else {
  //     notifyInfo("Student ID not found.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:5000/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (response.ok && data.success) {
  //       notifySuccess(data.message || "File uploaded successfully.");
  //       // Optionally reset file input and preview
  //       setSelectedFile(null);
  //       setPreview("");
  //     } else {
  //       notifyError(data.message || "Failed to upload file. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     notifyError("An error occurred during upload. Please try again.");
  //   }
  // };

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
            <Box className="flex flex-col items-center mb-6"></Box>
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
              {/* 
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="flex flex-col items-center gap-3 w-full"
              >
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-full w-36 h-36 mb-2 transition relative"
                  style={{
                    width: 144,
                    height: 144,
                    minWidth: 144,
                    minHeight: 144,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover rounded-full border-2 border-blue-400 shadow"
                        style={{
                          width: 136,
                          height: 136,
                          minWidth: 136,
                          minHeight: 136,
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "2px solid #60a5fa",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      />
                    ) : (
                      <AccountCircleIcon
                        sx={{ fontSize: 120, color: "#93c5fd" }}
                      />
                    )}
                  </span>
                  <span className="text-xs text-blue-500 mt-2 z-10">
                    Change Photo
                  </span>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="normal-case w-full"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: "none",
                  }}
                  disabled={!selectedFile}
                >
                  Upload Photo
                </Button>
              </form>
              */}
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
