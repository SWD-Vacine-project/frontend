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

interface CartItem {
  vaccine: {
    vaccineId: number;
    name: string;
    price: number;
    description: string;
    internalDurationDoses: number;
    maxLateDate: number;
  };
  selectedChildren: Child[];
}

interface Child {
  childId: number;
  customerId: number;
  name: string;
  dob: string;
  gender: string;
  bloodType: string;
  appointments: any[];
}

interface BookingConfirmState {
  date?: Date;
  time?: string;
  cartItems?: CartItem[];
}



const BookingConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const state = location.state as BookingConfirmState;
  const { date, time, cartItems } = location.state as BookingConfirmState || {}; 
  const hasSelectedChildren = cartItems?.some(item => item.selectedChildren.length > 0);




  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmModal = () => {
    setShowModal(false);
    navigate("/book/payment-form");
  };
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const checkSelectChildren = (cartItems: CartItem[] | undefined): boolean => {
    return cartItems?.some(item => item.selectedChildren.length > 0) ?? false;
  };
  
  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((sum: number, item: CartItem) => {
      return sum + (item.vaccine.price * item.selectedChildren.length);
    }, 0);
  };

 
  return (
    <Container>
      <BookingBox>
        <ContentRow>
          {/* Phần thông tin trẻ em */}
          <Section>
            <Title>👶 Thông tin Trẻ em</Title>
            {cartItems?.map((item: CartItem, index: number) => (
              <div key={index} style={{ marginBottom: "25px" }}>
                <Text style={{ color: "#6a0dad", fontSize: "1.2rem" }}>
                  💉 Vaccine: {item.vaccine.name}
                </Text>
                {item.selectedChildren.map((child, childIndex) => (
                  <div key={childIndex} style={{ 
                    padding: "15px",
                    backgroundColor: "#f5f3ff",
                    borderRadius: "8px",
                    margin: "10px 0"
                  }}>
                    <Text>
                      👦 Tên: {child.name} ({calculateAge(child.dob)} tuổi)
                    </Text>
                    <Text>🩸 Nhóm máu: {child.bloodType}</Text>
                    <Text>🚻 Giới tính: {child.gender === 'Male' ? 'Nam' : 'Nữ'}</Text>
                  </div>
                ))}
              </div>
            ))}
          </Section>

          {/* Phần thông tin vaccine và thanh toán */}
          <Section>
            <Title>💊 Thông tin Đặt lịch</Title>
            <div style={{ 
              backgroundColor: "#f8f5ff",
              padding: "20px",
              borderRadius: "10px"
            }}>
              <Text>
                📅 Ngày tiêm: {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
              </Text>
              <Text>
                ⏰ Giờ tiêm: {time || "N/A"}
              </Text>
              <Text>
                💰 Tổng số vaccine: {cartItems?.length || 0}
              </Text>
              <Text style={{ color: "#4CAF50", fontSize: "1.4rem" }}>
                💵 Tổng tiền: {calculateTotal().toLocaleString()} VND
              </Text>
            </div>

            {/* Thông tin chi tiết vaccine */}
            {cartItems?.map((item: CartItem, index: number) => (
              <div key={index} style={{ 
                marginTop: "20px",
                borderLeft: `4px solid #6a0dad`,
                paddingLeft: "15px"
              }}>
                <Text style={{ fontWeight: "600" }}>
                  {item.vaccine.name}
                </Text>
                <Text>📝 Mô tả: {item.vaccine.description}</Text>
                <Text>⏳ Khoảng cách liều: {item.vaccine.internalDurationDoses} ngày</Text>
                <Text>🏷️ Giá: {item.vaccine.price.toLocaleString()} VND</Text>
              </div>
            ))}
          </Section>
        </ContentRow>

        {/* Các nút điều hướng */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "30px"
        }}>
          <BackButton onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faCaretLeft} /> Quay lại
          </BackButton>
          <Button onClick={openModal}>
            Xác nhận đặt lịch
          </Button>
        </div>
      </BookingBox>

      {/* Phần modal xác nhận */}
      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3 style={{ color: "#6a0dad" }}>Xác nhận đặt lịch</h3>
              <ModalClose onClick={closeModal}>&times;</ModalClose>
            </ModalHeader>
            <ModalBody>
              <p>Bạn có chắc chắn muốn đặt lịch với thông tin sau?</p>
              <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                <li>Số lượng vaccine: {cartItems?.length}</li>
                <li>Tổng số trẻ: {cartItems?.reduce((sum, item) => sum + item.selectedChildren.length, 0)}</li>
                <li>Tổng tiền: {calculateTotal().toLocaleString()} VND</li>
              </ul>
            </ModalBody>
            <ModalActions>
              <ConfirmButton onClick={confirmModal}>
                Đồng ý
              </ConfirmButton>
              <CancelButton onClick={closeModal}>
                Hủy bỏ
              </CancelButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BookingConfirm;