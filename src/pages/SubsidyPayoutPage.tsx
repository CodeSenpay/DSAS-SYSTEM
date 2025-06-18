import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import Calendar from "./Calendar";
function SubsidyPayoutPage() {
  //   const transactions = [{}, {}];
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClosingOfModal = () => {
    setIsOpen(false);
  };

  const handleAddingOfSchedule = () => {
    setIsOpen(true);
  };

  const fetchTransactionsByType = async () => {
    const data = {};
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactionsByType();
  }, []);

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
        <h1>Subsidy Payout Page</h1>
      </div>
    </>
  );
}

export default SubsidyPayoutPage;
