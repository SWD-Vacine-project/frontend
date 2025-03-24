// import React, { useState, useEffect } from "react";
// import { Modal, Button, Rate, Typography } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Text } = Typography;

// const ModalReview = () => {
//   const [visible, setVisible] = useState(true);
//   const [stars, setStars] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setStars((prev) => (prev < 5 ? prev + 1 : 0));
//     }, 300);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Modal
//       title=""
//       open={visible}
//       footer={null}
//       centered
//       width={700}
//       style={{ borderRadius: "12px" }}
//       keyboard={false} // Ngăn ESC đóng modal
//       maskClosable={false} // Ngăn bấm ra ngoài để đóng
//       closable={false} // Ẩn nút "X" đóng modal
//     >
//       <div
//         style={{
//           backgroundColor: "#EDE7F6",
//           padding: "40px",
//           textAlign: "center",
//           borderRadius: "12px",
//         }}
//       >
//         <Rate
//           disabled
//           value={stars}
//           style={{ fontSize: 28, color: "#7E57C2" }}
//         />

//         <h2 style={{ color: "#5E35B1", fontWeight: "bold", margin: "20px 0" }}>
//           HAPPY WITH OUR SERVICES?
//         </h2>

//         <Button
//           type="primary"
//           style={{
//             backgroundColor: "#7E57C2",
//             border: "none",
//             padding: "12px 24px",
//             fontSize: "18px",
//             fontWeight: "bold",
//             borderRadius: "10px",
//             transition: "all 0.3s ease",
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.backgroundColor = "#5E35B1";
//             e.target.style.transform = "scale(1.05)";
//             e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.backgroundColor = "#7E57C2";
//             e.target.style.transform = "scale(1)";
//             e.target.style.boxShadow = "none";
//           }}
//           onClick={() => navigate("/provideFeedback")}
//         >
//           Let Us Know
//         </Button>

//         <p style={{ marginTop: "15px", color: "#6A1B9A", fontSize: "15px" }}>
//           Please leave us a review so that we can provide better service and
//           products in the future.
//         </p>

//         <Text
//           type="secondary"
//           style={{ display: "block", marginTop: "15px", fontSize: "13px" }}
//         >
//           @smile-your-vaccination-system
//         </Text>
//       </div>
//     </Modal>
//   );
// };

// export default ModalReview;

import React, { useState, useEffect } from "react";
import { Modal, Button, Rate, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Text } = Typography;

const ModalReview = () => {
  const [visible, setVisible] = useState(false);
  const [stars, setStars] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`https://vaccine-system1.azurewebsites.net/FeedBack/get-success-appointments-pending-feedback/${user.id}`)
        .then((response) => {
          if (response.data.length > 0) {
            setVisible(true);
          }
        })
        .catch((error) => console.error("Error fetching appointments:", error));
    }
  }, [user?.id]);


  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) => (prev < 5 ? prev + 1 : 0));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      title=""
      open={visible}
      footer={null}
      centered
      width={700}
      style={{ borderRadius: "12px" }}
      keyboard={false}
      maskClosable={false}
      closable={false}
    >
      <div
        style={{
          backgroundColor: "#EDE7F6",
          padding: "40px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <Rate disabled value={stars} style={{ fontSize: 28, color: "#7E57C2" }} />
        <h2 style={{ color: "#5E35B1", fontWeight: "bold", margin: "20px 0" }}>
          HAPPY WITH OUR SERVICES?
        </h2>
        <Button
          type="primary"
          style={{
            backgroundColor: "#7E57C2",
            border: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5E35B1";
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#7E57C2";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
          onClick={() => navigate("/provideFeedback")}
        >
          Let Us Know
        </Button>
        <p style={{ marginTop: "15px", color: "#6A1B9A", fontSize: "15px" }}>
          Please leave us a review so that we can provide better service and products in the future.
        </p>
        <Text type="secondary" style={{ display: "block", marginTop: "15px", fontSize: "13px" }}>
          @smile-your-vaccination-system
        </Text>
      </div>
    </Modal>
  );
};

export default ModalReview;
