import {
  Add as AddIcon,
  Event as EventIcon,
  Save as SaveIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../components/ToastUtils";
import { useUser } from "../services/UserContext";
import apiClient from "../services/apiClient";

type transactionTypeProps = {
  transaction_type_id: number;
  transaction_title: string;
  transaction_details: string;
};

type TimeWindow = {
  time_window_id: number;
  availability_date: string;
  start_time_am: string;
  end_time_am: string;
  start_time_pm: string;
  end_time_pm: string;
  capacity_per_day: number;
  total_slots_left: number;
};

type Availability = {
  availability_id: number;
  transaction_title: string;
  transaction_type_id: number;
  start_date: string;
  end_date: string;
  created_by: number;
  created_at: string;
  time_windows: TimeWindow[];
};

type TimeRange = {
  date: string;
  amStart: string;
  amEnd: string;
  pmStart: string;
  pmEnd: string;
  time_window_id?: number;
};

type CollegeDeparmentsProps = {
  college: string;
  college_name: string;
};

const API_URL = "/scheduling-system/admin";

function AddAvailability() {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [transactionType, setTransactionType] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");

  const { semester, schoolYear } = useUser();
  const [collegeDepartments, setCollegeDepartments] = useState<
    CollegeDeparmentsProps[]
  >([]);
  const [transactionTypes, setTransactionTypes] = useState<
    transactionTypeProps[]
  >([]);
  const [dateRange, setDateRange] = useState<{
    start: Dayjs | null;
    end: Dayjs | null;
  }>({
    start: null,
    end: null,
  });

  const [capacity, setCapacity] = useState(15);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [existingAvailabilities, setExistingAvailabilities] = useState<
    Availability[]
  >([]);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);

  const [clearanceSelected, setClearanceSelected] = useState<boolean>(false);

  const getDatesInRange = (start: Dayjs, end: Dayjs) => {
    const dates = [];
    const current = new Date(start.toDate());
    const last = new Date(end.toDate());

    while (current <= last) {
      dates.push(current.toLocaleDateString("en-CA"));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const fetchCollegeDepartments = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getCollegeDeparments",
    };
    try {
      const response = await apiClient.post(
        "/jrmsu/college-departments",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setCollegeDepartments(response.data.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(
          "An unknown error occurred while fetching college departments."
        );
      }
    }
  };

  const handleSetTimeRanges = () => {
    if (dateRange.start && dateRange.end) {
      const dates = getDatesInRange(dateRange.start, dateRange.end);

      setTimeRanges(
        dates.map((date) => ({
          date,
          amStart: "08:00",
          amEnd: "12:00",
          pmStart: "13:00",
          pmEnd: "17:00",
        }))
      );
    }
  };

  const handleTimeChange = (
    idx: number,
    field: "amStart" | "amEnd" | "pmStart" | "pmEnd",
    value: string
  ) => {
    setTimeRanges((prev) =>
      prev.map((tr, i) => (i === idx ? { ...tr, [field]: value } : tr))
    );
  };

  const fetchExistingAvailabilities = async (transactionTypeID: number) => {
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: { searchkey: transactionTypeID },
    };
    try {
      const response = await apiClient.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        setExistingAvailabilities(response.data.data);
      } else {
        notifyError("Failed to fetch existing availabilities.");
      }
    } catch (err) {
      console.log(err);
      notifyError("An error occurred while fetching existing availabilities.");
    }
  };

  useEffect(() => {
    if (mode === "edit" && transactionType) {
      fetchExistingAvailabilities(Number(transactionType));
    }
  }, [mode, transactionType]);

  useEffect(() => {
    if (selectedAvailability) {
      setDateRange({
        start: dayjs(selectedAvailability.start_date),
        end: dayjs(selectedAvailability.end_date),
      });
      setCapacity(selectedAvailability.time_windows[0].capacity_per_day);
      setTimeRanges(
        selectedAvailability.time_windows.map((tw) => ({
          date: tw.availability_date,
          amStart: tw.start_time_am.slice(0, 5),
          amEnd: tw.end_time_am.slice(0, 5),
          pmStart: tw.start_time_pm.slice(0, 5),
          pmEnd: tw.end_time_pm.slice(0, 5),
          time_window_id: tw.time_window_id,
        }))
      );
    }
  }, [selectedAvailability]);

  useEffect(() => {
    setTransactionType("");
    setDateRange({ start: null, end: null });
    setCapacity(15);
    setTimeRanges([]);
    setExistingAvailabilities([]);
    setSelectedAvailability(null);
  }, [mode]);

  const { userdata } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const startDateStr = dateRange.start
      ? dateRange.start.format("YYYY-MM-DD")
      : "";
    const endDateStr = dateRange.end ? dateRange.end.format("YYYY-MM-DD") : "";
    try {
      // Use user from UserContext instead of sessionStorage
      const user = userdata;

      let payload;
      if (mode === "add") {
        payload = {
          model: "schedulesModel",
          function_name: "insertAvailability",
          payload: {
            transaction_type_id: transactionType,
            start_date: startDateStr,
            end_date: endDateStr,
            created_by: user?.user_id,
            college: selectedCollege || "",
            semester: semester?.semester || "",
            school_year: schoolYear?.schoolYear || "",
            created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
            time_windows: timeRanges.map((tr) => ({
              capacity_per_day: capacity,
              availability_date: tr.date,
              start_time_am: tr.amStart ? `${tr.amStart}:00` : "",
              end_time_am: tr.amEnd ? `${tr.amEnd}:00` : "",
              start_time_pm: tr.pmStart ? `${tr.pmStart}:00` : "",
              end_time_pm: tr.pmEnd ? `${tr.pmEnd}:00` : "",
            })),
          },
        };
      } else if (mode === "edit" && selectedAvailability) {
        payload = {
          model: "schedulesModel",
          function_name: "updateAvailability",
          payload: {
            user_id: user?.user_id,
            availability_id: selectedAvailability.availability_id,
            transaction_type_id: transactionType,
            start_date: startDateStr,
            college: selectedCollege || "",
            semester: semester?.semester || "",
            school_year: schoolYear?.schoolYear || "",
            end_date: endDateStr,
            time_windows: timeRanges.map((tr) => ({
              time_window_id: tr.time_window_id,
              capacity_per_day: capacity,
              availability_date: tr.date,
              start_time_am: tr.amStart ? `${tr.amStart}:00` : "",
              end_time_am: tr.amEnd ? `${tr.amEnd}:00` : "",
              start_time_pm: tr.pmStart ? `${tr.pmStart}:00` : "",
              end_time_pm: tr.pmEnd ? `${tr.pmEnd}:00` : "",
            })),
          },
        };
      }
      const response = await apiClient.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        setTimeRanges([]);
        setDateRange({ start: null, end: null });
        setTransactionType("");
        setSelectedAvailability(null);
        notifySuccess(
          mode === "add"
            ? "Availability added successfully"
            : "Availability updated successfully"
        );
      } else {
        notifyError("Failed to save availability");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
      notifyError("An error occurred while saving availability");
    } finally {
      setClearanceSelected(false);
      setLoading(false);
    }
  };

  const getTransactionType = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getTransactionType",
      payload: {},
    };
    try {
      const response = await apiClient.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      setTransactionTypes(response.data.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getTransactionType();
  }, []);

  // --- Helper for Set button enablement ---
  const isSetButtonEnabled = () => {
    // Required: transactionType, capacity, dateRange.start, dateRange.end
    if (!transactionType) return false;
    if (!dateRange.start || !dateRange.end) return false;
    if (!capacity || capacity < 1) return false;
    // If clearanceSelected, selectedCollege must be set
    if (clearanceSelected && !selectedCollege) return false;
    return true;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      <Card
        sx={{
          width: "100%",
          maxWidth: "900px",
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <EventIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold" color="primary">
            {mode === "add" ? "Add Availability" : "Edit Availability"}
          </Typography>
        </Stack>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            row
            value={mode}
            onChange={(e) => setMode(e.target.value as "add" | "edit")}
          >
            <FormControlLabel value="add" control={<Radio />} label="Add New" />
            <FormControlLabel
              value="edit"
              control={<Radio />}
              label="Edit Existing"
            />
          </RadioGroup>
        </FormControl>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid width={"200px"}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  onChange={(e: SelectChangeEvent) => {
                    setTransactionType(e.target.value);

                    if (parseInt(e.target.value) === 3) {
                      fetchCollegeDepartments();
                      setClearanceSelected(true);
                    } else {
                      setClearanceSelected(false);
                    }
                  }}
                  label="Transaction Type"
                  required
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {transactionTypes.map((type) =>
                    type ? (
                      <MenuItem
                        key={type.transaction_type_id}
                        value={type.transaction_type_id}
                      >
                        {type.transaction_title}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>
            </Grid>
            {clearanceSelected ? (
              <Grid width={"200px"}>
                <FormControl fullWidth>
                  <InputLabel>College Department</InputLabel>
                  <Select
                    value={selectedCollege}
                    onChange={(e: SelectChangeEvent) => {
                      setSelectedCollege(e.target.value);
                    }}
                    label="College Department"
                  >
                    <MenuItem value="">Select College</MenuItem>
                    {collegeDepartments.map((college) =>
                      college ? (
                        <MenuItem value={college.college}>
                          {college.college_name}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <></>
            )}
            {mode === "edit" && transactionType && (
              <Grid width={"200px"}>
                <FormControl fullWidth>
                  <InputLabel>Existing Availability</InputLabel>
                  <Select
                    value={selectedAvailability?.availability_id || ""}
                    onChange={(e) => {
                      const avail = existingAvailabilities.find(
                        (a) => a.availability_id === Number(e.target.value)
                      );
                      setSelectedAvailability(avail || null);
                    }}
                    label="Existing Availability"
                  >
                    <MenuItem value="">Select Availability</MenuItem>
                    {existingAvailabilities.map((a) => (
                      <MenuItem
                        key={a.availability_id}
                        value={a.availability_id}
                      >
                        {a.start_date} to {a.end_date}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid>
              <TextField
                fullWidth
                type="number"
                label="Capacity Per Day"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(newValue) => {
                    setDateRange((prev) => ({ ...prev, start: newValue }));
                    setTimeRanges([]); // Reset time ranges on change
                  }}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium",
                      required: true,
                      disabled: mode === "edit" && !!selectedAvailability,
                    },
                  }}
                />
              </Grid>

              <Grid>
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(newValue) => {
                    setDateRange((prev) => ({ ...prev, end: newValue }));
                    setTimeRanges([]); // Reset time ranges on change
                  }}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium",
                      required: true,
                      disabled: mode === "edit" && !!selectedAvailability,
                    },
                  }}
                />
              </Grid>
            </LocalizationProvider>

            {mode === "add" && (
              <Grid>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleSetTimeRanges}
                  disabled={!isSetButtonEnabled()}
                  sx={{
                    width: "100%",
                    minWidth: 100,
                    height: "100%",
                    minHeight: 50,
                  }} // Ensures button is as wide as DatePicker
                >
                  Set
                </Button>
              </Grid>
            )}
          </Grid>

          {timeRanges.length > 0 && (
            <Box mt={4}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <TimeIcon color="primary" />
                <Typography variant="h6">Time Slots Configuration</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {timeRanges.map((tr, idx) => (
                  <Grid key={tr.date}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            {tr.date}
                          </Typography>
                        </Grid>

                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="body2">AM:</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={tr.amStart}
                              onChange={(e) =>
                                handleTimeChange(idx, "amStart", e.target.value)
                              }
                              required
                            />
                            <Typography variant="body2">to</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={tr.amEnd}
                              onChange={(e) =>
                                handleTimeChange(idx, "amEnd", e.target.value)
                              }
                              required
                            />
                          </Stack>
                        </Grid>

                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="body2">PM:</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={tr.pmStart}
                              onChange={(e) =>
                                handleTimeChange(idx, "pmStart", e.target.value)
                              }
                              required
                            />
                            <Typography variant="body2">to</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={tr.pmEnd}
                              onChange={(e) =>
                                handleTimeChange(idx, "pmEnd", e.target.value)
                              }
                              required
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : mode === "add"
                      ? "Save Availability"
                      : "Update Availability"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default AddAvailability;
