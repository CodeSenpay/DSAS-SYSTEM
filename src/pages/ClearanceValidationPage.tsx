import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import NavBar from "../components/NavBar";
function ClearanceValidationPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center h-[88.5%] w-screen absolute">
        <Button variant="contained" startIcon={<AddCircleIcon />}>
          ADD SCHEDULE
        </Button>
        <h1>Schedule Your Clearance Now!</h1>
      </div>
    </>
  );
}

export default ClearanceValidationPage;
