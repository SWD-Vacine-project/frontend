import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChild,
  faSyringe,
  faCalendar,
  faUserMd,
  faClock,
  faMoneyBill,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import styled from "styled-components"; // Sử dụng styled-components

// Tạo các thành phần với tone màu tím nhạt
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f2ff; /* Màu nền tím nhạt */
  font-family: "Poppins", sans-serif;
`;

const BookingBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 90vw;
  max-width: 1000px;
  height: 60vh;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Section = styled.div`
  width: 48%;
  text-align: left;
`;

const Title = styled.h1`
  color: #6a0dad; /* Màu tím đậm */
  margin-bottom: 15px;
  font-size: 1.8rem;
`;

const Text = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b0082; /* Màu tím trung bình */
`;

const Button = styled.button`
  background-color: #6a0dad; /* Màu tím đậm */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4b0082; /* Màu tím trung bình khi hover */
  }
`;

const BackButton = styled(Button)`
  background-color: #ccc;
  color: black;

  &:hover {
    background-color: #999;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const ModalClose = styled.span`
  font-size: 24px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: red;
  }
`;

const ModalBody = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #555;
`;

const ModalActions = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const ConfirmButton = styled.button`
  background: #28a745;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #c82333;
  }
`;

const BookingConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, appointmentId } = location.state || {};
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmModal = () => {
    setShowModal(false);
    // Truyền appointmentId sang PaymentForm
    navigate("/book/payment-form", {
      state: {
        date,
        time,
        appointmentId, // Truyền appointmentId
      },
    });
  };

  return (
    <Container>
      <BookingBox>
        <ContentRow>
          {/* Child Information */}
          <Section>
            <Title>Thông tin Trẻ em</Title>
            <Text>
              <FontAwesomeIcon icon={faChild} /> Tên trẻ: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faChild} /> Tuổi: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faChild} /> Giới tính: N/A
            </Text>
          </Section>

          {/* Vaccine Information */}
          <Section>
            <Title>Thông tin Vaccine</Title>
            <Text>
              <FontAwesomeIcon icon={faSyringe} /> Tên vaccine: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faMoneyBill} /> Giá: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faCalendar} /> Ngày tiêm:{" "}
              {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
            </Text>
            <Text>
              <FontAwesomeIcon icon={faClock} /> Giờ tiêm: {time || "N/A"}
            </Text>
            <Text>
              <FontAwesomeIcon icon={faUserMd} /> Bác sĩ: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faSyringe} /> Loại vaccine: N/A
            </Text>
            <Text>
              <FontAwesomeIcon icon={faSyringe} /> Combo: N/A
            </Text>
          </Section>
        </ContentRow>
        {/* Buttons inside form */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <BackButton onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faCaretLeft} /> BACK
          </BackButton>
          <Button onClick={openModal}>Confirm</Button>
        </div>
      </BookingBox>
      <ToastContainer />
      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Confirm Booking</h3>
              <ModalClose onClick={closeModal}>&times;</ModalClose>
            </ModalHeader>
            <ModalBody>
              <h2>
                Check carefully & review your booking details before clicking
                "Yes"!
              </h2>
            </ModalBody>
            <ModalActions>
              <ConfirmButton onClick={confirmModal}>Yes</ConfirmButton>
              <CancelButton onClick={closeModal}>No</CancelButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BookingConfirm;
