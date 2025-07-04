import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useUser } from "../services/UserContext";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { userdata } = useUser();

  return (
    <>
      <NavBar />
      <div
        className="min-w-screen min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center"
        style={{
          backgroundColor: "#f3f4f6",
          backgroundImage: `
          repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
          repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <h1>WELCOME {userdata?.user_level}</h1>
        <div
          className="w-full flex flex-col gap-3 md:flex-row justify-center"
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
    </>
  );
}
