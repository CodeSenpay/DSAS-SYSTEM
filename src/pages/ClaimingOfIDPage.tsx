import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import Calendar from "./Calendar";

type appointmentProps = {
  appointment_id: string;
  transaction_title: string;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
};
function ClaimingOfIDPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<appointmentProps[]>([]);

  const handleClosingOfModal = () => {
    setIsOpen(false);
  };

  const handleAddingOfSchedule = () => {
    setIsOpen(true);
  };

  const fetchTransactionsByType = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAppointment",
      payload: {
        appointment_id: "",
        appointment_status: "",
        appointment_date: "",
        transaction_title: "Claiming og ID",
        user_id: "",
      },
    };

    try {
      const response = await axios.post("", data, {
        headers: { "Content-Type": "application/json" },
      });

      setAppointments(response.data.data);
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
        <h1>Schedule Your Claiming of ID</h1>
        <div className="w-screen flex flex-col justify-center items-center bg-amber-700">
          {appointments.length != 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.appointment_id} className="flex-1">
                <h1>Transaction: {appointment.transaction_title}</h1>
                <p>Appointment Date: {appointment.appointment_date}</p>
                <p>Status: {appointment.appointment_status}</p>
                <p>
                  Time: {appointment.start_time} - {appointment.end_time}
                </p>
              </div>
            ))
          ) : (
            <h1>No Appointments Yet</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default ClaimingOfIDPage;
