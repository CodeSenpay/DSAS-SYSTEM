import { lazy, Suspense, useEffect } from "react";
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
import axios from "axios";
import { useUser } from "./services/UserContext";

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

  const { setUser } = useUser();

  async function getUserData(params: any) {
    try {
      // Extract student_id or user_id from params
      const { student_id, user_id } = params;
      const id = student_id || user_id;

      if (!id) {
        throw new Error("No student_id or user_id found in params");
      }

      const response = await axios.post(
        `http://localhost:5000/api/auth/get-user-data`,
        { id },
        { withCredentials: true }
      );
      // console.log("Get userdata response: ", response);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  }

  useEffect(() => {
    const verifyAndFetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/verify-jwt", { withCredentials: true });
        if (res.data.success) {
          const userData = await getUserData(res.data.user);
          setUser(userData);
          // console.log(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    verifyAndFetchUser();
  }, [setUser]);


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
            element={<CalendarPage setIsOpenCalendar={() => { }} />}
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
