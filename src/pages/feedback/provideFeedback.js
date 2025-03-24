// import React, { useState } from "react";
// import { Card, Button, Modal, Input, Rate, Typography } from "antd";

// const { Title, Text } = Typography;

// const mockAppointments = [
//   { id: 1, date: "2024-07-22", status: "Success", vaccineName: "Rabies Vaccine", doctorName: "Dr. Alice" },
//   { id: 2, date: "2024-07-20", status: "Success", vaccineName: "Canine Distemper", doctorName: "Dr. Bob" },
//   { id: 3, date: "2024-07-18", status: "Success", vaccineName: "Parvovirus Vaccine", doctorName: "Dr. Charlie" },
// ];

// const ProvideFeedback = () => {
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [feedback, setFeedback] = useState("");
//   const [rating, setRating] = useState(0);
//   const [visible, setVisible] = useState(false);

//   const handleFeedbackSubmit = () => {
//     console.log("Feedback submitted:", {
//       appointmentId: selectedAppointment.id,
//       feedback,
//       rating,
//     });

//     setVisible(false);
//     setFeedback("");
//     setRating(0);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
//       <Title level={2} style={{ color: "#512DA8", marginBottom: "30px" }}>
//         🩺 Appointments Needing Feedback
//       </Title>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
//         {mockAppointments.map((item) => (
//           <Card
//             key={item.id}
//             hoverable
//             style={{
//               borderRadius: "14px",
//               boxShadow: "0 6px 12px rgba(126, 87, 194, 0.2)",
//               backgroundColor: "#F3E5F5",
//               padding: "20px",
//               transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.05)";
//               e.currentTarget.style.boxShadow = "0 8px 15px rgba(126, 87, 194, 0.3)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//               e.currentTarget.style.boxShadow = "0 6px 12px rgba(126, 87, 194, 0.2)";
//             }}
//           >
//             <Text strong>Date:</Text> {item.date} <br />
//             <Text strong>Status:</Text> <span style={{ color: "#43A047", fontWeight: "bold" }}>{item.status}</span> <br />
//             <Text strong>Vaccine:</Text> {item.vaccineName} <br />
//             <Text strong>Doctor:</Text> {item.doctorName} <br />

//             <Button
//               type="primary"
//               style={{
//                 marginTop: "12px",
//                 backgroundColor: "#673AB7",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 padding: "10px 20px",
//                 transition: "all 0.3s ease",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.backgroundColor = "#512DA8";
//                 e.target.style.transform = "scale(1.05)";
//                 e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.backgroundColor = "#673AB7";
//                 e.target.style.transform = "scale(1)";
//                 e.target.style.boxShadow = "none";
//               }}
//               onClick={() => {
//                 setSelectedAppointment(item);
//                 setVisible(true);
//               }}
//             >
//               ✨ Give Feedback
//             </Button>
//           </Card>
//         ))}
//       </div>

//       {/* Modal nhập feedback */}
//       <Modal
//         title={<Title level={4} style={{ color: "#512DA8", marginBottom: 0 }}>Provide Your Feedback 📝</Title>}
//         open={visible}
//         onCancel={() => setVisible(false)}
//         onOk={handleFeedbackSubmit}
//         okText="Submit Feedback"
//         cancelText="Cancel"
//         centered
//         width={550}
//         bodyStyle={{ padding: "20px 30px" }}
//       >
//         <div style={{ backgroundColor: "#F3E5F5", padding: "20px", borderRadius: "10px" }}>
//           <p><Text strong>Date:</Text> {selectedAppointment?.date}</p>
//           <p><Text strong>Status:</Text> {selectedAppointment?.status}</p>
//           <p><Text strong>Vaccine:</Text> {selectedAppointment?.vaccineName}</p>
//           <p><Text strong>Doctor:</Text> {selectedAppointment?.doctorName}</p>

//           <Rate 
//             value={rating} 
//             onChange={setRating} 
//             style={{ marginBottom: "10px", fontSize: "22px", color: "#7E57C2" }} 
//           />

//           <Input.TextArea
//             placeholder="Write your feedback here..."
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             rows={4}
//             style={{
//               borderRadius: "8px",
//               border: "1px solid #7E57C2",
//               padding: "10px",
//             }}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// };
// export default ProvideFeedback;

import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Rate, Typography, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const ProvideFeedback = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Lấy danh sách lịch hẹn từ sessionStorage
    const storedAppointments = sessionStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }

    // Lấy thông tin người dùng đăng nhập từ sessionStorage
    const storedUser = sessionStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment || !user) {
      message.error("Missing appointment or user data!");
      return;
    }

    const feedbackData = {
      customerId: user.id, // Lấy từ sessionStorage
      doctorId: selectedAppointment.doctorId || 0,
      staffId: selectedAppointment.staffId || 0,
      vaccineId: selectedAppointment.vaccineId || 0,
      appointmentId: selectedAppointment.appointmentId || 0,
      rating,
      comment: feedback,
    };

    try {
      await axios.post("https://vaccine-system1.azurewebsites.net/FeedBack/create-feedback", feedbackData);
      message.success("Feedback submitted successfully!");
      setVisible(false);
      setFeedback("");
      setRating(0);
    } catch (error) {
      message.error("Failed to submit feedback!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <Title level={2} style={{ color: "#512DA8", marginBottom: "30px" }}>
        🩺 Appointments Needing Feedback
      </Title>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {appointments.map((item) => (
          <Card
            key={item.appointmentId}
            hoverable
            style={{
              borderRadius: "14px",
              boxShadow: "0 6px 12px rgba(126, 87, 194, 0.2)",
              backgroundColor: "#F3E5F5",
              padding: "20px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onClick={() => {
              setSelectedAppointment(item);
              setVisible(true);
            }}
          >
            <Text strong>Date:</Text> {item.appointmentDate} <br />
            <Text strong>Vaccine:</Text> {item.vaccineName} <br />
            <Text strong>Doctor:</Text> {item.doctorName} <br />

            <Button
              type="primary"
              style={{ marginTop: "12px", backgroundColor: "#673AB7", border: "none", borderRadius: "10px" }}
            >
              ✨ Give Feedback
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        title={<Title level={4} style={{ color: "#512DA8" }}>Provide Your Feedback 📝</Title>}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleFeedbackSubmit}
        okText="Submit Feedback"
        cancelText="Cancel"
        centered
        width={550}
      >
        {selectedAppointment && (
          <div style={{ backgroundColor: "#F3E5F5", padding: "20px", borderRadius: "10px" }}>
            <p><Text strong>Date:</Text> {selectedAppointment.appointmentDate}</p>
            <p><Text strong>Vaccine:</Text> {selectedAppointment.vaccineName}</p>
            <p><Text strong>Doctor:</Text> {selectedAppointment.doctorName}</p>

            <Rate value={rating} onChange={setRating} style={{ fontSize: "22px", color: "#7E57C2" }} />
            <Input.TextArea
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              style={{ borderRadius: "8px", border: "1px solid #7E57C2", padding: "10px" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProvideFeedback;

