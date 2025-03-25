import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Rate, Typography, message } from "antd";
import axios from "axios";
import { format } from "date-fns";

const { Title, Text } = Typography;

const ProvideFeedback = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Lấy thông tin người dùng đăng nhập từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://vaccine-system1.azurewebsites.net/Doctor/get-doctors"
        );
        setDoctors(response.data);
      } catch (error) {
        message.error("Failed to fetch the list of doctors!");
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  const findDoctorIdByName = (doctorName) => {
    const doctor = doctors.find((doc) => doc.name === doctorName);
    return doctor ? doctor.id : null;
  };

  const fetchAppointments = async (userId) => {
    try {
      const response = await axios.get(
        `https://vaccine-system1.azurewebsites.net/FeedBack/get-success-appointments-pending-feedback/${userId}`
      );
      setAppointments(response.data);
    } catch (error) {
      message.error("Failed to fetch appointments!");
      console.error(error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment || !user) {
      message.error("Missing appointment or user information!");
      return;
    }

    const doctorId = findDoctorIdByName(selectedAppointment.doctorName);
    if (!doctorId) {
      message.error("Doctor information not found!");
      return;
    }

    const feedbackData = {
      customerId: user.id,
      doctorId: doctorId,
      staffId: selectedAppointment.staffId || 0,
      vaccineId: selectedAppointment.vaccineId || 0,
      appointmentId: selectedAppointment.appointmentId || 0,
      rating,
      comment: feedback,
    };

    try {
      await axios.post(
        "https://vaccine-system1.azurewebsites.net/FeedBack/create-feedback",
        feedbackData
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (app) => app.appointmentId !== selectedAppointment.appointmentId
        )
      );
      message.success("Feedback submitted successfully!");
      // Đóng modal và reset dữ liệu
      setVisible(false);
      setFeedback("");
      setRating(0);
      setSelectedAppointment(null);
    } catch (error) {
      message.error("Failed to submit feedback!");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Title level={2} style={{ color: "#512DA8", marginBottom: "30px" }}>
        🩺 Appointments Needing Feedback
      </Title>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {appointments.length > 0 ? (
          appointments.map((item) => {
            const formattedDate = item.appointmentDate
              ? format(new Date(item.appointmentDate), "dd/MM/yyyy")
              : "N/A";

            return (
              <Card
                key={item.id}
                hoverable
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 6px 12px rgba(126, 87, 194, 0.2)",
                  backgroundColor: "#F3E5F5",
                  padding: " 5px 20px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(126, 87, 194, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(126, 87, 194, 0.2)";
                }}
                onClick={() => {
                  setSelectedAppointment(item);
                  setVisible(true);
                }}
              >
                <Text strong style={{ fontSize: "18px" }}>
                  📅 Date:
                </Text>{" "}
                {formattedDate} <br />
                <Text strong style={{ fontSize: "18px" }}>
                  ✅ Status:
                </Text>{" "}
                <span
                  style={{
                    color: "#43A047",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Success
                </span>{" "}
                <br/>
                <Text strong style={{ fontSize: "18px" }}>
                  💉 Vaccine:
                </Text>{" "}
                {item.vaccineName} <br/>
                <Text strong style={{ fontSize: "18px" }}>
                  👨‍⚕️ Doctor:
                </Text>{" "}
                {item.doctorName} <br/>
                <Button
                  type="primary"
                  style={{
                    marginTop: "12px",
                    backgroundColor: "#673AB7",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#512DA8";
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#673AB7";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                  onClick={() => {
                    setSelectedAppointment(item);
                    setVisible(true);
                  }}
                >
                  ✨ Give Feedback
                </Button>
              </Card>
            );
          })
        ) : (
          <Text>No appointments pending feedback.</Text>
        )}
      </div>

      {/* Modal nhập feedback */}
      <Modal
        title={
          <Title level={4} style={{ color: "#512DA8", marginBottom: 0 }}>
            Provide Your Feedback 📝
          </Title>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleFeedbackSubmit}
        okText="Submit Feedback"
        cancelText="Cancel"
        centered
        width={550}
        bodyStyle={{ padding: "20px 30px" }}
      >
        <div
          style={{
            backgroundColor: "#F3E5F5",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <p>
            <Text strong>Date:</Text>{" "}
            {selectedAppointment?.appointmentDate
              ? format(
                  new Date(selectedAppointment.appointmentDate),
                  "dd/MM/yyyy"
                )
              : "N/A"}
          </p>
          <p>
            <Text strong>Status:</Text>{" "}
            <span style={{ color: "#43A047", fontWeight: "bold" }}>
              Success
            </span>
          </p>
          <p>
            <Text strong>Vaccine:</Text> {selectedAppointment?.vaccineName}
          </p>
          <p>
            <Text strong>Doctor:</Text> {selectedAppointment?.doctorName}
          </p>
          <Rate
            value={rating}
            onChange={setRating}
            style={{ marginBottom: "10px", fontSize: "22px", color: "#7E57C2" }}
          />
          <Input.TextArea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            style={{
              borderRadius: "8px",
              border: "1px solid #7E57C2",
              padding: "10px",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProvideFeedback;