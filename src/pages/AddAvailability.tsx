import axios from "axios";
import React, { useState } from "react";

const transactionTypes = [
  "Subsidy",
  "",
  "Document Request",
  // Add more types as needed
];

function AddAvailability() {
  const [transactionType, setTransactionType] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [capacity, setCapacity] = useState(15); // Default capacity
  const [timeRanges, setTimeRanges] = useState<
    {
      date: string;
      amStart: string;
      amEnd: string;
      pmStart: string;
      pmEnd: string;
    }[]
  >([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy mapping for transaction type to id
  const transactionTypeMap: Record<string, number> = {
    Subsidy: 1,
    "Document Request": 2,
    // Add more as needed
  };

  // Generate dates in range
  const getDatesInRange = (start: string, end: string) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    setTimeRanges([]); // Reset time ranges when date range changes
    setSuccess(false);
    setError(null);
  };

  const handleSetTimeRanges = () => {
    if (dateRange.start && dateRange.end) {
      const dates = getDatesInRange(dateRange.start, dateRange.end);
      setTimeRanges(
        dates.map((date) => ({
          date,
          amStart: "",
          amEnd: "",
          pmStart: "",
          pmEnd: "",
        }))
      );
      setSuccess(false);
      setError(null);
    }
  };

  const handleTimeChange = (
    idx: number,
    field: "amStart" | "amEnd" | "pmStart" | "pmEnd",
    value: string
  ) => {
    setTimeRanges((prev) =>
      prev.map((tr, i) => (i === idx ? { ...tr, [field]: value } : tr))
    );
    setSuccess(false);
    setError(null);
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapacity(Number(e.target.value));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare payload
      const payload = {
        model: "schedulesModel",
        function_name: "insertAvailability",
        payload: {
          transaction_type_id: transactionTypeMap[transactionType] || 1,
          start_date: dateRange.start,
          end_date: dateRange.end,
          capacity_per_day: capacity,
          created_by: 1, // Replace with actual user id if available
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          time_windows: timeRanges.map((tr) => ({
            availability_date: tr.date,
            start_time_am: tr.amStart ? `${tr.amStart}:00` : "",
            end_time_am: tr.amEnd ? `${tr.amEnd}:00` : "",
            start_time_pm: tr.pmStart ? `${tr.pmStart}:00` : "",
            end_time_pm: tr.pmEnd ? `${tr.pmEnd}:00` : "",
          })),
        },
      };

      console.log(payload);

      // Replace with your API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/admin",
        payload,
        {
          headers: { "Content-Type": "application-json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      //   setSuccess(true);
      //   setLoading(false);
    } catch (err: any) {
      setError("Failed to save availability.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-10">
      <form
        className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-blue-100"
        style={{ padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white rounded-full p-3 shadow-lg">
            <svg
              width={28}
              height={28}
              fill="none"
              viewBox="0 0 24 24"
              className="inline"
            >
              <rect width="24" height="24" rx="12" fill="#2563eb" />
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="5"
                y="10"
                width="14"
                height="9"
                rx="2"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path
                d="M9 15h.01M12 15h.01M15 15h.01"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">
            Add Availability
          </h2>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Transaction Type
          </label>
          <select
            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium transition"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {transactionTypes.map((type) =>
              type ? <option key={type}>{type}</option> : null
            )}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Capacity Per Day
          </label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={handleCapacityChange}
            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium transition"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="w-full px-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">
              End Date
            </label>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="w-full px-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium"
              required
            />
          </div>
          <button
            type="button"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50"
            disabled={!dateRange.start || !dateRange.end}
            onClick={handleSetTimeRanges}
          >
            Set Dates
          </button>
        </div>
        {timeRanges.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
              <svg
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 20 20"
                className="inline"
              >
                <rect width="20" height="20" rx="10" fill="#2563eb" />
                <path
                  d="M6 10h8M10 6v8"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Set Time Ranges for Each Date
            </h3>
            <div className="space-y-6">
              {timeRanges.map((tr, idx) => (
                <div
                  key={tr.date}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="font-semibold text-blue-700 mb-2 md:mb-0 md:w-32">
                    {tr.date}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">AM</span>
                      <input
                        type="time"
                        value={tr.amStart}
                        onChange={(e) =>
                          handleTimeChange(idx, "amStart", e.target.value)
                        }
                        className="px-2 py-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 font-medium"
                        required
                      />
                      <span className="mx-1 text-gray-400">-</span>
                      <input
                        type="time"
                        value={tr.amEnd}
                        onChange={(e) =>
                          handleTimeChange(idx, "amEnd", e.target.value)
                        }
                        className="px-2 py-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 font-medium"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">PM</span>
                      <input
                        type="time"
                        value={tr.pmStart}
                        onChange={(e) =>
                          handleTimeChange(idx, "pmStart", e.target.value)
                        }
                        className="px-2 py-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 font-medium"
                        required
                      />
                      <span className="mx-1 text-gray-400">-</span>
                      <input
                        type="time"
                        value={tr.pmEnd}
                        onChange={(e) =>
                          handleTimeChange(idx, "pmEnd", e.target.value)
                        }
                        className="px-2 py-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {timeRanges.length > 0 && (
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-600 transition"
              style={{ padding: "5px" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Availability"}
            </button>
          </div>
        )}
        {success && (
          <div className="mt-6 text-green-600 font-semibold text-center">
            Availability saved successfully!
          </div>
        )}
        {error && (
          <div className="mt-6 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddAvailability;
