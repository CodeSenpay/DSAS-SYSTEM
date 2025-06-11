import { Button } from "@mui/material";

export default function DashboardPage() {
  return (
    <div className="max-w-screen h-screen bg-[#f0f2f5] flex flex-col gap-4 items-center justify-start">
      <div className="w-full h-70 flex flex-col items-center justify-center gap-2">
        <img
          src="../../public/LogoPNG.png"
          alt="logo"
          className=" h-35 w-35 mt-50"
        />

        <h1 className="text-3xl">Welcome User!</h1>
      </div>
      <div className=" w-full flex justify-center items-start">
        <Button variant="contained" color="success" className="w-1/3">
          SCHEDULE HERE
        </Button>
      </div>
    </div>
  );
}
