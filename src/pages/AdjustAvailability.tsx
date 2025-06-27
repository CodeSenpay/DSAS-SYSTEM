import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Stack,
  TextField,
} from "@mui/material";

// Assuming these are defined elsewhere for toast notifications
const notifySuccess = (msg: string) => console.log(msg);
const notifyError = (msg: string) => console.error(msg);

type TimeWindow = {
  end_time_am: string;
  end_time_pm: string;
  start_time_am: string;
  start_time_pm: string;
  time_window_id: number;
  capacity_per_day: number;
  total_slots_left: number;
  availability_date: string;
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

type TransactionTypeProps = {
  transaction_type_id: number;
  transaction_title: string;
  transaction_details: string;
};

const API_URL = "http://localhost:5000/api/scheduling-system/admin";

function AdjustAvailability() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState<TransactionTypeProps[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCapacity, setEditCapacity] = useState<number | null>(null);
  const [editSlotsLeft, setEditSlotsLeft] = useState<number | null>(null);

  const getAvailability = async (transactionTypeID: number) => {
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: { searchkey: transactionTypeID },
    };
    setLoading(true);
    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        setAvailabilities(response.data.data);
        notifySuccess("Availability data fetched successfully.");
      } else {
        notifyError("Failed to fetch availability data.");
      }
    } catch (err) {
      console.log(err);
      notifyError("An error occurred while fetching availability data.");
    } finally {
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
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTransactionTypes(response.data.data);
    } catch (err) {
      console.log(err);
      notifyError("Failed to fetch transaction types.");
    }
  };

  const updateTimeWindow = async (timeWindowId: number, updatedData: Partial<TimeWindow>) => {
    const data = {
      model: "schedulesModel",
      function_name: "updateTimeWindow",
      payload: { time_window_id: timeWindowId, ...updatedData },
    };
    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        notifySuccess("Time window updated successfully.");
        if (selectedType !== null) getAvailability(selectedType);
      } else {
        notifyError("Failed to update time window.");
      }
    } catch (err) {
      console.log(err);
      notifyError("An error occurred while updating the time window.");
    }
  };

  const handleEditClick = (timeWindow: TimeWindow) => {
    setEditingId(timeWindow.time_window_id);
    setEditCapacity(timeWindow.capacity_per_day);
    setEditSlotsLeft(timeWindow.total_slots_left);
  };

  const handleSaveClick = (timeWindowId: number) => {
    if (editCapacity !== null && editSlotsLeft !== null) {
      updateTimeWindow(timeWindowId, {
        capacity_per_day: editCapacity,
        total_slots_left: editSlotsLeft,
      });
      setEditingId(null);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditCapacity(null);
    setEditSlotsLeft(null);
  };

  useEffect(() => {
    getTransactionType();
  }, []);

  useEffect(() => {
    if (selectedType !== null) getAvailability(selectedType);
  }, [selectedType]);

  return (
    <Container>
      <Stack spacing={4} alignItems="center" sx={{ mt: 4 }}>
        <Typography variant="h4">Adjust Availability</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={selectedType || ""}
            onChange={(e) => setSelectedType(e.target.value as number)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Transaction Type
            </MenuItem>
            {transactionTypes.map((type) => (
              <MenuItem key={type.transaction_type_id} value={type.transaction_type_id}>
                {type.transaction_title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {selectedType !== null && loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : selectedType !== null ? (
        <Stack spacing={4} mt={4}>
          {availabilities.map((a) => (
            <Paper key={a.availability_id} sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{a.transaction_title}</Typography>
                <Chip label={`Availability ID: ${a.availability_id}`} />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {a.start_date} - {a.end_date}
              </Typography>
              <TableContainer component="div" sx={{ mt: 2, overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>AM Time</TableCell>
                      <TableCell>PM Time</TableCell>
                      <TableCell align="center">Capacity</TableCell>
                      <TableCell align="center">Slots Left</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {a.time_windows.map((tw, idx) => (
                      <TableRow
                        key={tw.time_window_id}
                        sx={{ bgcolor: idx % 2 === 0 ? "background.paper" : "grey.50" }}
                      >
                        <TableCell>{tw.availability_date}</TableCell>
                        <TableCell>
                          {tw.start_time_am} - {tw.end_time_am}
                        </TableCell>
                        <TableCell>
                          {tw.start_time_pm} - {tw.end_time_pm}
                        </TableCell>
                        <TableCell align="center">
                          {editingId === tw.time_window_id ? (
                            <TextField
                              type="number"
                              value={editCapacity || ""}
                              onChange={(e) => setEditCapacity(Number(e.target.value))}
                              size="small"
                            />
                          ) : (
                            tw.capacity_per_day
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editingId === tw.time_window_id ? (
                            <TextField
                              type="number"
                              value={editSlotsLeft || ""}
                              onChange={(e) => setEditSlotsLeft(Number(e.target.value))}
                              size="small"
                            />
                          ) : (
                            <Box
                              sx={{
                                bgcolor:
                                  tw.total_slots_left > 5
                                    ? "success.main"
                                    : tw.total_slots_left > 0
                                      ? "warning.main"
                                      : "error.main",
                                color: "white",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              {tw.total_slots_left}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editingId === tw.time_window_id ? (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleSaveClick(tw.time_window_id)}
                                sx={{ mr: 1 }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={handleCancelClick}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleEditClick(tw)}
                            >
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Stack>
      ) : null}
    </Container>
  );
}

export default AdjustAvailability;