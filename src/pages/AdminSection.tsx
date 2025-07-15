import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { createTheme } from "@mui/material/styles";
import type { Navigation, Router } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import React, { useMemo, useState } from "react";
import AccountCustomSlotProps from "../components/AccountCustomSlotProps";
import Modal from "../components/Modal";
import AddAvailability from "./AddAvailability";
import AdminDashboard from "./AdminDashboard";
import ApproveTransactionPage from "./ApproveTransactionPage";
import RegisterAdminPage from "./RegisterAdminPage";
import ReportPage from "./ReportPage";
import ViewAvailability from "./ViewAvailability";
const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "admin-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "manage-availability",
    title: "Add Availability",
    icon: <ManageSearchIcon />,
    children: [
      {
        segment: "add-availability",
        title: "Add Availability",
        icon: <AddIcon />,
      },
      {
        segment: "view-availability",
        title: "View Availability",
        icon: <CalendarViewDayIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "approve-transactions",
    title: "Approve Transactions",
    icon: <EventAvailableIcon />,
  },
  {
    segment: "report-page",
    title: "Report",
    icon: <ArticleIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Account",
  },
  {
    segment: "register-admin",
    title: "Register Admin",
    icon: <SupervisorAccountIcon />,
  },
];

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

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

// 🧠 Page loader based on current path
function renderCurrentPage(pathname: string) {
  switch (pathname) {
    case "/admin-dashboard":
      return <AdminDashboard />;
    case "/manage-availability/add-availability":
      return <AddAvailability />;
    case "/manage-availability/view-availability":
      return <ViewAvailability />;
    case "/approve-transactions":
      return <ApproveTransactionPage />;
    case "/report-page":
      return <ReportPage />;
    case "/register-admin":
      return <RegisterAdminPage />;
    default:
      return <h2>404 - Page not found</h2>;
  }
}

export default function AdminDashboardPage() {
  const router = useDemoRouter("/admin-dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Remove this const when copying and pasting into your project.
  function CustomToolbarActions() {
    return (
      <React.Fragment>
        <AccountCustomSlotProps />
      </React.Fragment>
    );
  }
  return (
    <>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
          <RegisterAdminPage />
        </Modal>
      )}
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        branding={{
          logo: <img src="/LogoPNG.png" />,
          title: "JRMSU DSAS ADMIN",
        }}
      >
        <div
          style={{
            backgroundColor: "#f3f4f6",
            backgroundImage: `
              repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
              repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
            `,
            backgroundSize: "40px 40px",
            minHeight: "100vh",
          }}
        >
          <DashboardLayout slots={{ toolbarActions: CustomToolbarActions }}>
            <PageContainer title="" breadcrumbs={[]}>
              {renderCurrentPage(router.pathname)}
            </PageContainer>
          </DashboardLayout>
        </div>
      </AppProvider>
    </>
  );
}
