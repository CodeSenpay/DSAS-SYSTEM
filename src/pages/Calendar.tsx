import { format } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import Modal from "../components/Modal";

type calendarProps = {
  transactionType?: string;
};

function Calendar({ transactionType }: calendarProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fullyBooked = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 20),
    new Date(2025, 5, 16),
  ];
  console.log(new Date(2025, 5, 15));

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
      <p>{transactionType}</p>
      <DayPicker
        animate
        className="bg-white rounded-lg shadow-md"
        style={{ padding: "20px" }}
        mode="single"
        selected={selected}
        defaultMonth={new Date(2025, 5)}
        onSelect={handleDateSelection}
        disabled={fullyBooked}
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
