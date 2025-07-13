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
        className="w-screen h-screen bg-[#f0f2f5] flex flex-col items-center justify-start gap-5"
        style={{
          backgroundColor: "#f3f4f6",
          backgroundImage: `
          repeating-linear-gradient(135deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px),
          repeating-linear-gradient(225deg, #e5e7eb 0px, #e5e7eb 2px, transparent 2px, transparent 40px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <div
          className="mb-8 flex flex-col items-center"
          style={{ padding: 20, marginTop: "100px" }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome,{" "}
            <span className="text-amber-500">
              {userdata?.student_details?.student_name}
            </span>
            !
          </h1>
          <p className="text-lg text-gray-600">
            We're glad to see you. Select a service below to get started.
          </p>
        </div>
        <div
          className="w-full flex flex-col gap-5 h-screen bg-amber-400 md:bg-transparent md:flex-row md:gap-3 justify-center"
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
