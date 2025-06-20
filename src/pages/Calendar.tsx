import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import Modal from "../components/Modal";
import { notifyError } from "../components/ToastUtils";

type calendarProps = {
  transaction_title?: string;
};

type timewindowProps = {
  end_time_am: string;
  end_time_pm: string;
  start_time_am: string;
  start_time_pm: string;
  time_window_id: number;
  availability_date: string;
};

type availableDatesProps = {
  availability_date: string;
  availability_id: number;
  capacity_per_day: number;
  created_at: string;
  created_by: number;
  end_date: string;
  start_date: string;
  time_windows: timewindowProps[];
  transaction_title: string;
};

function Calendar({ transaction_title }: calendarProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<availableDatesProps[]>(
    []
  );

  const [parsedAvailableDates, setParsedAvailableDates] = useState<Date[]>([]);

  const fullyBooked = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 20),
    new Date(2025, 5, 16),
  ];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
      setIsOpen(true);
      setSelected(date);
      selected
        ? setFormattedDate(format(selected, "yyyy-MM-dd"))
        : setFormattedDate("");
    }
  };

  const parsedDates = async (mappedTime: timewindowProps[][]) => {
    console.log("Mapped Data:");
    console.log(mappedTime);
    const availableDates: Date[] = mappedTime
      .filter((item) => item.length > 0)
      .map((innerArray) =>
        innerArray.map((date) => new Date(date.availability_date))
      )
      .flat();
    setParsedAvailableDates(availableDates);
    console.log("available dates:");
    console.log(availableDates);
  };

  const handleFetchingAvailableDates = async () => {
    const data = {
      model: "schedulesModel",
      function_name: "getAvailability",
      payload: {
        searchKey: "",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/scheduling-system/user",
        data,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.data.success) {
        console.log("Response:");
        console.log(response.data.data);
        setAvailableDates(response.data);

        if (response.data.data.length != 0) {
          const mappedTime: timewindowProps[][] = response.data.data.map(
            (item: availableDatesProps) =>
              item.transaction_title.toLowerCase() === "subsidy"
                ? item.time_windows
                : []
          );

          parsedDates(mappedTime);
        } else {
          notifyError("Can't Parse Dates");
        }
      } else {
        notifyError("Can't Fetch Available Dates");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("Calendar is Starting....");
    handleFetchingAvailableDates();
  }, []);

  return (
    <>
      {isOpen ? (
        <Modal isOpen={isOpen} handleClose={handleClose}>
          <h3>{formattedDate}</h3>
        </Modal>
      ) : (
        <></>
      )}

      <h1 className="text-xl font-semibold">Select a Date</h1>
      <p>Transaction: {transaction_title}</p>
      <DayPicker
        animate
        className="bg-white rounded-lg shadow-md"
        style={{ padding: "20px" }}
        mode="single"
        selected={selected}
        defaultMonth={new Date(2025, 5)}
        onSelect={handleDateSelection}
        modifiers={{ available: parsedAvailableDates }}
        modifiersClassNames={{
          available: "text-blue-500",
        }}
        disabled={(date) =>
          !parsedAvailableDates.some(
            (d) => d.toDateString() === date.toDateString()
          )
        }
        footer={
          selected
            ? `Selected: ${selected.toLocaleDateString()}`
            : "Pick a day."
        }
      />
    </>
  );
}

export default Calendar;
