import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
function App() {
  return (
    <>
      <h1 className="text-lg text-green-500">Hello World</h1>
      <p>This is the paragraph section</p>
    </>
  );
}

export default App;
