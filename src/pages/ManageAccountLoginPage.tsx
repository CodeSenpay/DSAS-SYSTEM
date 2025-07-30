import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import {
  School as SchoolIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import apiClient from "../services/apiClient";
import { notifySuccess, notifyError } from "../components/ToastUtils";

interface CollegeYearLevel {
  college: string;
  year_level: string;
  is_allowed: number;
}

const ManageAccountLoginPage: React.FC = () => {
  const [collegeYearLevels, setCollegeYearLevels] = useState<
    CollegeYearLevel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [collegeBulkUpdating, setCollegeBulkUpdating] = useState<{
    [college: string]: boolean;
  }>({});
  const [search, setSearch] = useState<string>("");

  // Fetch college/year_level options and allowed login status
  const fetchCollegeYearLevels = async () => {
    setLoading(true);
    setError(null);
    try {
      const collegeYearRes = await apiClient.post(
        "/scheduling-system/admin",
        {
          model: "schedulesModel",
          function_name: "getCollegeYearLevels",
          payload: {},
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // The response is an array of {college, year_level, is_allowed}
      // Sometimes the data may be in data.data or data, so check both
      // Adjusted for the new response structure
      let levels: CollegeYearLevel[] = [];
      if (
        collegeYearRes.data &&
        collegeYearRes.data.data &&
        collegeYearRes.data.data.success &&
        Array.isArray(collegeYearRes.data.data.data)
      ) {
        levels = collegeYearRes.data.data.data;
      } else if (
        collegeYearRes.data &&
        Array.isArray(collegeYearRes.data.data)
      ) {
        levels = collegeYearRes.data.data;
      } else {
        setError("Failed to fetch college/year level options");
        setLoading(false);
        return;
      }

      setCollegeYearLevels(levels);
    } catch (err) {
      setError("Error fetching data");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update allowed login status for a single year level
  const updateAllowedLogin = async (
    college: string,
    yearLevel: string,
    isAllowed: boolean
  ) => {
    const key = `${college}-${yearLevel}`;
    setUpdating((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await apiClient.post(
        "/scheduling-system/admin",
        {
          model: "schedulesModel",
          function_name: "updateAllowedLogin",
          payload: {
            updates: [
              {
                college,
                year_level: yearLevel,
                is_allowed: isAllowed ? 1 : 0,
              },
            ],
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      // Adjusted for the new response structure
      if (
        response.data &&
        response.data.data &&
        response.data.data.success &&
        response.data.data.data &&
        response.data.data.data.status === "success"
      ) {
        notifySuccess(
          `Login ${isAllowed ? "enabled" : "disabled"} for ${college} - ${yearLevel}`
        );
        // Update the local state for that row
        setCollegeYearLevels((prev) =>
          prev.map((item) =>
            item.college === college && item.year_level === yearLevel
              ? { ...item, is_allowed: isAllowed ? 1 : 0 }
              : item
          )
        );
      } else if (
        response.data &&
        response.data.data &&
        response.data.data.data &&
        response.data.data.data.status === "partial_success"
      ) {
        const result = response.data.data.data;
        notifySuccess(
          `${result.successful_updates} updates succeeded, ${result.failed_updates} failed for ${college} - ${yearLevel}`
        );
        setCollegeYearLevels((prev) =>
          prev.map((item) =>
            item.college === college && item.year_level === yearLevel
              ? { ...item, is_allowed: isAllowed ? 1 : 0 }
              : item
          )
        );
      } else {
        notifyError(
          (response.data && response.data.data && response.data.data.message) ||
            "Failed to update login status"
        );
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      notifyError(error.response?.data?.message || "An error occurred");
    } finally {
      setUpdating((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Bulk update for all or per college
  const bulkUpdateAllowedLogin = async (
    college: string | null, // null means all colleges
    isAllowed: boolean
  ) => {
    if (college) {
      setCollegeBulkUpdating((prev) => ({ ...prev, [college]: true }));
    } else {
      setBulkUpdating(true);
    }

    // Find all year levels to update
    const targets = college
      ? collegeYearLevels.filter((item) => item.college === college)
      : collegeYearLevels;

    // Prepare updates array
    const updates = targets.map((item) => ({
      college: item.college,
      year_level: item.year_level,
      is_allowed: isAllowed ? 1 : 0,
    }));

    try {
      const response = await apiClient.post(
        "/scheduling-system/admin",
        {
          model: "schedulesModel",
          function_name: "updateAllowedLogin",
          payload: {
            updates,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Adjusted for the new response structure
      let result = null;
      if (
        response.data &&
        response.data.data &&
        response.data.data.success &&
        response.data.data.data
      ) {
        result = response.data.data.data;
      }

      if (result && result.status === "success") {
        notifySuccess(
          `Login ${isAllowed ? "enabled" : "disabled"} for ${
            college ? `all year levels in ${college}` : "all colleges"
          }`
        );
        // Update local state
        setCollegeYearLevels((prev) =>
          prev.map((item) =>
            (college ? item.college === college : true)
              ? { ...item, is_allowed: isAllowed ? 1 : 0 }
              : item
          )
        );
      } else if (result && result.status === "partial_success") {
        notifySuccess(
          `${result.successful_updates} updates succeeded, ${result.failed_updates} failed for ${
            college ? college : "all colleges"
          }`
        );
        // Update local state for successful updates (for simplicity, update all targeted)
        setCollegeYearLevels((prev) =>
          prev.map((item) =>
            (college ? item.college === college : true)
              ? { ...item, is_allowed: isAllowed ? 1 : 0 }
              : item
          )
        );
      } else {
        notifyError(
          (response.data && response.data.data && response.data.data.message) ||
            "Failed to update login status"
        );
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      notifyError(
        error.response?.data?.message || "An error occurred during bulk update"
      );
    } finally {
      if (college) {
        setCollegeBulkUpdating((prev) => ({ ...prev, [college]: false }));
      } else {
        setBulkUpdating(false);
      }
    }
  };

  // Group by college
  const groupedByCollege: { [college: string]: CollegeYearLevel[] } = {};
  collegeYearLevels.forEach((item) => {
    if (!groupedByCollege[item.college]) {
      groupedByCollege[item.college] = [];
    }
    groupedByCollege[item.college].push(item);
  });

  // Search filter for colleges
  const filteredColleges = Object.entries(groupedByCollege).filter(
    ([college]) => college.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Helper: check if all year levels in a college are allowed
  const isAllAllowedInCollege = (college: string) => {
    const levels = groupedByCollege[college] || [];
    return levels.length > 0 && levels.every((item) => !!item.is_allowed);
  };

  // Helper: check if all year levels in all colleges are allowed
  const isAllAllowedAll = () => {
    return (
      collegeYearLevels.length > 0 &&
      collegeYearLevels.every((item) => !!item.is_allowed)
    );
  };

  useEffect(() => {
    fetchCollegeYearLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Allowed Accounts to Login
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant={isAllAllowedAll() ? "contained" : "outlined"}
            color="success"
            size="small"
            disabled={bulkUpdating || isAllAllowedAll()}
            onClick={() => bulkUpdateAllowedLogin(null, true)}
          >
            Allow All
          </Button>
          <Button
            variant={!isAllAllowedAll() ? "contained" : "outlined"}
            color="error"
            size="small"
            disabled={
              bulkUpdating ||
              !collegeYearLevels.some((item) => !!item.is_allowed)
            }
            onClick={() => bulkUpdateAllowedLogin(null, false)}
          >
            Restrict All
          </Button>
        </Stack>
      </Box>

      {/* Search bar for colleges */}
      <Box mb={3} display="flex" alignItems="center" gap={1}>
        <SearchIcon color="action" />
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 320, maxWidth: "100%" }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {filteredColleges.length === 0 ? (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              {search.trim()
                ? "No colleges found matching your search"
                : "No college/year level data found"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        filteredColleges.map(([college, yearLevels]) => {
          const allAllowed = isAllAllowedInCollege(college);
          const anyAllowed = yearLevels.some((item) => !!item.is_allowed);
          return (
            <Card elevation={3} sx={{ mb: 4 }} key={college}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="h6" gutterBottom>
                    {college}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={allAllowed ? "contained" : "outlined"}
                      color="success"
                      size="small"
                      disabled={collegeBulkUpdating[college] || allAllowed}
                      onClick={() => bulkUpdateAllowedLogin(college, true)}
                    >
                      Allow All
                    </Button>
                    <Button
                      variant={!allAllowed ? "contained" : "outlined"}
                      color="error"
                      size="small"
                      disabled={collegeBulkUpdating[college] || !anyAllowed}
                      onClick={() => bulkUpdateAllowedLogin(college, false)}
                    >
                      Restrict All
                    </Button>
                  </Stack>
                </Box>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Year Level</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Allowed to Login</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {yearLevels.map((item) => {
                        const key = `${item.college}-${item.year_level}`;
                        const isAllowed = !!item.is_allowed;
                        return (
                          <TableRow key={key}>
                            <TableCell>{item.year_level}</TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={isAllowed}
                                    onChange={(e) =>
                                      updateAllowedLogin(
                                        item.college,
                                        item.year_level,
                                        e.target.checked
                                      )
                                    }
                                    color="primary"
                                    disabled={
                                      !!updating[key] ||
                                      !!collegeBulkUpdating[college] ||
                                      bulkUpdating
                                    }
                                  />
                                }
                                label={
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    {isAllowed ? (
                                      <LockOpenIcon
                                        color="success"
                                        fontSize="small"
                                      />
                                    ) : (
                                      <LockIcon
                                        color="error"
                                        fontSize="small"
                                      />
                                    )}
                                    <Typography variant="body2">
                                      {isAllowed
                                        ? "Login Enabled"
                                        : "Login Disabled"}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default ManageAccountLoginPage;
