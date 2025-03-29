import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./SchedulePage.css";
import { useNavigate } from "react-router";

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
  // Các trường bổ sung trả về từ API
  child?: any;
  customer?: any;
  doctor?: any;
  feedbacks?: any[];
  healthRecords?: any[];
  staff?: any;
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

const getUserFromsessionStorage = () => {
  const userData = sessionStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const user = getUserFromsessionStorage();
  const calendarRef = useRef<FullCalendar>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Fetch danh sách trẻ của user
    fetch(`https://vaccine-system2.azurewebsites.net/Child/get-child/${user.id}`)
      .then(res => res.json())
      .then(setChildren)
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      fetch(`https://vaccine-system2.azurewebsites.net/Appointment/get-appointment-by-childid/${selectedChild}`)
        .then(res => {
          if (!res.ok) throw new Error('Lỗi tải lịch hẹn');
          return res.json();
        })
        .then(data => {
          if (!Array.isArray(data)) {
            navigate("/vaccine");
            return;
          }
          
          const sortedAppointments = data.sort((a: Appointment, b: Appointment) => 
            new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
          );
          
          setAppointments(sortedAppointments);
          
          // Nếu chỉ có 1 lịch hẹn thì tự động chọn, nếu có nhiều thì để người dùng chọn
          if (sortedAppointments.length === 1) {
            const firstAppointment = sortedAppointments[0];
            setSelectedAppointment(firstAppointment);
            const currentDate = new Date(firstAppointment.appointmentDate);
            setSelectedDate(currentDate.toISOString().split('T')[0]);
            setSelectedTime(currentDate.toTimeString().substring(0, 5));
          } else {
            setSelectedAppointment(null);
            setSelectedDate(null);
            setSelectedTime(null);
          }
        })
        .catch(error => {
          console.error("Lỗi khi gọi API:", error);
          alert("Vui lòng đặt lịch tiêm trước");
          navigate("/vaccine");
        });
    }
  }, [selectedChild, navigate]);
  
  useEffect(() => {
    if (appointments.length > 0 && calendarRef.current) {
      // Nếu đã chọn lịch hẹn thì điều chỉnh lịch của calendar tới ngày của lịch đó
      const targetDate = selectedAppointment 
        ? new Date(selectedAppointment.appointmentDate) 
        : new Date(appointments[0].appointmentDate);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(targetDate);
    }
  }, [appointments, selectedAppointment]);

  // Khi người dùng click vào ngày trên calendar, cập nhật selectedDate nếu đã chọn lịch hẹn
  const handleDateClick = (arg: any) => {
    if (selectedAppointment) {
      setTimeout(() => {
        setSelectedDate(arg.dateStr);
      }, 0);
    }
  };
  
  
  const handleUpdateDate = async () => {
    if (!selectedAppointment) {
      alert("Vui lòng chọn lịch hẹn từ lịch hoặc danh sách");
      return;
    }
  
    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ ngày và giờ");
      return;
    }
  
    const newDateTime = `${selectedDate}T${selectedTime}:00`;
    if (!window.confirm(`Cập nhật lịch hẹn ${selectedAppointment.vaccineType}?\nThời gian mới: ${newDateTime}`))
      return;
  
    try {
      const response = await fetch(
        `https://vaccine-system2.azurewebsites.net/Appointment/update-appointment-date/${selectedAppointment.appointmentId}`, 
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          // Gửi trực tiếp giá trị newDateTime (chuỗi) thay vì object
          body: JSON.stringify(newDateTime)
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật thất bại: ${errorText}`);
      }
  
      const updatedAppointments = appointments.map(appt => 
        appt.appointmentId === selectedAppointment.appointmentId
          ? { ...appt, appointmentDate: newDateTime }
          : appt
      );
      
      setAppointments(updatedAppointments);
      setSelectedAppointment({ ...selectedAppointment, appointmentDate: newDateTime });
      alert("Cập nhật thành công!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Lỗi khi cập nhật lịch hẹn:", error.message);
        alert("Cập nhật thất bại: " + error.message);
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Cập nhật thất bại do lỗi không xác định.");
      }
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
      'Cancelled': '#ef4444',
      'Approved': '#3b82f6'
    };
    return status ? statusColors[status as keyof typeof statusColors] : '#6b21a8';
  };

  const handleEventClick = (info: any) => {
    setTimeout(() => {
      const appointmentId = info.event.extendedProps.appointmentId;
      const clickedAppointment = appointments.find(a => a.appointmentId === appointmentId);
      if (clickedAppointment) {
        setSelectedAppointment(clickedAppointment);
        const currentDate = new Date(clickedAppointment.appointmentDate);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
        setSelectedTime(currentDate.toTimeString().substring(0, 5));
      } else {
        console.warn('Không tìm thấy lịch hẹn với ID:', appointmentId);
      }
    }, 0);
  };

  const renderSelectedAppointmentInfo = () => {
    if (!selectedAppointment) return null;

    const apptDate = new Date(selectedAppointment.appointmentDate);
    
    return (
      <div style={styles.selectedInfo}>
        <h3>Lịch hẹn đang chọn:</h3>
        <div style={styles.appointmentDetail}>
          <p><strong>Vaccine:</strong> {selectedAppointment.vaccineType}</p>
          <p>
            <strong>Ngày hiện tại:</strong>{" "}
            {apptDate.toLocaleDateString()} {apptDate.toLocaleTimeString()}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span style={{ 
              color: getStatusColor(selectedAppointment.status),
              fontWeight: 'bold',
              marginLeft: 8
            }}>
              {selectedAppointment.status}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Lịch Tiêm Chủng</h1>

      {/* Dropdown chọn trẻ */}
      <div style={styles.childSelector}>
        <label>Chọn trẻ: </label>
        <select
          value={selectedChild || ""}
          onChange={(e) => {
            setSelectedChild(Number(e.target.value));
            // Reset lại lịch hẹn khi chọn trẻ mới
            setAppointments([]);
            setSelectedAppointment(null);
            setSelectedDate(null);
            setSelectedTime(null);
          }}
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

      {/* Nếu có nhiều lịch hẹn, cho phép chọn lịch hẹn qua dropdown */}
      {appointments.length > 1 && (
        <div style={styles.appointmentSelector}>
          <label>Chọn lịch hẹn: </label>
          <select
            value={selectedAppointment ? selectedAppointment.appointmentId : ""}
            onChange={(e) => {
              const apptId = Number(e.target.value);
              const appt = appointments.find(a => a.appointmentId === apptId);
              if (appt) {
                setSelectedAppointment(appt);
                const currentDate = new Date(appt.appointmentDate);
                setSelectedDate(currentDate.toISOString().split('T')[0]);
                setSelectedTime(currentDate.toTimeString().substring(0, 5));
              }
            }}
            style={styles.select}
          >
            <option value="">-- Chọn lịch hẹn --</option>
            {appointments.map(appt => (
              <option key={appt.appointmentId} value={appt.appointmentId}>
                {appt.vaccineType} - {new Date(appt.appointmentDate).toLocaleString()} - {appt.status}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedChild ? (
        <div className="custom-toolbar">
          <FullCalendar
            key={appointments.length}
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={appointments.map(appt => ({
              title: `${appt.vaccineType} - ${appt.status}`,
              start: new Date(appt.appointmentDate).toISOString(),
              extendedProps: {
                status: appt.status,
                appointmentId: appt.appointmentId
              },
              color: getStatusColor(appt.status)
            }))}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
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

      {renderSelectedAppointmentInfo()}

      {selectedAppointment && (
        <div style={styles.selectionContainer}>
          <h4>Thay đổi lịch hẹn:</h4>
          <div style={styles.datetimePicker}>
            <div>
              <label>Ngày mới: </label>
              <input
                type="date"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label>Giờ mới: </label>
              <input
                type="time"
                value={selectedTime || ""}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          <button 
            style={styles.button} 
            onClick={handleUpdateDate}
            disabled={!selectedDate || !selectedTime}
          >
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
    background: "linear-gradient(135deg, #f3e8ff, #ffffff)",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    color: "#333",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#6b21a8",
    marginBottom: "15px",
  },
  dayCell: {
    padding: "6px",
    borderRadius: "6px",
    backgroundColor: "rgba(157, 109, 255, 0.1)",
    color: "#333",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    fontWeight: "500",
  },
  selectionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f5ff",
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  timePicker: {
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  timeInput: {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ddd",
    fontSize: 16
  },
  selectedDate: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#7c3aed",
    textAlign: "left",
    margin: "10px 0"
  },
  button: {
    width: "100%",
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
    margin: "20px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center"
  },
  appointmentSelector: {
    margin: "20px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center"
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minWidth: "250px",
    fontSize: "16px"
  },
  placeholder: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f8f5ff",
    borderRadius: "12px",
    marginTop: "20px"
  },
  placeholderIcon: {
    fontSize: "48px",
    marginBottom: "10px"
  },
  eventTitle: {
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.9em"
  },
  eventTime: {
    fontSize: "0.8em",
    opacity: 0.8,
    marginTop: "2px"
  },
  calendarContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  selectedInfo: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#f0f9ff",
    border: "1px solid #7c3aed",
    borderRadius: "8px",
    color: "#1e40af",
    textAlign: "left"
  },
  appointmentDetail: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8
  },
  datetimePicker: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    margin: "15px 0"
  }
};

export default SchedulePage;
