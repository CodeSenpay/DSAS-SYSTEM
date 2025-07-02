import { Button } from "@mui/material";
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

function getSessionFromStorage(): Session | null {
  try {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;
    const userData = JSON.parse(userStr);
    return {
      user: {
        name: `${userData.first_name} ${userData.middle_name ?? ""} ${userData.last_name}`
          .replace(/\s+/g, " ")
          .trim(),
        email: userData.email,
        image: "https://avatars.githubusercontent.com/u/19550456", // You can update this if you have user image
      },
    };
  } catch {
    return null;
  }
}

type AccountCustomSlotPropsProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccountCustomSlotProps({
  setIsModalOpen,
}: AccountCustomSlotPropsProps) {
  const [session, setSession] = React.useState<Session | null>(
    getSessionFromStorage()
  );

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(getSessionFromStorage());
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  const navigate = useNavigate();

  const LogoutUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      notifySuccess("Logout successful!");
      sessionStorage.removeItem("user");
      setSession(null);
      navigate("/login/admin");
    } catch (err: any) {
      console.log(err);
      notifyError(
        err?.response?.data?.message ||
          err?.message ||
          "Logout failed. Please try again."
      );
    }
  };

  function handleRegisterAdmin() {
    setIsModalOpen(true);
  }

  function CustomPopoverContent() {
    return (
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <AccountPreview variant="expanded" />
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ThemeSwitcher />
        </Box>
        <Button variant="contained" onClick={handleRegisterAdmin}>
          Register Admin
        </Button>

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
