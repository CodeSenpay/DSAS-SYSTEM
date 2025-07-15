import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useUser } from "../services/UserContext";
import { notifyError } from "../components/ToastUtils";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { BarChart } from "@mui/x-charts";

// TypeScript interfaces for API responses
interface TransactionType {
  transaction_title: string;
  transaction_type_id: number;
}

function AdminDashboard() {
  const { userdata } = useUser();

  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );
  const [totalSlots, setTotalSlots] = useState<{ [key: number]: number }>({});
  const [totalPendings, setTotalPendings] = useState<number>(0);
  const [pendingPerType, setPendingPerType] = useState<{
    [key: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all transaction types
  const fetchTransactionsByType = async () => {
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
      if (response.data.success && Array.isArray(response.data.data)) {
        setTransactionTypes(response.data.data);
      } else {
        notifyError("Can't Fetch Transaction Types");
        setError("Can't Fetch Transaction Types");
      }
    } catch (err) {
      notifyError("Error fetching transaction types");
      setError("Error fetching transaction types");
      console.log(err);
    }
  };

  // Fetch total slots for a transaction_type_id
  const fetchTotalSlots = async (transaction_type_id: number) => {
    const data = {
      model: "schedulesModel",
      function_name: "fetchTotalSlots",
      payload: {
        transaction_type_id,
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
      console.log(response.data);

      let slots = 0;
      if (
        response.data.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0 &&
        typeof response.data.data[0].total_available_slots !== "undefined" &&
        response.data.data[0].total_available_slots !== null &&
        response.data.data[0].total_available_slots !== ""
      ) {
        slots = Number(response.data.data[0].total_available_slots);
        console.log("Slots: ", slots);
        if (isNaN(slots)) {
          slots = 0;
          console.warn(
            `total_available_slots is not a number for transaction_type_id ${transaction_type_id}:`,
            response.data.data[0].total_available_slots
          );
        }
        setTotalSlots((prev) => ({
          ...prev,
          [transaction_type_id]: slots,
        }));
        setError(null); // <-- Clear error on success
      } else {
        // Do not show error, just set slots to 0 for this type
        setTotalSlots((prev) => ({
          ...prev,
          [transaction_type_id]: 0,
        }));
        // Do not set error or notifyError here
      }
    } catch (err) {
      notifyError("Error fetching total slots");
      setError("Error fetching total slots");
      console.log(err);
    }
  };

  // Fetch total pendings for each transaction type and store in pendingPerType
  const fetchTotalPendings = async () => {
    if (!transactionTypes.length) return;
    let total = 0;
    const pendingMap: { [key: number]: number } = {};
    let allFailed = true;
    for (const type of transactionTypes) {
      const data = {
        model: "schedulesModel",
        function_name: "fetchTotalPendings",
        payload: { transaction_type_id: type.transaction_type_id },
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
        const arr = Array.isArray(response.data.data)
          ? response.data.data
          : response.data;
        if (
          Array.isArray(arr) &&
          arr.length > 0 &&
          typeof arr[0].total_pending !== "undefined" &&
          arr[0].total_pending !== null &&
          arr[0].total_pending !== ""
        ) {
          const pending = Number(arr[0].total_pending) || 0;
          total += pending;
          pendingMap[type.transaction_type_id] = pending;
          allFailed = false;
        } else {
          pendingMap[type.transaction_type_id] = 0;
        }
      } catch (err) {
        // Only show error if all fail
        pendingMap[type.transaction_type_id] = 0;
        console.log(err);
      }
    }
    setTotalPendings(total);
    setPendingPerType(pendingMap);
    if (allFailed) {
      notifyError("Can't Fetch Pending Appointments");
      setError("Can't Fetch Pending Appointments");
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchAll = async () => {
      await fetchTransactionsByType();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (transactionTypes.length > 0) {
      transactionTypes.forEach((type) => {
        fetchTotalSlots(type.transaction_type_id);
      });
      fetchTotalPendings();
      setLoading(false);
    }
  }, [transactionTypes]);

  const getSlotByTitle = (title: string) => {
    const type = transactionTypes.find((t) => t.transaction_title === title);
    return type ? totalSlots[type.transaction_type_id] || 0 : 0;
  };

  // Loading, error, and empty states
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }
  if (transactionTypes.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>No transaction types found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          align="center"
          gutterBottom
          sx={{ mb: 6, textShadow: "0 2px 8px #e3f2fd" }}
        >
          Welcome {userdata?.first_name}!
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 6,
            justifyContent: { xs: "center", md: "space-between" },
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderTop: "5px solid #1976d2",
              borderRadius: 3,
              minWidth: 220,
              flex: "1 1 220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography color="text.secondary">
              Total Slots - Subsidy
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold" mt={1}>
              {getSlotByTitle("Subsidy")}
            </Typography>
          </Paper>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderTop: "5px solid #43a047",
              borderRadius: 3,
              minWidth: 220,
              flex: "1 1 220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography color="text.secondary">
              Total Slots - Clearance
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "#43a047" }}
              fontWeight="bold"
              mt={1}
            >
              {getSlotByTitle("Clearance")}
            </Typography>
          </Paper>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderTop: "5px solid #ffb300",
              borderRadius: 3,
              minWidth: 220,
              flex: "1 1 220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography color="text.secondary">
              Total Slots - Claiming ID
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "#ffb300" }}
              fontWeight="bold"
              mt={1}
            >
              {getSlotByTitle("Claiming of ID")}
            </Typography>
          </Paper>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderTop: "5px solid #8e24aa",
              borderRadius: 3,
              minWidth: 220,
              flex: "1 1 220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography color="text.secondary">Pending Appointments</Typography>
            <Typography
              variant="h4"
              sx={{ color: "#8e24aa" }}
              fontWeight="bold"
              mt={1}
            >
              {totalPendings}
            </Typography>
          </Paper>
        </Box>
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4 }}>
          <Typography
            variant="h5"
            fontWeight="medium"
            color="primary"
            sx={{ mb: 3 }}
          >
            Transaction Slots & Pending Overview
          </Typography>
          {/* Prepare chart data for slots and pending per transaction type */}
          {(() => {
            const chartLabels = transactionTypes.map(
              (t) => t.transaction_title
            );
            const slotData = transactionTypes.map(
              (t) => totalSlots[t.transaction_type_id] || 0
            );
            const pendingData = transactionTypes.map(
              (t) => pendingPerType[t.transaction_type_id] || 0
            );
            return (
              <BarChart
                height={300}
                xAxis={[{ data: chartLabels, scaleType: "band" }]}
                series={[
                  { data: slotData, label: "Total Slots" },
                  { data: pendingData, label: "Pending Appointments" },
                ]}
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              />
            );
          })()}
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
