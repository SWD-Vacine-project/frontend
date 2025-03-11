import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./SchedulePage.css";
import { useRef } from "react";


interface Appointment {
  appointmentId: number;
  customerId: number;
  childId: number;
  staffId: number;
  doctorId: number;
  vaccineType: string;
  vaccineId: number;
  comboId: number | null;
  appointmentDate: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface Child {
  childId: number;
  customerId: number;
  name: string;
  dob: string;
  gender: string;
  bloodType: string;
  appointments: Appointment[];
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  children: Child[];
}


const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const user = getUserFromLocalStorage();
  const calendarRef = useRef<FullCalendar>(null);


  useEffect(() => {
    if (!user) return;

    // Fetch danh sách trẻ của user
    fetch(`https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Child/get-child/${user.id}`)
      .then(res => res.json())
      .then(setChildren)
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      // Fetch lịch hẹn theo childId
      fetch(`https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Appointment/get-appointment-by-childid/${selectedChild}`)
        .then(res => res.json())
        .then(setAppointments)
        .catch(console.error);
    }
  }, [selectedChild]);

  useEffect(() => {
    if (appointments.length > 0 && calendarRef.current) {
      const firstAppointmentDate = new Date(appointments[0].appointmentDate);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(firstAppointmentDate);
    }
  }, [appointments]);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setSelectedTime(null); // Reset time khi chọn ngày mới
  };

  const handleUpdateDate = () => {
    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ ngày và giờ trước khi cập nhật.");
      return;
    }

    const confirmUpdate = window.confirm(
      "Bạn có muốn cập nhật lịch tiêm chủng không?"
    );

    if (confirmUpdate) {
      const dateTime = `${selectedDate}T${selectedTime}`;
      alert(`Đã cập nhật lịch hẹn: ${new Date(dateTime).toLocaleString()}`);
      // Gọi API cập nhật ở đây
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const status = eventInfo.event.extendedProps?.status;
    const backgroundColor = `${getStatusColor(status)}20`;
    const borderColor = getStatusColor(status);

    return (
      <div style={{
        padding: '5px',
        borderRadius: '4px',
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`
      }}>
        <div style={styles.eventTitle}>{eventInfo.event.title}</div>
        <div style={styles.eventTime}>
          {eventInfo.timeText}
        </div>
      </div>
    );
  };


  const getStatusColor = (status?: string) => {
    const statusColors = {
      'Pending': '#f59e0b',
      'Completed': '#10b981',
      'Cancelled': '#ef4444'
    };
    return status ? statusColors[status as keyof typeof statusColors] : '#6b21a8';
  };

  useEffect(() => {
    if (selectedChild) {
      fetch(`...`)
        .then(res => res.json())
        .then(data => {
          const sortedAppointments = data.sort((a: Appointment, b: Appointment) => 
            new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
          );
          setAppointments(sortedAppointments);
        })
        .catch(console.error);
    }
  }, [selectedChild]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Lịch Tiêm Chủng</h1>

      {/* Dropdown chọn trẻ */}
      <div style={styles.childSelector}>
        <label>Chọn trẻ: </label>
        <select
          value={selectedChild || ""}
          onChange={(e) => setSelectedChild(Number(e.target.value))}
          style={styles.select}
        >
          <option value="">-- Chọn trẻ --</option>
          {children.map((child) => (
            <option key={child.childId} value={child.childId}>
              {child.name} ({new Date().getFullYear() - new Date(child.dob).getFullYear()} tuổi)
            </option>
          ))}
        </select>
      </div>

      {selectedChild ? (
        <div className="custom-toolbar">
          <FullCalendar
           ref={calendarRef}
           plugins={[dayGridPlugin, interactionPlugin]}
           initialView="dayGridMonth"
           initialDate={appointments[0]?.appointmentDate} 
            dateClick={handleDateClick}
            events={appointments.map(appt => ({
              title: `${appt.vaccineType}`,
              start: new Date(appt.appointmentDate).toISOString(), // Chuyển đổi sang ISO string
              extendedProps: {
                status: appt.status
              }
            }))}
            eventContent={renderEventContent}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            height={600}
          />
        </div>
      ) : (
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}>👶</div>
          <p>Vui lòng chọn trẻ để xem lịch tiêm chủng</p>
        </div>
      )}

      {selectedDate && (
        <div style={styles.selectionContainer}>
          <p>Ngày đã chọn: {selectedDate}</p>
          <div>
            <label>Chọn giờ: </label>
            <input
              type="time"
              value={selectedTime || ""}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          <button style={styles.button} onClick={handleUpdateDate}>
            Cập Nhật Lịch Hẹn
          </button>
        </div>
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
 
  dayCell: {
    padding: "6px",
    borderRadius: "6px",
    backgroundColor: "rgba(157, 109, 255, 0.1)", // Pastel purple
    color: "#333",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    fontWeight: "500",
  
  
  },selectionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f5ff',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  timePicker: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  timeInput: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ddd',
    fontSize: 16
  },
  // Cập nhật selectedDate để căn trái
  selectedDate: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#7c3aed",
    textAlign: 'left',
    margin: '10px 0'
  },
  // Cập nhật button để full width
  button: {
    width: '100%',
    marginTop: "10px",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  childSelector: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    minWidth: '250px',
    fontSize: '16px'
  },
  placeholder: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f5ff',
    borderRadius: '12px',
    marginTop: '20px'
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  eventTitle: {
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.9em'
  },
  eventTime: {
    fontSize: '0.8em',
    opacity: 0.8,
    marginTop: '2px'
  },
  calendarContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }
};

export default SchedulePage;
