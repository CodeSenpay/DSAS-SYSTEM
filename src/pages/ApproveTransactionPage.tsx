import { Check, Close, Search } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import { notifyError, notifySuccess } from "../components/ToastUtils";
import { useUser } from "../services/UserContext";

type transactionTypeProps = {
  transaction_type_id: number;
  transaction_title: string;
  transaction_details: string;
};

type appointmentProps = {
  student_email: string;
  appointment_id: string;
  transaction_title: string;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
  user_id: string;
};

function ApproveTransactionPage() {
  const [selectedType, setSelectedType] = useState<number>();
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userdata } = useUser();
  const [transactionTypes, setTransactionTypes] = useState<
    transactionTypeProps[]
  >([]);

  const handleApprove = (data: appointmentProps) => {
    const dataPayload = {
      model: "schedulesModel",
      function_name: "approveAppointment",
      payload: {
        user_id: userdata?.user_id,
        appointment_id: data.appointment_id,
        appointment_status: "Approved",
        student_email: data.student_email,
      },
    };

    setIsLoading(true);
    axios
      .post("http://localhost:5000/api/scheduling-system/admin", dataPayload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          notifySuccess("Appointment approved successfully.");
          handleSearch();
        } else {
          notifyError("Failed to approve appointment.");
        }
      })
      .catch((err) => {
        console.error(err);
        notifyError("An error occurred while approving the appointment.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDecline = async (data: appointmentProps) => {
    setIsLoading(true);
    const payload = {
      model: "schedulesModel",
      function_name: "approveAppointment",
      payload: {
        appointment_id: data.appointment_id,
        user_id: userdata?.user_id,
        appointment_status: "Declined",
        student_email: data.student_email,
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/admin",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        notifySuccess("Appointment declined successfully.");
        handleSearch();
      } else {
        notifyError("Failed to decline appointment.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Only filter when Search is clicked
  const [filteredAppointments, setFilteredAppointments] = useState<
    appointmentProps[]
  >([]);

  const handleSearch = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAppointment",
      payload: {
        appointment_id: "",
        appointment_status: "Pending",
        appointment_date: selectedDate || "",
        transaction_type_id: selectedType || "",
        user_id: "",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/admin",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setFilteredAppointments(response.data.data);
      // setAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  // Keep search fields in sync with filter fields
  const handleTypeChange = (value: number) => {
    setSelectedType(value);
  };
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  const getTransactionTypes = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getTransactionType",
      payload: {},
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/admin",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setTransactionTypes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSearch();
    getTransactionTypes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {isLoading && <Loading />}
      <Paper
        elevation={3}
        className="p-8 rounded-xl bg-white shadow-lg"
        style={{ padding: "20px" }}
      >
        <h1
          className="text-3xl font-bold text-gray-800"
          style={{ marginBottom: "20px" }}
        >
          Approve Appointments
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="type-label">Transaction Type</InputLabel>
            <Select
              labelId="type-label"
              value={selectedType}
              label="Transaction Type"
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <MenuItem value={""}>ALL</MenuItem>
              {transactionTypes.map((type) => (
                <MenuItem
                  key={type.transaction_type_id}
                  value={type.transaction_type_id}
                >
                  {type.transaction_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Search
          </Button>
        </div>
        <Paper className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Type</TableCell>
                <TableCell className="font-semibold">Date</TableCell>
                <TableCell className="font-semibold">User ID</TableCell>
                <TableCell className="font-semibold">Details</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appt) => (
                  <TableRow key={appt.appointment_id}>
                    <TableCell className="capitalize">
                      {appt.transaction_title}
                    </TableCell>
                    <TableCell>{appt.appointment_date}</TableCell>
                    <TableCell>{appt.user_id}</TableCell>
                    <TableCell>{appt.transaction_title}</TableCell>
                    {/* Hidden cell for student_email */}
                    <TableCell style={{ display: "none" }}>
                      {appt.student_email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.appointment_status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.appointment_status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appt.appointment_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {appt ? (
                        <div className="flex gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<Check />}
                            onClick={() => handleApprove(appt)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Close />}
                            onClick={() => handleDecline(appt)}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
    </div>
  );
}

export default ApproveTransactionPage;
