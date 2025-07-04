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
import axios from "axios";
import React, { useState } from "react";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { useUser } from "../services/UserContext";

// type StudentDetailsProps = {
//   college: string;
//   major: string;
//   program: string;
//   school_year: string;
//   semester: string;
//   sex: string;
//   student_id: string;
//   student_name: string;
//   year_level: string;
// };

function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userdata } = useUser();
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentEmail(e.target.value);
  };

  const handleSave = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "updateStudentEmail",
      payload: {
        student_id: userdata?.student_id,
        student_email: studentEmail,
      },
    };
    console.log(data);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/user",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
                  value={userdata?.email}
                  onChange={handleChange}
                  fullWidth
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
