import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import { notifyError } from "../components/ToastUtils";
import Calendar from "./Calendar";

type appointmentProps = {
  appointment_id: string;
  transaction_title: string;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
};

function SubsidyPayoutPage() {
  //   const transactions = [{}, {}];
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
        transaction_title: "Subsidy",
        user_id: "",
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setAppointments(response.data.data);
        console.log(response.data.data);
      } else {
        notifyError("Can't Fetch Appointments");
      }
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
          <Calendar transaction_title={appointments[0].transaction_title} />
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

export default SubsidyPayoutPage;
