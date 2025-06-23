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

function ClearanceValidationPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<appointmentProps[]>([]);
  const [appointmentDates, setAppointmentDates] = useState<string[]>([]);

  const handleClosingOfModal = () => {
    setIsOpen(false);
  };

  const handleAddingOfSchedule = () => {
    setIsOpen(true);
  };

  const getAppointmentDates = (appointments: appointmentProps[]) => {
    const appointmentDates = appointments.map(
      (appointment) => appointment.appointment_date
    );

    setAppointmentDates(appointmentDates);
  };

  const fetchTransactionsByType = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAppointment",
      payload: {
        appointment_id: "",
        appointment_status: "",
        appointment_date: "",
        transaction_title: "Clearance",
        user_id: "",
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/user",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setAppointments(response.data.data);
        getAppointmentDates(response.data.data);
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
          <Calendar
            transaction_title="Clearance"
            alreadySelectedDates={appointmentDates}
          />
        </Modal>
      ) : (
        ""
      )}
      <div className="flex flex-col justify-center items-center h-[88.5%] gap-10 w-screen absolute">
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAddingOfSchedule}
          disabled={appointments.some((appointment) =>
            appointment.appointment_status.toLowerCase() === "approved"
              ? true
              : false
          )}
        >
          ADD SCHEDULE
        </Button>

        <div className="w-screen flex flex-col gap-5 justify-center items-center">
          {appointments.length !== 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="flex flex-col gap-3 p-6 m-3 bg-white rounded-xl shadow-lg w-full max-w-md transition-transform hover:scale-105"
                style={{ padding: "20px" }}
              >
                <h2 className="text-xl font-bold text-amber-800 mb-2">
                  {appointment.transaction_title}
                </h2>
                <div className="text-gray-800 space-y-1">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {appointment.appointment_date}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        appointment.appointment_status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {appointment.appointment_status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {appointment.start_time} - {appointment.end_time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-gray-500 text-xl mt-6">No Appointments Yet</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default ClearanceValidationPage;
