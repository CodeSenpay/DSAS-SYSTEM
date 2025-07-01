import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "./components/Loading";
import ProtectedPages from "./components/ProtectedPages";
import LoginPage from "./pages/LoginPage";
import LoginPageStudent from "./pages/LoginPageStudent";
const NotFoundPage = lazy(() => import("./components/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CalendarPage = lazy(() => import("./pages/Calendar"));
const VMGOPage = lazy(() => import("./pages/VMGOPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SubsidyPayoutPage = lazy(() => import("./pages/SubsidyPayoutPage"));
const AdminDashboard = lazy(() => import("./pages/AdminSection"));

const ClearanceValidationPage = lazy(
  () => import("./pages/ClearanceValidationPage")
);
const ClaimingOfIDPage = lazy(() => import("./pages/ClaimingOfIDPage"));
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="/login" element={<LoginPageStudent />} />
        <Route path="/login/admin" element={<LoginPage />} />

        <Route element={<ProtectedPages />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/calendar"
            element={<CalendarPage setIsOpenCalendar={() => {}} />}
          />
          <Route path="/vmgo" element={<VMGOPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subsidy-payout" element={<SubsidyPayoutPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route
            path="/clearance-validation"
            element={<ClearanceValidationPage />}
          />
          <Route path="/school-id" element={<ClaimingOfIDPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeButton={false}
        rtl={false}
        pauseOnHover
        draggable
      />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
