import NavBar from "../components/NavBar";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Chip,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FlagIcon from "@mui/icons-material/Flag";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

function VMGOPage() {
  const theme = useTheme();

  return (
    <Box>
      <NavBar />
      <Box
        style={{
          backgroundColor: "#f3f4f6",
          backgroundImage: `
                repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
                repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
                `,
          backgroundSize: "40px 40px",
        }}
        sx={{
          minHeight: "80vh",
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
            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              color="primary.dark"
              gutterBottom
              sx={{
                mb: 5,
                letterSpacing: 1,
                textShadow: "0 2px 8px rgba(30, 64, 175, 0.08)",
              }}
            >
              Vision, Mission, and Goal
            </Typography>
            {/* Vision */}
            <Box mb={6}>
              <Box display="flex" alignItems="center" mb={1.5}>
                <EmojiObjectsIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1,
                    fontSize: 32,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{ letterSpacing: 0.5 }}
                >
                  Vision
                </Typography>
                <Chip
                  label="Inspiration"
                  size="small"
                  sx={{
                    ml: 2,
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>
              <Divider
                sx={{ mb: 2, borderColor: theme.palette.primary.light }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 2, fontSize: "1.15rem" }}
              >
                To be a leading institution recognized for excellence in
                education, innovation, and service to society.
              </Typography>
            </Box>
            {/* Mission */}
            <Box mb={6}>
              <Box display="flex" alignItems="center" mb={1.5}>
                <FlagIcon
                  sx={{
                    color: theme.palette.success.main,
                    mr: 1,
                    fontSize: 32,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="success.main"
                  sx={{ letterSpacing: 0.5 }}
                >
                  Mission
                </Typography>
                <Chip
                  label="Purpose"
                  size="small"
                  sx={{
                    ml: 2,
                    color: theme.palette.success.main,
                  }}
                />
              </Box>
              <Divider
                sx={{ mb: 2, borderColor: theme.palette.success.light }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 2, fontSize: "1.15rem" }}
              >
                To provide quality education and foster lifelong learning,
                critical thinking, and responsible citizenship through a dynamic
                and inclusive environment.
              </Typography>
            </Box>
            {/* Goal */}
            <Box>
              <Box display="flex" alignItems="center" mb={1.5}>
                <TrackChangesIcon
                  sx={{
                    color: theme.palette.warning.main,
                    mr: 1,
                    fontSize: 32,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="warning.main"
                  sx={{ letterSpacing: 0.5 }}
                >
                  Goal
                </Typography>
                <Chip
                  label="Objectives"
                  size="small"
                  sx={{
                    ml: 2,
                    color: theme.palette.warning.main,
                  }}
                />
              </Box>
              <Divider
                sx={{ mb: 2, borderColor: theme.palette.warning.light }}
              />
              <List
                sx={{
                  pl: 3,
                  "& .MuiListItem-root": { py: 0.5 },
                  "& .MuiListItemIcon-root": { minWidth: 32 },
                }}
              >
                <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={{ color: theme.palette.warning.main, fontSize: 12 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Promote academic excellence and innovation."
                    primaryTypographyProps={{
                      fontSize: "1.08rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={{ color: theme.palette.warning.main, fontSize: 12 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Develop competent and ethical professionals."
                    primaryTypographyProps={{
                      fontSize: "1.08rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={{ color: theme.palette.warning.main, fontSize: 12 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Engage in community service and sustainable development."
                    primaryTypographyProps={{
                      fontSize: "1.08rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon
                      sx={{ color: theme.palette.warning.main, fontSize: 12 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Foster a culture of collaboration and respect."
                    primaryTypographyProps={{
                      fontSize: "1.08rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default VMGOPage;
