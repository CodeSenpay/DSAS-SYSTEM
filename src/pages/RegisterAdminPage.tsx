import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
type AdminForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  mobile_number: string;
};

function RegisterAdminPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdminForm>();

  const onSubmit = async (data: AdminForm) => {
    try {
      // Replace with your API endpoint
      await axios.post("/api/admin/register", data);
      alert("Registration successful!");
      reset();
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Paper elevation={3} className="w-full max-w-md p-8 rounded-2xl">
        <Typography variant="h5" align="center" gutterBottom color="primary">
          Admin Registration
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            size="small"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            {...register("first_name", { required: "First name is required" })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />

          <TextField
            label="Middle Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            {...register("middle_name")}
          />

          <TextField
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            {...register("last_name", { required: "Last name is required" })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />

          <TextField
            label="Mobile Number"
            type="tel"
            fullWidth
            variant="outlined"
            size="small"
            {...register("mobile_number", {
              required: "Mobile number is required",
            })}
            error={!!errors.mobile_number}
            helperText={errors.mobile_number?.message}
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register Admin"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
}

export default RegisterAdminPage;
