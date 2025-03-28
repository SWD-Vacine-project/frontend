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

interface HealthRecord {
  recordId: number;
  staffId?: number;
  appointmentId: number;
  doctorId?: number;
  bloodPressure?: string;
  heartRate?: number;
  height?: number;
  weight?: number;
  temperature?: number;
  ateBeforeVaccine?: boolean;
  conditionOk?: boolean;
  reactionNotes?: string;
  createdAt: string;
  appointment?: {
    appointmentId: number;
    appointmentDate: string;
    status: string;
  };
}

const useStyles = makeStyles((theme) => ({
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
}));

const VaccinationReactions = () => {
  const classes = useStyles();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch health records with status "Success"
  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        // Giả sử bạn có một danh sách các recordId cần fetch
        const savedRecordIds = JSON.parse(
          localStorage.getItem("recordIds") || "[]"
        );
        console.log(savedRecordIds);
        // Fetch từng health record dựa trên recordId
        const records = await Promise.all(
          savedRecordIds.map(async (recordId: number) => {
            const response = await axios.get<HealthRecord>(
              `https://vaccine-system2.azurewebsites.net/api/HealthRecord/get-health-records/${recordId}`
            );
            return response.data;
          })
        );

        // Lọc các health records có trạng thái "Success"
        const successfulRecords = records.filter(
          (record) => record.appointment?.status === "InProgress"
        );

        setHealthRecords(successfulRecords);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching health records:", error);
        toast.error("Failed to fetch health records. Please try again.");
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  return (
    <div className={classes.container}>
      <h2>Vaccination Reactions</h2>
      {loading ? (
        <p>Loading health records...</p>
      ) : (
        <>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th}>#</th>
                <th className={classes.th}>Record ID</th>
                <th className={classes.th}>Appointment ID</th>
                <th className={classes.th}>Appointment Date</th>
                <th className={classes.th}>Reaction Notes</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((record, index) => (
                <tr key={record.recordId}>
                  <td className={classes.td}>{index + 1}</td>
                  <td className={classes.td}>{record.recordId}</td>
                  <td className={classes.td}>{record.appointmentId}</td>
                  <td className={classes.td}>
                    {moment(record.appointment?.appointmentDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </td>
                  <td className={classes.td}>{record.reactionNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {healthRecords.length === 0 && <p>No health records found.</p>}
        </>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default VaccinationReactions;