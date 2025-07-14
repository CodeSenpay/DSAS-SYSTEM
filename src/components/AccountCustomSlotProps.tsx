import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import { Account, AccountPreview, SignOutButton } from "@toolpad/core/Account";
import { AppProvider, type Session } from "@toolpad/core/AppProvider";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "./ToastUtils";
import { useUser } from "../services/UserContext";

// Move getSessionFromStorage inside the component and remove the useUser() call from outside a hook/component
export default function AccountCustomSlotProps() {
  const { userdata } = useUser();
  const navigate = useNavigate();

  // Helper to build session from userdata
  const getSessionFromUserdata = React.useCallback((): Session | null => {
    if (!userdata) return null;
    return {
      user: {
        name: `${userdata.first_name ?? ""} ${userdata.middle_name ?? ""} ${userdata.last_name ?? ""}`
          .replace(/\s+/g, " ")
          .trim(),
        email: userdata.email,
        image: "https://avatars.githubusercontent.com/u/19550456", // Update if you have user image
      },
    };
  }, [userdata]);

  const [session, setSession] = React.useState<Session | null>(() =>
    getSessionFromUserdata()
  );

  // Keep session in sync with userdata
  React.useEffect(() => {
    setSession(getSessionFromUserdata());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userdata]);

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(getSessionFromUserdata());
      },
      signOut: () => {
        setSession(null);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSessionFromUserdata]);

  const LogoutUser = async () => {
    try {
      // Get user_id from UserContext
      const user_id = userdata?.user_id ?? null;

      await axios.post(
        "http://localhost:5000/api/logout/user",
        { user_id }, // Pass user_id in the request body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      notifySuccess("Logout successful!");
      setSession(null);
      navigate("/login/admin");
    } catch (err) {
      console.log(err);
      if (err && typeof err === "object") {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        notifyError(
          errorObj.response?.data?.message ||
            errorObj.message ||
            "Logout failed. Please try again."
        );
      } else {
        notifyError("Logout failed. Please try again.");
      }
    }
  };

  function CustomPopoverContent() {
    return (
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <AccountPreview variant="expanded" />
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ThemeSwitcher />
        </Box>
        {/* You can use <Alert severity="info">Some info</Alert> here if needed */}
        <SignOutButton onClick={LogoutUser} />
      </Box>
    );
  }

  const demoTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
      colorSchemeSelector: "class",
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return (
    <AppProvider
      authentication={authentication}
      session={session}
      theme={demoTheme}
    >
      <Account
        slots={{
          popoverContent: CustomPopoverContent,
        }}
      />
    </AppProvider>
  );
}
