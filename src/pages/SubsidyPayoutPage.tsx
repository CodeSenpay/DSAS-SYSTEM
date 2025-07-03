import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import { notifyError } from "../components/ToastUtils";
import { useUser } from "../services/UserContext";
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
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<appointmentProps[]>([]);
  const [appointmentDates, setAppointmentDates] = useState<string[]>([]);
  const { userdata } = useUser();
  const handleClosingOfModal = () => {
    setIsOpenCalendar(false);
  };

  const handleAddingOfSchedule = () => {
    setIsOpenCalendar(true);
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
        transaction_type_id: 2,
        user_id: userdata?.student_id,
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
  }, [isOpenCalendar]);

  return (
    <>
      <NavBar />
      {isOpenCalendar ? (
        <Modal
          isOpen={isOpenCalendar}
          handleClose={handleClosingOfModal}
          backgroundColor=""
        >
          <Calendar
            transaction_title="Subsidy"
            alreadySelectedDates={appointmentDates}
            setIsOpenCalendar={setIsOpenCalendar}
          />
        </Modal>
      ) : (
        ""
      )}
      <div
        className="flex flex-col justify-center items-center h-[100%] w-full gap-5 absolute "
        style={{ padding: "20px" }}
      >
        {appointments.length !== 0 ? (
          appointments[0]?.appointment_status.toLowerCase() === "declined" ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6 mb-4 max-w-md w-full border border-red-400">
              <AddCircleIcon
                className="text-red-700 mb-2"
                style={{ fontSize: 40 }}
              />
              <h1 className="text-lg font-semibold text-red-800 mb-1 text-center">
                Appointment Declined
              </h1>
              <p className="text-gray-600 text-center">
                Try to schedule another date
              </p>
            </div>
          ) : appointments[0]?.appointment_status.toLowerCase() ===
            "approved" ? (
            <div className="flex flex-col items-center justify-center bg-green-50 rounded-xl shadow-md p-6 mb-4 max-w-md w-full border border-green-200 animate-fade-in">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="white"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-green-700 mb-1 text-center">
                Appointment Approved!
              </h1>
              <p className="text-gray-700 text-center">
                Your subsidy payout appointment has been approved.
                <br />
                Please check the details below and arrive on time.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6 mb-4 max-w-md w-full border border-amber-200">
              <AddCircleIcon
                className="text-amber-500 mb-2"
                style={{ fontSize: 40 }}
              />
              <h1 className="text-lg font-semibold text-amber-800 mb-1 text-center">
                Appointment Already Set
              </h1>
              <p className="text-gray-600 text-center">
                Please wait for your appointment to be approved.
              </p>
            </div>
          )
        ) : (
          ""
        )}
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAddingOfSchedule}
          disabled={
            appointments.length !== 0 ||
            appointments.some((appointment) =>
              appointment.appointment_status.toLowerCase() === "approved"
                ? true
                : false
            )
          }
        >
          ADD SCHEDULE
        </Button>

        <div className="w-screen flex flex-col justify-center items-center gap-5 overflow-y-auto px-4 md:px-16 lg:px-32">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="flex flex-col gap-3 p-6 m-3 bg-white rounded-xl shadow-lg w-full max-w-md transition-transform hover:scale-105 hover:cursor-pointer"
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
                        appointment.appointment_status.toLowerCase() ===
                        "approved"
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

export default SubsidyPayoutPage;
