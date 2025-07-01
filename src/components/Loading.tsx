import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="width-screen h-screen flex items-center justify-center bg-transparent">
      <CircularProgress color="warning" size={"100px"} />
    </div>
  );
}
