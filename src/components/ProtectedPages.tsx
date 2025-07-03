import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { verifyToken } from "../services/verifyToken";
import { notifyError } from "./ToastUtils";
function ProtectedPages() {
  const navigate = useNavigate();

  async function verifyUser() {
    const response = await verifyToken();


    if (!response.success) {
      notifyError(response.message);
      navigate("/login");
      return;
    }

    // if (response.user.userLevel !== "ADMIN") {
    //   notifyError("Access denied: Admins only.");
    //   navigate("/login/admin");
    //   return;
    // }
    // If success and user is ADMIN, do nothing and allow access
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return <Outlet />;
}

export default ProtectedPages;
