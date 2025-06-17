import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import Calendar from "./Calendar";
function ClearanceValidationPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClosingOfModal = () => {
    setIsOpen(false);
  };

  const handleAddingOfSchedule = () => {
    setIsOpen(true);
  };

  return (
    <>
      <NavBar />
      {isOpen ? (
        <Modal isOpen={isOpen} handleClose={handleClosingOfModal}>
          <Calendar />
        </Modal>
      ) : (
        ""
      )}
      <div className="flex flex-col justify-center items-center h-[88.5%] w-screen absolute">
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAddingOfSchedule}
        >
          ADD SCHEDULE
        </Button>
        <h1>Schedule Your Clearance Now!</h1>
      </div>
    </>
  );
}

export default ClearanceValidationPage;
