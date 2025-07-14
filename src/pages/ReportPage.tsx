import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const API_URL = "http://localhost:5000/api/scheduling-system/admin";

const appointmentStatuses = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const semesters = [
  { value: "", label: "All" },
  { value: "1st", label: "1st Semester" },
  { value: "2nd", label: "2nd Semester" },
  { value: "midyear", label: "Midyear" },
];

function ReportPage() {
  // Filter states
  const [date, setDate] = useState<Dayjs | null>(null);
  const [transactionTypes, setTransactionTypes] = useState<
    {
      transaction_type_id: number;
      transaction_title: string;
      transaction_details: string;
    }[]
  >([]);
  const [transactionTypeId, setTransactionTypeId] = useState<string>("");
  const [appointmentStatus, setAppointmentStatus] = useState<string>("");
  const [schoolYear, setSchoolYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  // Data states
  type Appointment = {
    id: number;
    student_id: number;
    transaction_type_id: number;
    appointment_status: string;
    appointment_date: string;
    [key: string]: unknown; // Use unknown instead of any for better type safety
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Ref for print area
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch transaction types for filter dropdown
  useEffect(() => {
    async function fetchTransactionTypes() {
      try {
        const res = await axios.post(
          API_URL,
          {
            model: "schedulesModel",
            function_name: "getTransactionType",
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (res.data?.data) {
          // The API returns transaction_type_id, transaction_title, transaction_details
          setTransactionTypes(res.data.data);
        }
      } catch {
        // fallback: empty
        setTransactionTypes([]);
      }
    }
    fetchTransactionTypes();
  }, []);

  // Generate school year options (e.g., 2022-2023, 2023-2024, ...)
  const getSchoolYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 1; i >= currentYear - 5; i--) {
      years.push(`${i - 1}-${i}`);
    }
    return [
      { value: "", label: "All" },
      ...years.map((y) => ({ value: y, label: y })),
    ];
  };

  // Fetch appointments with filters
  const fetchReports = async () => {
    setLoading(true);
    setFetchError(null);
    setAppointments([]);
    try {
      // Always send all params, even if empty
      const payload: {
        school_year: string;
        semester: string;
        date: string;
        transaction_type_id: string;
        appointment_status: string;
        status: string; // <-- added status
      } = {
        school_year: schoolYear || "",
        semester: semester || "",
        date: date ? dayjs(date).format("YYYY-MM-DD") : "",
        transaction_type_id: transactionTypeId || "",
        appointment_status: appointmentStatus || "",
        status: appointmentStatus || "", // <-- add status, using appointmentStatus as value
      };

      const res = await axios.post(
        API_URL,
        {
          model: "schedulesModel",
          function_name: "generateReport",
          payload,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.data && Array.isArray(res.data.data)) {
        setAppointments(res.data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      let errorMsg = "Failed to fetch reports. Please try again.";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.error || err.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setFetchError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // UX: fetch on mount with no filters (show all)
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  // UX: handle filter submit
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  // UX: handle reset
  const handleReset = () => {
    setDate(null);
    setTransactionTypeId("");
    setAppointmentStatus("");
    setSchoolYear("");
    setSemester("");
    fetchReports();
  };

  // Print handler
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=650");
    if (printWindow) {
      printWindow.document.writeln(`
        <html>
          <head>
            <title>Appointment Reports</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 24px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
              th { background: #f5f5f5; }
              .print-header { text-align: center; margin-bottom: 24px; }
              .print-meta { margin-bottom: 16px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h2>Appointment Reports</h2>
            </div>
            <div class="print-meta">
              <strong>Filters:</strong>
              ${date ? `Date: ${dayjs(date).format("YYYY-MM-DD")}; ` : ""}
              ${
                transactionTypeId
                  ? `Transaction Type: ${
                      transactionTypes.find(
                        (t) =>
                          String(t.transaction_type_id) ===
                          String(transactionTypeId)
                      )?.transaction_title || transactionTypeId
                    }; `
                  : ""
              }
              ${
                appointmentStatus
                  ? `Status: ${
                      appointmentStatuses.find(
                        (s) => s.value === appointmentStatus
                      )?.label || appointmentStatus
                    }; `
                  : ""
              }
              ${schoolYear ? `School Year: ${schoolYear}; ` : ""}
              ${
                semester
                  ? `Semester: ${
                      semesters.find((s) => s.value === semester)?.label ||
                      semester
                    }; `
                  : ""
              }
            </div>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Appointment Reports
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={handleFilter}>
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={setDate}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: { fullWidth: true, size: "small" },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={transactionTypeId}
                    label="Transaction Type"
                    onChange={(e) => setTransactionTypeId(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
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
              </Grid>
              <Grid size={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={appointmentStatus}
                    label="Status"
                    onChange={(e) => setAppointmentStatus(e.target.value)}
                  >
                    {appointmentStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={1.6}>
                <FormControl fullWidth size="small">
                  <InputLabel>School Year</InputLabel>
                  <Select
                    value={schoolYear}
                    label="School Year"
                    onChange={(e) => setSchoolYear(e.target.value)}
                  >
                    {getSchoolYearOptions().map((sy) => (
                      <MenuItem key={sy.value} value={sy.value}>
                        {sy.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={semester}
                    label="Semester"
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {semesters.map((sem) => (
                      <MenuItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid sx={{ display: "flex", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
              Results
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={appointments.length === 0 || loading}
              sx={{ ml: 2, mb: 1 }}
            >
              Print
            </Button>
          </Box>
          <div ref={printRef}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
              >
                <CircularProgress />
              </Box>
            ) : fetchError ? (
              <Typography color="error">{fetchError}</Typography>
            ) : appointments.length === 0 ? (
              <Typography>
                No appointments found for the selected filters.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Time Frame</TableCell>
                      <TableCell align="center">Transaction Type</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">School Year</TableCell>
                      <TableCell align="center">Semester</TableCell>
                      <TableCell align="center">Student</TableCell>
                      <TableCell align="center">College</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt, idx) => (
                      <TableRow
                        key={String(
                          appt["appointment_id"] ?? appt["id"] ?? idx
                        )}
                      >
                        <TableCell align="center">
                          {"appointment_date" in appt && appt.appointment_date
                            ? dayjs(appt.appointment_date).format("YYYY-MM-DD")
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {"time_frame" in appt
                            ? (appt.time_frame as string) || "-"
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {"transaction_title" in appt
                            ? (appt.transaction_title as string) || "-"
                            : // fallback for legacy data
                              "transaction_type" in appt
                              ? (appt.transaction_type as string) || "-"
                              : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            const status =
                              "appointment_status" in appt &&
                              appt.appointment_status
                                ? (appt.appointment_status as string)
                                : null;
                            // Map status to MUI color codes
                            let color: string | undefined;
                            switch (status?.toLowerCase()) {
                              case "approved":
                                color = "#2e7d32"; // MUI green[800]
                                break;
                              case "pending":
                                color = "#ed6c02"; // MUI orange[800]
                                break;
                              case "declined":
                              case "cancelled":
                                color = "#d32f2f"; // MUI red[700]
                                break;
                              case "completed":
                                color = "#0288d1"; // MUI blue[700]
                                break;
                              default:
                                color = undefined;
                            }
                            return (
                              <span style={color ? { color } : undefined}>
                                {status
                                  ? status.charAt(0).toUpperCase() +
                                    status.slice(1)
                                  : "-"}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          {"school_year" in appt
                            ? (appt.school_year as string) || "-"
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {"semester" in appt
                            ? (appt.semester as string) || "-"
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {("user_name" in appt &&
                            typeof appt.student_name === "string" &&
                            appt.student_name) ||
                            ("student_name" in appt &&
                              typeof appt.student_name === "string" &&
                              appt.student_name) ||
                            ("faculty_name" in appt &&
                              typeof appt.faculty_name === "string" &&
                              appt.faculty_name) ||
                            "-"}
                        </TableCell>
                        <TableCell align="center">
                          {"college" in appt && typeof appt.college === "string"
                            ? appt.college.split(" -")[0] || " -"
                            : " -"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ReportPage;
