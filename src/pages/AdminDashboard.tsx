import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useUser } from "../services/UserContext";
function AdminDashboard() {
  const { userdata } = useUser();

  useEffect(() => {
    console.log(userdata);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
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
          Admin Dashboard
        </Typography>
        <h1>WELCOME {userdata?.user_level}!</h1>
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
            <Typography color="text.secondary">Total Schedules</Typography>
            <Typography variant="h4" color="primary" fontWeight="bold" mt={1}>
              120
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
            <Typography color="text.secondary">Active Users</Typography>
            <Typography
              variant="h4"
              sx={{ color: "#43a047" }}
              fontWeight="bold"
              mt={1}
            >
              45
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
            <Typography color="text.secondary">Pending Requests</Typography>
            <Typography
              variant="h4"
              sx={{ color: "#ffb300" }}
              fontWeight="bold"
              mt={1}
            >
              8
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
            <Typography color="text.secondary">Completed Tasks</Typography>
            <Typography
              variant="h4"
              sx={{ color: "#8e24aa" }}
              fontWeight="bold"
              mt={1}
            >
              98
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
            Recent Schedules
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>2024-06-10</TableCell>
                  <TableCell>10:00 AM</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Chip label="Confirmed" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" color="primary" variant="text">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>2024-06-11</TableCell>
                  <TableCell>2:00 PM</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Chip label="Pending" color="warning" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" color="primary" variant="text">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>2024-06-12</TableCell>
                  <TableCell>9:00 AM</TableCell>
                  <TableCell>Alice Brown</TableCell>
                  <TableCell>
                    <Chip label="Cancelled" color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" color="primary" variant="text">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminDashboard;
