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

type transactionTypeProps = {
  transaction_type_id: number;
  transaction_title: string;
  transaction_details: string;
};

function ApproveTransactionPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState<
    transactionTypeProps[]
  >([]);

  // For search trigger
  const [searchType, setSearchType] = useState("all");
  const [searchDate, setSearchDate] = useState("");

  const handleApprove = (id: number) => {};

  const handleDecline = (id: number) => {};

  // Only filter when Search is clicked
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  const handleSearch = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAppointment",
      payload: {
        appointment_id: "",
        appointment_status: "Pending",
        appointment_date: selectedDate || "",
        transaction_title: selectedType || "",
        user_id: "",
      },
    };
    console.log(data);
    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/scheduling-system/admin",
    //     data,
    //     {
    //       headers: { "Content-Type": "application/json" },
    //       withCredentials: true,
    //     }
    //   );
    //   console.log(response.data);
    //   // setAppointments();
    // } catch (err) {
    //   console.log(err);
    // }
  };

  // Keep search fields in sync with filter fields
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSearchType(value);
  };
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setSearchDate(value);
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
      console.log(response.data.data);
      setTransactionTypes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Keep filteredAppointments in sync with appointments if appointments change
  // (e.g. after approve/decline)
  // But only for the last search
  // eslint-disable-next-line
  useEffect(() => {
    getTransactionTypes();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
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
                <TableCell className="font-semibold">Name</TableCell>
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
                  <TableRow key={appt}>
                    <TableCell className="capitalize">{appt}</TableCell>
                    <TableCell>{appt}</TableCell>
                    <TableCell>{appt}</TableCell>
                    <TableCell>{appt}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appt}
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
