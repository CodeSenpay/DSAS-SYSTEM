import axios from "axios";
import { useEffect, useState } from "react";

type TimeWindow = {
  end_time_am: string;
  end_time_pm: string;
  start_time_am: string;
  start_time_pm: string;
  time_window_id: number;
  capacity_per_day: number;
  total_slots_left: number;
  availability_date: string;
};

type Availability = {
  availability_id: number;
  transaction_title: string;
  transaction_type_id: number;
  start_date: string;
  end_date: string;
  created_by: number;
  created_at: string;
  time_windows: TimeWindow[];
};

const API_URL = "http://localhost:5000/api/scheduling-system/user"; // Change to your actual API endpoint

function AdjustAvailability() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  const getAvailability = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: {
        searchkey: "",
      },
    };

    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow-lg mb-4">
          Adjust Availability
        </h1>
        <select
          className="border border-blue-300 rounded-lg px-5 py-3 text-blue-900 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-full max-w-xs"
          defaultValue=""
        >
          <option value="" disabled>
            Select Transaction Type
          </option>
          <option value="Subsidy">Subsidy</option>
          <option value="Clearance">Clearance</option>
          <option value="Claiming of ID">Claiming of ID</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <span className="text-xl text-blue-500 font-semibold animate-pulse">
            Loading...
          </span>
        </div>
      ) : (
        <div className="space-y-10 max-w-6xl mx-auto">
          {availabilities.map((a) => (
            <div
              key={a.availability_id}
              className="bg-white/90 shadow-xl rounded-2xl p-8 border border-blue-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-1">
                    {a.transaction_title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium text-blue-600">
                      {a.start_date}
                    </span>
                    <span className="mx-2 text-blue-400">&rarr;</span>
                    <span className="font-medium text-blue-600">
                      {a.end_date}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold shadow">
                    Availability ID: {a.availability_id}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-blue-100">
                <table className="min-w-full text-sm text-blue-900">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                      <th className="px-4 py-3 border-b font-semibold">Date</th>
                      <th className="px-4 py-3 border-b font-semibold">
                        AM Time
                      </th>
                      <th className="px-4 py-3 border-b font-semibold">
                        PM Time
                      </th>
                      <th className="px-4 py-3 border-b font-semibold">
                        Capacity
                      </th>
                      <th className="px-4 py-3 border-b font-semibold">
                        Slots Left
                      </th>
                      <th className="px-4 py-3 border-b font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.time_windows.map((tw, idx) => (
                      <tr
                        key={tw.time_window_id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        <td className="px-4 py-3 border-b font-medium">
                          {tw.availability_date}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span className="inline-block bg-blue-50 px-2 py-1 rounded text-xs font-mono">
                            {tw.start_time_am} - {tw.end_time_am}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span className="inline-block bg-blue-50 px-2 py-1 rounded text-xs font-mono">
                            {tw.start_time_pm} - {tw.end_time_pm}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-center font-semibold">
                          {tw.capacity_per_day}
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              tw.total_slots_left > 5
                                ? "bg-green-100 text-green-700"
                                : tw.total_slots_left > 0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tw.total_slots_left}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition-all duration-200">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdjustAvailability;
