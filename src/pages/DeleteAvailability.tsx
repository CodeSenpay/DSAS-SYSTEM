import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import apiClient from "../services/apiClient";
import { notifyError, notifySuccess } from "../components/ToastUtils";

interface TimeWindow {
  end_time_am: string;
  end_time_pm: string;
  start_time_am: string;
  start_time_pm: string;
  time_window_id: number;
  capacity_per_day: number;
  total_slots_left: number;
  availability_date: string;
}

interface Availability {
  availability_id: number;
  transaction_title: string;
  transaction_type_id: number;
  start_date: string;
  end_date: string;
  created_by: number;
  created_at: string;
  time_windows: TimeWindow[];
}

function DeleteAvailability() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    availability?: Availability;
  }>({ open: false });
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const theme = useTheme();

  // Fetch all availabilities
  const fetchAvailabilities = async () => {
    setLoading(true);
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: {
        searchkey: "",
      },
    };
    try {
      const response = await apiClient.post("/scheduling-system/admin", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        setAvailabilities(response.data.data);
      } else {
        notifyError("Can't Fetch Availabilities");
      }
    } catch {
      notifyError("Error fetching availabilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  // Delete availability
  const handleDelete = async (availability: Availability) => {
    setDeletingId(availability.availability_id);
    try {
      const data = {
        model: "schedulesModel",
        function_name: "deleteAvailability",
        payload: {
          availability_id: availability.availability_id,
        },
      };
      const response = await apiClient.post("/scheduling-system/admin", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        notifySuccess("Availability deleted successfully");
        setAvailabilities((prev) =>
          prev.filter((a) => a.availability_id !== availability.availability_id)
        );
      } else {
        notifyError(response.data.message || "Failed to delete availability");
      }
    } catch {
      notifyError("Error deleting availability");
    } finally {
      setDeletingId(null);
      setConfirmDialog({ open: false });
    }
  };

  // Group availabilities by transaction_type_id
  const groupedAvailabilities = availabilities.reduce<
    Record<number, Availability[]>
  >((acc, curr) => {
    if (!acc[curr.transaction_type_id]) {
      acc[curr.transaction_type_id] = [];
    }
    acc[curr.transaction_type_id].push(curr);
    return acc;
  }, {});

  // Toggle expand/collapse for a row
  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EventIcon color="primary" />
        Delete Availability
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {Object.keys(groupedAvailabilities).length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 6 }}>
              No availabilities found.
            </Typography>
          ) : (
            Object.entries(groupedAvailabilities).map(
              ([transactionTypeId, availabilities]) => (
                <Box key={transactionTypeId} sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {availabilities[0].transaction_title}
                  </Typography>
                  <Stack spacing={2}>
                    {availabilities.map((availability) => (
                      <Card
                        key={availability.availability_id}
                        variant="outlined"
                        sx={{
                          borderColor: theme.palette.divider,
                          background: "#fff",
                        }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {formatDate(availability.start_date)} -{" "}
                                {formatDate(availability.end_date)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Created at:{" "}
                                {formatDate(availability.created_at)}
                              </Typography>
                            </Box>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  toggleRow(availability.availability_id)
                                }
                                aria-label={
                                  expandedRows[availability.availability_id]
                                    ? "Collapse time windows"
                                    : "Expand time windows"
                                }
                              >
                                {expandedRows[availability.availability_id] ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                              <IconButton
                                color="error"
                                disabled={
                                  deletingId === availability.availability_id
                                }
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    availability,
                                  })
                                }
                                aria-label="Delete"
                              >
                                {deletingId === availability.availability_id ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Stack>
                          </Stack>
                          <Collapse
                            in={!!expandedRows[availability.availability_id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Time Windows:
                              </Typography>
                              <TableContainer
                                component={Paper}
                                sx={{ mt: 1, boxShadow: "none" }}
                              >
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Date</TableCell>
                                      <TableCell>AM Start</TableCell>
                                      <TableCell>AM End</TableCell>
                                      <TableCell>PM Start</TableCell>
                                      <TableCell>PM End</TableCell>
                                      <TableCell>Capacity</TableCell>
                                      <TableCell>Slots Left</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {availability.time_windows.map((tw) => (
                                      <TableRow key={tw.time_window_id}>
                                        <TableCell>
                                          {formatDate(tw.availability_date)}
                                        </TableCell>
                                        <TableCell>
                                          {tw.start_time_am}
                                        </TableCell>
                                        <TableCell>{tw.end_time_am}</TableCell>
                                        <TableCell>
                                          {tw.start_time_pm}
                                        </TableCell>
                                        <TableCell>{tw.end_time_pm}</TableCell>
                                        <TableCell>
                                          {tw.capacity_per_day}
                                        </TableCell>
                                        <TableCell>
                                          {tw.total_slots_left}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )
            )
          )}
        </>
      )}

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">
          Delete Availability?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this availability? This action
            cannot be undone.
          </DialogContentText>
          {confirmDialog.availability && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <b>Transaction:</b>{" "}
                {confirmDialog.availability.transaction_title}
              </Typography>
              <Typography variant="body2">
                <b>Date Range:</b>{" "}
                {formatDate(confirmDialog.availability.start_date)} -{" "}
                {formatDate(confirmDialog.availability.end_date)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              confirmDialog.availability &&
              handleDelete(confirmDialog.availability)
            }
            color="error"
            variant="contained"
            disabled={
              deletingId === confirmDialog.availability?.availability_id
            }
          >
            {deletingId === confirmDialog.availability?.availability_id
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteAvailability;
