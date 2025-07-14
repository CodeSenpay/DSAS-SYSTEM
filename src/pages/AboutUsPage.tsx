import NavBar from "../components/NavBar";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function AboutUsPage() {
  const theme = useTheme();

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          backgroundImage: `
            repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
            repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
          `,
          backgroundSize: "40px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "15vh",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              borderRadius: 6,
              p: { xs: 3, sm: 6 },
              border: `1px solid ${theme.palette.primary.light}`,
              boxShadow: theme.shadows[8],
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                <GroupIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.dark"
                sx={{
                  letterSpacing: 1,
                  textShadow: "0 2px 8px rgba(30, 64, 175, 0.08)",
                }}
              >
                About Us
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: theme.palette.primary.light }} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, fontSize: "1.15rem" }}
            >
              Welcome to our Student Services Portal! Our mission is to provide
              students with a seamless and efficient way to access essential
              services such as subsidy payouts, clearance validation, and school
              ID claiming. We are committed to supporting your academic journey
              and making your campus experience more convenient.
            </Typography>
            <Grid container spacing={4} sx={{ mb: 2 }}>
              <Grid>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Address
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Gov. Sta. Cruz, Guading Adasa St, Dapitan City, Zamboanga del Norte
                </Typography>
              </Grid>
              <Grid>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Contact
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  main.dasa@jrmsu.edu.ph
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, borderColor: theme.palette.primary.light }} />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              &copy; {new Date().getFullYear()} Student Services Portal. All
              rights reserved.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default AboutUsPage;
