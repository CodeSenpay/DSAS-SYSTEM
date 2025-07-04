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
} from "@mui/material";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "John Michael Doe",
    student_id: "2023123456",
    email: "john@example.com",
    college_department: "College of Engineering",
    program: "BS Computer Science",
    sex: "Male",
  });

  const [form, setForm] = useState(profile);

  const handleEditClick = () => {
    setForm(profile);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(form);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body2">{profile.full_name}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body2">{profile.student_id}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">{profile.email}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body2">
                  {profile.college_department}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Program
                </Typography>
                <Typography variant="body2">{profile.program}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" color="text.secondary">
                  Sex
                </Typography>
                <Typography variant="body2">{profile.sex}</Typography>
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
                  value={form.full_name}
                  onChange={handleChange}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Student ID"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="College Department"
                  name="college_department"
                  value={form.college_department}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Program / Course"
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Sex"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions className="px-6 pb-4">
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
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
