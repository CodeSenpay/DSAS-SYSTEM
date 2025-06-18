import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-screen h-screen bg-[#f0f2f5] flex flex-col gap-4 items-center justify-start">
      <NavBar />

      <div
        className=" w-full h-screen flex flex-col md:flex-row justify-center gap-3"
        style={{ padding: "10px" }}
      >
        <div
          className="w-full max-w-2xl flex-1 h-50 rounded-2xl bg-amber-400 hover:cursor-pointer hover:bg-amber-500 bg-[url('/SubsidyBg.png')] bg-cover bg-center shadow-2xl transition transform hover:scale-95 active:scale-90"
          style={{ padding: "10px" }}
          onClick={() => navigate("/subsidy-payout")}
        >
          <p>Subsidy payout</p>
        </div>
        <div
          className="w-full max-w-2xl flex-1 h-50 rounded-2xl bg-amber-400 hover:cursor-pointer hover:bg-amber-500 bg-[url('/ClearanceValidation.png')] bg-cover bg-center shadow-2xl transition transform hover:scale-95 active:scale-90"
          style={{ padding: "10px" }}
          onClick={() => navigate("/clearance-validation")}
        >
          <p className="text-white">Schedule for clearance</p>
        </div>
        <div
          className="w-full max-w-2xl flex-1 h-50 rounded-2xl bg-amber-400 hover:cursor-pointer hover:bg-amber-500 bg-[url('/ClaimingOfID.png')] bg-cover bg-center shadow-2xl transition transform hover:scale-95 active:scale-90"
          style={{ padding: "10px" }}
          onClick={() => navigate("/school-id")}
        >
          <p className="text-white">Claiming of school ID schedule</p>
        </div>
      </div>
    </div>
  );
}
