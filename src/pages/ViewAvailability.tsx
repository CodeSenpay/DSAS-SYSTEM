import axios from "axios";
import { notifyError } from "../components/ToastUtils";
import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Chip, Collapse, Divider, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography, Stack, useTheme, LinearProgress
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Event as EventIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";
import { format } from "date-fns";

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

function ViewAvailability() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const theme = useTheme();

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchTransactionsByType = async () => {
    setLoading(true);
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: {
        searchkey: ""
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

      if (response.data.success) {
        setAvailabilities(response.data.data);
      } else {
        notifyError("Can't Fetch Appointments");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsByType();
  }, []);

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate the percentage of slots filled
  const calculateCapacityPercentage = (total: number, left: number) => {
    return ((total - left) / total) * 100;
  };

  // Group availabilities by transaction_type_id
  const groupedAvailabilities = availabilities.reduce<Record<number, Availability[]>>((acc, curr) => {
    if (!acc[curr.transaction_type_id]) {
      acc[curr.transaction_type_id] = [];
    }
    acc[curr.transaction_type_id].push(curr);
    return acc;
  }, {});

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <EventIcon color="primary" />
        Available Schedules
      </Typography>

      {loading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          {availabilities.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No availability records found
              </Typography>
            </Paper>
          ) : (
            Object.entries(groupedAvailabilities).map(([typeId, group]) => {
              // Use the first item's transaction_title as the type title/description
              const typeTitle = group[0]?.transaction_title || `Type ID: ${typeId}`;
              return (
                <Box key={typeId} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    {typeTitle}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    {group.map((availability) => (
                      <Card
                        key={availability.availability_id}
                        sx={{
                          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                        }}
                      >
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">
                              {availability.transaction_title}
                            </Typography>
                            <Chip
                              size="small"
                              label={`ID: ${availability.availability_id}`}
                              variant="outlined"
                            />
                          </Box>

                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            divider={<Divider orientation="vertical" flexItem />}
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography variant="caption" color="text.secondary">Period</Typography>
                              <Typography variant="body2">
                                {formatDate(availability.start_date)} - {formatDate(availability.end_date)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Created</Typography>
                              <Typography variant="body2">
                                {formatDate(availability.created_at)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Type ID</Typography>
                              <Typography variant="body2">{availability.transaction_type_id}</Typography>
                            </Box>
                          </Stack>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'text.secondary'
                              }}
                            >
                              <TimeIcon fontSize="small" />
                              Time Windows ({availability.time_windows.length})
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(availability.availability_id)}
                              aria-label={expandedRows[availability.availability_id] ? "Show less" : "Show more"}
                            >
                              {expandedRows[availability.availability_id] ?
                                <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                        </CardContent>

                        <Collapse in={expandedRows[availability.availability_id]} timeout="auto">
                          <Divider />
                          <TableContainer component={Box} sx={{ px: 2, py: 1 }}>
                            <Table size="small" aria-label="time windows">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Date</TableCell>
                                  <TableCell>Morning</TableCell>
                                  <TableCell>Afternoon</TableCell>
                                  <TableCell align="right">Capacity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {availability.time_windows.map((timeWindow) => {
                                  const capacityPercentage = calculateCapacityPercentage(
                                    timeWindow.capacity_per_day,
                                    timeWindow.total_slots_left
                                  );

                                  return (
                                    <TableRow key={timeWindow.time_window_id}>
                                      <TableCell>{formatDate(timeWindow.availability_date)}</TableCell>
                                      <TableCell>{timeWindow.start_time_am} - {timeWindow.end_time_am}</TableCell>
                                      <TableCell>{timeWindow.start_time_pm} - {timeWindow.end_time_pm}</TableCell>
                                      <TableCell align="right">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Box sx={{ flexGrow: 1 }}>
                                            <LinearProgress
                                              variant="determinate"
                                              value={capacityPercentage}
                                              sx={{
                                                height: 8,
                                                borderRadius: 1,
                                                bgcolor: 'rgba(0,0,0,0.05)',
                                                '& .MuiLinearProgress-bar': {
                                                  bgcolor: capacityPercentage > 80
                                                    ? theme.palette.error.main
                                                    : theme.palette.primary.main
                                                }
                                              }}
                                            />
                                          </Box>
                                          <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                                            {timeWindow.total_slots_left}/{timeWindow.capacity_per_day}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </Card>
                    ))}
                  </Box>
                </Box>
              );
            })
          )}
        </>
      )}
    </Box>
  );
}

export default ViewAvailability;