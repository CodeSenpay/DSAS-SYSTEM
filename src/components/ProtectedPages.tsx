import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { verifyToken } from "../services/verifyToken";
import { notifyError } from "./ToastUtils";
function ProtectedPages() {
  const navigate = useNavigate();

  async function verifyUser() {
    const response = await verifyToken();

    console.log(response);

    if (!response.success) {
      notifyError(response.message);
      navigate("/login");
      return;
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return <Outlet />;
}

export default ProtectedPages;
