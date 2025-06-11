import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="width-screen h-screen flex items-center justify-center">
      <CircularProgress color="success" size={"100px"} />
    </div>
  );
}
