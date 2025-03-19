import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import moment from "moment";
import { makeStyles } from "@mui/styles";

// Define the Appointment interface
interface Appointment {
  appointmentId: string;
  customerId: string;
  appointmentDate: string;
  status: string;
  reaction?: string;
}

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    backgroundColor: "#4D9FEC",
    color: "white",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#4D9FEC",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#3B8ECB",
    },
  },
}));

const VaccinationProgress = () => {
  const classes = useStyles();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<{ [key: string]: string }>({});

  const handleReactionChange = (appointmentId: string, value: string) => {
    setReactions((prev) => ({
      ...prev,
      [appointmentId]: value,
    }));
  };

  // Fetch appointments với status "InProgress" và loại bỏ những appointment đã submit (dựa vào localStorage)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<Appointment[]>(
          "https://vaccine-system1.azurewebsites.net/Appointment/get-appointments"
        );
        const submittedAppointments = JSON.parse(
          localStorage.getItem("submittedAppointments") || "[]"
        );
        const inProgressAppointments = response.data.filter(
          (appointment) =>
            appointment.status === "InProgress" &&
            !submittedAppointments.includes(appointment.appointmentId)
        );
        setAppointments(inProgressAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments. Please try again.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Xử lý submit: Tạo health record và chuyển trạng thái của appointment thành "Success" trên FE
  const handleSubmit = async (appointmentId: string) => {
    if (!appointmentId) {
      toast.error("Appointment ID is missing.");
      return;
    }

    const reaction = reactions[appointmentId];
    if (!reaction) {
      toast.error("Please enter a reaction before submitting.");
      return;
    }

    try {
      // Bước 1: Tạo health record
      const createResponse = await axios.post(
        `https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/HealthRecord/create-health-record`,
        {
          AppointmentId: Number(appointmentId),
          StaffId: 1,
          DoctorId: 1,
          BloodPressure: "120/80",
          HeartRate: "75",
          Height: 170,
          Weight: 65,
          Temperature: 36.5,
          ReactionNotes: reaction,
          CreatedAt: new Date().toISOString(),
        }
      );
      const recordId = createResponse.data.recordId;
      console.log("Health record created with ID:", recordId);

      // Vì không có API update status, ta chuyển trạng thái thành "Success" trên FE
      // Lưu appointment đã submit vào localStorage
      const submittedAppointments = JSON.parse(
        localStorage.getItem("submittedAppointments") || "[]"
      );
      submittedAppointments.push(appointmentId);
      localStorage.setItem(
        "submittedAppointments",
        JSON.stringify(submittedAppointments)
      );
      console.log(submittedAppointments);

      // Loại bỏ appointment vừa submit khỏi danh sách hiển thị
      const updatedAppointmentsList = appointments.filter(
        (appointment) => appointment.appointmentId !== appointmentId
      );
      setAppointments(updatedAppointmentsList);

      toast.success(
        "Health record created successfully and appointment status updated"
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Backend error response:", error.response?.data);
        toast.error(
          `Failed to create health record: ${error.response?.data.message}`
        );
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={classes.container}>
      <h2>Vaccination Progress</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>#</th>
                <th className={classes.th}>Appointment ID</th>
                <th className={classes.th}>Customer ID</th>
                <th className={classes.th}>Appointment Date</th>
                <th className={classes.th}>Reaction</th>
                <th className={classes.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.appointmentId}>
                  <td className={classes.td}>{index + 1}</td>
                  <td className={classes.td}>{appointment.appointmentId}</td>
                  <td className={classes.td}>{appointment.customerId}</td>
                  <td className={classes.td}>
                    {moment(appointment.appointmentDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </td>
                  <td className={classes.td}>
                    <input
                      type="text"
                      className={classes.input}
                      value={reactions[appointment.appointmentId] || ""}
                      onChange={(e) =>
                        handleReactionChange(
                          appointment.appointmentId,
                          e.target.value
                        )
                      }
                      placeholder="Enter reaction"
                    />
                  </td>
                  <td className={classes.td}>
                    <button
                      className={classes.button}
                      onClick={() => handleSubmit(appointment.appointmentId)}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && <p>No appointments in progress.</p>}
        </>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default VaccinationProgress;
