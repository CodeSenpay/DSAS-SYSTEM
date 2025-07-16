import React, { useState } from "react";
import apiClient from "../services/apiClient.js";
import { notifyError, notifySuccess } from "../components/ToastUtils.js";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ManageAdminPasswords: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/scheduling-system/admin", {
        model: "schedulesModel",
        function_name: "updateAdminPassword",
        payload: {
          admin_email: adminEmail,
          new_password: newPassword,
        },
      });
      if (response.data?.data?.success) {
        notifySuccess("Password updated successfully!");
        setAdminEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        notifyError(
          response.data?.data?.message || "Failed to update password"
        );
      }
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        notifyError(
          errorObj.response?.data?.message ||
            errorObj.message ||
            "Error updating password"
        );
      } else if (err && typeof err === "object" && "message" in err) {
        notifyError(
          (err as { message?: string }).message || "Error updating password"
        );
      } else {
        notifyError("Error updating password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        width: "100%",
        margin: "48px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          background: "#fafbfc",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          align="center"
          sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
        >
          Manage Admin Passwords
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            id="adminEmail"
            label="Admin Email"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            placeholder="Enter admin email"
            variant="outlined"
          />
          <TextField
            id="newPassword"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            placeholder="Enter new password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                    size="large"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            placeholder="Re-enter new password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    size="large"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 2,
              boxShadow: 1,
            }}
            fullWidth
            startIcon={
              loading ? <CircularProgress size={22} color="inherit" /> : null
            }
          >
            {loading ? "Updating..." : "Reset/Change Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManageAdminPasswords;
