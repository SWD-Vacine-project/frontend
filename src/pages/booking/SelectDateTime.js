import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../components/context/BookingContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import styled from "styled-components";
import { hover } from "framer-motion";
import { useLocation } from "react-router-dom"

// Tạo CSS với makeStyles
export const useStyles = makeStyles((theme) => ({
  dateTimeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "20px",
    marginTop: "100px",
    minHeight: "100vh",
    fontSize: "18px",
    marginBottom: "30px",
  },
  dateTimeSelection: {
    display: "flex",
    maxWidth: "85%",
    width: "100%",
    padding: "30px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
  },
  formColumn: {
    flex: 1,
    paddingRight: "20px",
  },
  slotsColumn: {
    flex: 1,
    marginTop: "20px",
    paddingLeft: "20px",
  },
  selDateFormGroup: {
    marginBottom: "20px",
    display: "block",
    fontSize: "1.1em",
    padding: "12px",
  },
  slotsGroup: {
    margin: "20px",
  },
  slotsGroupH2: {
    display: "flex",
    justifyContent: "start",
    marginBottom: "20px",
  },
  timeSlots: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  timeSlotsButton: {
    flex: 1,
    minWidth: "100px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#ebeff2",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "2rem",
    "&.selected": {
      color: "#000",
      border: "#7b2cbf",
      minWidth: "110px",
      borderStyle: "solid",
    },
  },
  slotRowButton: {
    backgroundColor: "#fff",
    color: "#000",
    "&:disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  iconRight: {
    marginLeft: "4px",
    fontSize: "2rem",
  },
  iconLeft: {
    marginRight: "4px",
    fontSize: "2rem",
  },
  buttonService: {
    marginTop: "20px",
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: "var(--neon-color)",
    "&:hover": {
      backgroundColor: "var(--main-color)",
    },
    "&:disabled:hover": {
      cursor: "not-allowed",
      background: "#ccc",
    },
  },
  buttonService1: {
    marginTop: "0",
  },
  backButton: {
    "&hover": {
      backgroundColor: "#c82333",
    },
  },
}));

const StyledCalendar = styled(Calendar)`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    slots.push({ timeString, formattedTime });
    currentTime += interval;
  }

  return slots;
};

const SelectDateTime = () => {
  const classes = useStyles(); // Sử dụng CSS classes
  const { setSelectedDateTime } = useContext(BookingContext);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);

  const morningSlots = generateTimeSlots(600, 720, 15); // 10:00 AM to 11:45 AM
  const afternoonSlots = generateTimeSlots(720, 1080, 15); // 12:00 PM to 4:45 PM
  const location = useLocation();
  const handleNext = async () => {
    if (date && selectedTime) {
      // const serviceNames = selectedServices.map((service) => service.name);

      // if (!selectedPet.name || serviceNames.length === 0) {
      //   alert(
      //     "Pet ID or Service Names are missing. Please check your selection."
      //   );
      //   return;
      // }

      try {
        const newBookedSlot = {
          date,
          time: selectedTime,
        };
        setBookedSlots([...bookedSlots, newBookedSlot]);
        setSelectedDateTime({
          date,
          time: selectedTime,
        });

        // Truyền dữ liệu qua state
        navigate("/book/booking-confirm", {
          state: {
            date,
            time: selectedTime,
          },
        });
      } catch (error) {
        console.error("Error processing booking:", error);
        alert("There was an error processing your booking. Please try again.");
      }
    } else {
      alert("Please select a date and time.");
    }
  };

  const handleConfirm = () => {
    if (date && selectedTime) {
      navigate("/book/confirm", {
        state: {
          date: date, // Đổi selectedDate thành date
          time: selectedTime,
          cartItems: location.state?.cartItems, // Thêm cartItems vào state
        }
      });
    }
  };
  
  

  const tileDisabled = ({ date }) => {
    const today = new Date();
    return date < today.setHours(0, 0, 0, 0);
  };

  const handleDateChange = (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  };

  
  const renderTimeSlots = (slots) => {
    const currentTime = new Date();
    const currentDay = currentTime.getDate();
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const cutoffTime = currentMinutes + 30;

    return slots.map((slot) => {
      const [slotHours, slotMinutes] = slot.timeString.split(":").map(Number);
      const slotTime = slotHours * 60 + slotMinutes;
      const isPast =
        currentDay === Number(date.split("-")[2]) && slotTime <= cutoffTime;

      const isBooked = bookedSlots.some(
        (bookedSlot) =>
          bookedSlot.date === date &&
          bookedSlot.time === slot.timeString &&
          (bookedSlot.status === "Paid" ||
            bookedSlot.status === "Checked-in" ||
            bookedSlot.status === "Rated")
      );

      return (
        <button
          key={slot.timeString}
          onClick={() => setSelectedTime(slot.timeString)}
          className={`${classes.button} ${
            selectedTime === slot.timeString ? classes.selected : ""
          }`}
          style={{ margin: "5px", width: "120px" }}
          disabled={isBooked || isPast}
        >
          {slot.formattedTime}
        </button>
      );
    });
  };

  // if (!selectedPet || selectedServices.length === 0) {
  //   return (
  //     <div className={classes.dateTimeContainer}>
  //       <h1>
  //         No pet or services selected. Please go back and select a pet and
  //         services.
  //       </h1>
  //       <button
  //         className={classes.backButton}
  //         onClick={() => navigate("/book/select-pet")}
  //       >
  //         Go Back to Pet Selection
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className={classes.dateTimeContainer}>
      <div className={classes.dateTimeSelection}>
        <div className={classes.formColumn}>
          <h1>
            Select Date and Time for{" "}
            <span className={classes.servicePetName}>{}</span>
          </h1>
          <div className={classes.selDateFormGroup}>
            <label>Date:</label>
            <StyledCalendar
              className={classes.calendar}
              onChange={handleDateChange}
              value={date}
              tileDisabled={tileDisabled}
            />
          </div>
        </div>
        <div className={classes.slotsColumn}>
          {date && (
            <>
              <div className={classes.slotsGroup}>
                <h2>Morning Slots</h2>
                <div className={classes.timeSlots}>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(morningSlots.slice(0, 4))}
                  </div>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(morningSlots.slice(4))}
                  </div>
                </div>
              </div>
              <div className={classes.slotsGroup}>
                <h2>Afternoon Slots</h2>
                <div className={classes.timeSlots}>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(afternoonSlots.slice(0, 4))}
                  </div>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(afternoonSlots.slice(4, 8))}
                  </div>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(afternoonSlots.slice(8, 12))}
                  </div>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(afternoonSlots.slice(12, 16))}
                  </div>
                  <div className={classes.slotRow}>
                    {renderTimeSlots(afternoonSlots.slice(16, 20))}
                  </div>
                </div>
              </div>
              <button
                className={classes.backButton}
                onClick={() => navigate(-1)}
              >
                <FontAwesomeIcon
                  className={classes.iconLeft}
                  icon={faCaretLeft}
                />{" "}
                BACK
              </button>
              <button
                className={classes.button}
                onClick={handleNext}
                disabled={!date || !selectedTime}
              >
                NEXT{" "}
                <FontAwesomeIcon
                  className={classes.iconRight}
                  icon={faCaretRight}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectDateTime;