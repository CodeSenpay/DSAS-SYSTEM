import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../components/ToastUtils";

function LoginPage() {
  type dataProps = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<dataProps>();

  const navigate = useNavigate();

  const handleLogin: SubmitHandler<dataProps> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        data,
        { headers: { "Content-Type": "application/json" }, withCredentials: true}
      );
      console.log(response.data);
      notifySuccess(JSON.stringify(response.data));
    } catch (err) {
      console.log(err);
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
            className="w-full max-w-sm"
            {...register("email")}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
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
      </div>
    </div>
  );
}

export default LoginPage;
