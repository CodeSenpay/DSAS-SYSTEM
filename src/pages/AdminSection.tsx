import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { createTheme } from "@mui/material/styles";
import type { Navigation, Router } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useMemo, useState } from "react";

import AddAvailability from "./AddAvailability";
import AdminDashboard from "./AdminDashboard";
import ApproveTransactionPage from "./ApproveTransactionPage";
import ReportPage from "./ReportPage";

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
    segment: "add-availability",
    title: "Add Availability",
    icon: <AddIcon />,
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
    children: [
      {
        segment: "subsidy",
        title: "Subsidy Program",
        icon: <LocalAtmIcon />,
      },
      {
        segment: "clearance",
        title: "Clearance Validation",
        icon: <FactCheckIcon />,
      },
      {
        segment: "school-id",
        title: "Claiming of School ID",
        icon: <AccountBoxIcon />,
      },
    ],
  },
  {
    segment: "report-page",
    title: "Report",
    icon: <ArticleIcon />,
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
    case "/add-availability":
      return <AddAvailability />;
    case "/approve-transactions/subsidy":
      return <ApproveTransactionPage />;
    case "/report-page":
      return <ReportPage />;
    default:
      return <h2>404 - Page not found</h2>;
  }
}

export default function AdminDashboardPage() {
  const router = useDemoRouter("/admin-dashboard");

  // Remove this const when copying and pasting into your project.

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src="/LogoPNG.png" />,
        title: "JRMSU DSASADMIN",
      }}
    >
      <DashboardLayout>
        <PageContainer title="" breadcrumbs={[]}>
          {renderCurrentPage(router.pathname)}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
