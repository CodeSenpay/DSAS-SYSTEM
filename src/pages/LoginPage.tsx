import { Button, TextField } from "@mui/material";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <form
          className="flex flex-col justify-center items-center gap-4"
          style={{ padding: "30px" }}
        >
          <img
            src="../../public/LogoPNG.png"
            alt="logo"
            className="w-20 h-20"
          />
          <TextField
            label="Student ID"
            variant="outlined"
            type="text"
            className="w-full max-w-sm"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            className="w-full max-w-sm"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="w-full max-w-sm"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
