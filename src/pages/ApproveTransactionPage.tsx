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
const dummyAppointments = [
  {
    id: 1,
    type: "enrollment",
    date: "2025-06-10",
    day: "Monday",
    name: "John Doe",
    details: "Enrollment for Math 101",
    status: "pending",
  },
  {
    id: 2,
    type: "payment",
    date: "2025-06-11",
    day: "Tuesday",
    name: "Jane Smith",
    details: "Payment for Tuition",
    status: "pending",
  },
  {
    id: 3,
    type: "consultation",
    date: "2025-06-10",
    day: "Monday",
    name: "Alice Brown",
    details: "Consultation with Advisor",
    status: "pending",
  },
];

type transactionTypeProps = {
  transaction_type_id: number;
  transaction_title: string;
  transaction_details: string;
};

function ApproveTransactionPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState(dummyAppointments);
  const [transactionType, setTransactionType] = useState("");
  const [transactionTypes, setTransactionTypes] = useState<
    transactionTypeProps[]
  >([]);

  // For search trigger
  const [searchType, setSearchType] = useState("all");
  const [searchDate, setSearchDate] = useState("");

  const handleApprove = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "approved" } : appt
      )
    );
  };

  const handleDecline = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "declined" } : appt
      )
    );
  };

  // Only filter when Search is clicked
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  const handleSearch = () => {
    const filtered = appointments.filter((appt) => {
      const matchType = searchType === "all" || appt.type === searchType;
      const matchDate = !searchDate || appt.date === searchDate;
      return matchType && matchDate;
    });
    setFilteredAppointments(filtered);
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
    handleSearch();
    // eslint-disable-next-line
  }, [appointments]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Paper elevation={3} className="p-8 rounded-xl bg-white shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
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
                  <TableRow key={appt.id}>
                    <TableCell className="capitalize">{appt.type}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.name}</TableCell>
                    <TableCell>{appt.details}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {appt.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<Check />}
                            onClick={() => handleApprove(appt.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Close />}
                            onClick={() => handleDecline(appt.id)}
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
