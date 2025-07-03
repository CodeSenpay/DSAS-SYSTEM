import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { notifyInfo, notifySuccess } from "../components/ToastUtils";
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
    console.log("Form Data:", data);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        data
      );

      console.log("Response:", response.data);
      if (response.data.success) {
        notifySuccess(response.data.message);
      } else {
        notifyInfo(response.data.message);
      }

      reset();
    } catch {}
  };

  return (
    <div
      className=" flex items-center justify-center bg-gray-50"
      style={{ paddingLeft: 16, paddingRight: 16 }}
    >
      <div
        className="w-full max-w-md bg-white shadow-md rounded-2xl"
        style={{ padding: 32 }}
      >
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Typography variant="h5" className="font-semibold text-gray-800">
            Admin Registration
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-500"
            style={{ marginTop: 4 }}
          >
            Create a new admin account
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
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

          <div className="flex gap-3">
            <TextField
              label="First Name"
              variant="outlined"
              size="small"
              fullWidth
              {...register("first_name", {
                required: "First name is required",
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              size="small"
              fullWidth
              {...register("last_name", { required: "Last name is required" })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          </div>

          <TextField
            label="Middle Name"
            variant="outlined"
            size="small"
            fullWidth
            {...register("middle_name")}
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            style={{ marginTop: 8 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAdminPage;
