import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DayCellContentArg } from '@fullcalendar/core';
import "./SchedulePage.css"; // Import external CSS for button styling

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Lịch Tiêm Chủng</h1>
      <div className="custom-toolbar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          height={600}
          dayCellContent={(e: DayCellContentArg) => (
            <div style={styles.dayCell}>{e.dayNumberText}</div>
          )}
        />
      </div>
      {selectedDate && (
        <p style={styles.selectedDate}>Ngày đã chọn: {selectedDate}</p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    background: "linear-gradient(135deg, #f3e8ff, #ffffff)", // Light lavender
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    color: "#333",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#6b21a8", // Deep purple
    marginBottom: "15px",
  },
  selectedDate: {
    marginTop: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#7c3aed", // Soft purple
    padding: "8px",
    borderRadius: "6px",
    background: "rgba(124, 58, 237, 0.1)", // Light purple background
    display: "inline-block",
  },
  dayCell: {
    padding: "6px",
    borderRadius: "6px",
    backgroundColor: "rgba(157, 109, 255, 0.1)", // Pastel purple
    color: "#333",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default SchedulePage;
