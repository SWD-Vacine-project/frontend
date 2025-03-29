import React, { useState, useEffect } from "react";
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
import styled from "styled-components";

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f2ff;
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
  color: #6a0dad;
  margin-bottom: 15px;
  font-size: 1.8rem;
`;

const Text = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b0082;
`;

const Button = styled.button`
  background-color: #6a0dad;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #4b0082;
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

// Interfaces
interface CartItem {
  vaccine: {
    vaccineId?: number; // For single vaccine
    comboId?: number; // For combo vaccine
    name?: string;
    comboName?: string;
    price: number;
    description: string;
    internalDurationDoses?: number;
    maxLateDate?: number;
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
  const { date, time, cartItems } = state || {};
  const [appointmentDateISO, setAppointmentDateISO] = useState<string>("");

  // Tính và lưu trữ appointmentDate theo định dạng ISO (không bao gồm mili giây và Z)
  useEffect(() => {
    if (date && time) {
      const d = new Date(date);
      const [hours, minutes] = time.split(":");
      d.setHours(Number(hours), Number(minutes), 0, 0);
      const localTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      const isoString = localTime.toISOString().slice(0, 19);
      setAppointmentDateISO(isoString);
    } else {
      setAppointmentDateISO("");
    }
  }, [date, time]);

  // Modal handlers
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const confirmModal = async () => {
    setShowModal(false);

    // Debug toast để kiểm tra confirmModal đã được gọi
    toast.info("Debug: confirmModal được gọi!", { autoClose: 3000 });

    if (!cartItems || cartItems.length === 0) return;

    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      toast.error("Bạn cần đăng nhập!");
      return;
    }
    const user = JSON.parse(storedUser);
    const customerId = user.id;

    // Tính appointmentDateISO
    let appointmentDateISO: string;
    if (date && time) {
      const d = new Date(date);
      const [hours, minutes] = time.split(":");
      d.setHours(Number(hours), Number(minutes), 0, 0);
      const localTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      appointmentDateISO = localTime.toISOString().slice(0, 19);
    } else {
      const now = new Date();
      const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      appointmentDateISO = localTime.toISOString().slice(0, 19);
    }

    // Tạo danh sách Promise cho mỗi appointment
    const promises = [];
    for (const item of cartItems) {
      for (const child of item.selectedChildren) {
        let payload;
        let endpoint;
        if (item.vaccine.vaccineId !== undefined) {
          // Vaccine đơn
          payload = {
            customerId,
            childId: child.childId,
            vaccineId: item.vaccine.vaccineId,
            appointmentDate: appointmentDateISO,
            notes: "Đặt lịch từ hệ thống",
          };
          endpoint = "https://vaccine-system2.azurewebsites.net/Appointment/create-appointment";
        } else if (item.vaccine.comboId !== undefined) {
          // Vaccine combo
          payload = {
            customerId,
            childId: child.childId,
            comboId: item.vaccine.comboId,
            appointmentDate: appointmentDateISO,
            notes: "Đặt lịch từ hệ thống",
          };
          endpoint = "https://vaccine-system2.azurewebsites.net/Appointment/create-appointment-combo";
        } else {
          continue;
        }

        if (endpoint) {
          promises.push(
            fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          );
        }
      }
    }

    try {
      const results = await Promise.allSettled(promises);
      const responsesData = await Promise.all(
        results.map(async (result) => {
          if (result.status === "fulfilled") {
            const res = result.value;
            if (!res.ok) {
              const errorText = await res.text();
              console.error("Error from server:", errorText);
              return { error: `Lỗi HTTP ${res.status}: ${errorText}` };
            }
            return await res.json();
          } else {
            return { error: result.reason };
          }
        })
      );

      console.log("responsesData:", responsesData);
      // Debug toast hiển thị số lượng responses
      toast.info(`Debug: Số lượng responses nhận được: ${responsesData.length}`, { autoClose: 3000 });

      const errors = responsesData.filter((data) => data && data.error);
      if (errors.length > 0) {
        console.warn("Một số request không thành công:", errors);
        toast.error("Một số appointment không được tạo thành công. Vui lòng kiểm tra lại.", { autoClose: 5000 });
      }

      const successResponses = responsesData.filter((data) => !data.error);
      if (!successResponses || successResponses.length === 0) return;

      // Kiểm tra pending response
      const pendingResponses = successResponses.filter(
        (response: any) =>
          response.message &&
          response.message.toLowerCase().includes("chờ")
      );
      if (pendingResponses.length > 0) {
        toast.info(
          "Yêu cầu của bạn đang chờ duyệt bởi nhân viên. Vui lòng đến trang quản lý đặt lịch để theo dõi.",
          { autoClose: 5000 }
        );
        // Delay chuyển hướng sau 5 giây
        setTimeout(() => {
          navigate("/manage-booking");
        }, 5000);
        return;
      }

      // Nếu không pending, xử lý theo loại vaccine
      if (cartItems && cartItems[0]?.vaccine?.comboId) {
        const allAppointments = successResponses.flatMap((item: any) => item.appointments || []);
        const appointmentIds = allAppointments.map((app: any) => app.appointmentId);
        console.log("Combo appointmentIds:", appointmentIds);
        navigate("/book/payment-form", {
          state: {
            appointmentDate: appointmentDateISO,
            appointmentIds,
            totalAmount: calculateTotal(),
            customerId,
            type: "Combo",
            cartItems,
          },
        });
      } else {
        const firstSuccess = successResponses.find((item: any) => item.appointment);
        if (!firstSuccess) return;
        const appointmentId = firstSuccess.appointment.appointmentId;
        console.log("Single appointmentId:", appointmentId);
        navigate("/book/payment-form", {
          state: {
            appointmentDate: appointmentDateISO,
            appointmentId,
            totalAmount: calculateTotal(),
            customerId,
            type: "Single",
            cartItems,
          },
        });
      }

      toast.success(`Tạo appointment thành công! Ngày giờ: ${appointmentDateISO}`, { autoClose: 5000 });
    } catch (error) {
      console.error("Lỗi tạo appointment:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.", { autoClose: 5000 });
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculateTotal = () => {
    return (cartItems ?? []).reduce((total, item) => {
      return total + item.vaccine.price * item.selectedChildren.length;
    }, 0);
  };

  return (
    <Container>
      <ToastContainer />
      <BookingBox>
        {!location.state ? (
          <>
            <h2>Không tìm thấy thông tin đặt lịch</h2>
            <Button onClick={() => navigate("/book")}>Quay lại đặt lịch</Button>
          </>
        ) : (
          <>
            <ContentRow>
              {/* Child Information */}
              <Section>
                <Title>👶 Thông tin Trẻ em</Title>
                {cartItems?.map((item: CartItem, index: number) => (
                  <div key={index} style={{ marginBottom: "25px" }}>
                    <Text style={{ color: "#6a0dad", fontSize: "1.2rem" }}>
                      💉 Vaccine: {item.vaccine.name || item.vaccine.comboName}
                    </Text>
                    {item.selectedChildren.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        style={{
                          padding: "15px",
                          backgroundColor: "#f5f3ff",
                          borderRadius: "8px",
                          margin: "10px 0",
                        }}
                      >
                        <Text>
                          👦 Tên: {child.name} ({calculateAge(child.dob)} tuổi)
                        </Text>
                        <Text>🩸 Nhóm máu: {child.bloodType}</Text>
                        <Text>
                          🚻 Giới tính: {child.gender === "Male" ? "Nam" : "Nữ"}
                        </Text>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>

              {/* Vaccine and Payment Information */}
              <Section>
                <Title>💊 Thông tin Đặt lịch</Title>
                <div
                  style={{
                    backgroundColor: "#f8f5ff",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <Text>
                    📅/⏰ Ngày Giờ tiêm:{" "}
                    {appointmentDateISO
                      ? moment(appointmentDateISO).format("DD/MM/YYYY HH:mm")
                      : "N/A"}
                  </Text>
                  <Text>💰 Tổng số vaccine: {cartItems?.length || 0}</Text>
                  <Text style={{ color: "#4CAF50", fontSize: "1.4rem" }}>
                    💵 Tổng tiền: {calculateTotal().toLocaleString()} VND
                  </Text>
                </div>
                {cartItems?.map((item: CartItem, index: number) => (
                  <div
                    key={index}
                    style={{
                      marginTop: "20px",
                      borderLeft: "4px solid #6a0dad",
                      paddingLeft: "15px",
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {item.vaccine.name || item.vaccine.comboName}
                    </Text>
                    <Text>📝 Mô tả: {item.vaccine.description}</Text>
                    <Text>
                      ⏳ Khoảng cách liều: {item.vaccine.internalDurationDoses} ngày
                    </Text>
                    <Text>
                      🏷️ Giá: {item.vaccine.price.toLocaleString()} VND
                    </Text>
                  </div>
                ))}
              </Section>
            </ContentRow>

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
                paddingTop: "30px",
              }}
            >
              <BackButton onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faCaretLeft} /> Quay lại
              </BackButton>
              <Button onClick={openModal}>Xác nhận đặt lịch</Button>
            </div>

            {/* Confirmation Modal */}
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
                      <li>
                        Tổng số trẻ:{" "}
                        {cartItems?.reduce(
                          (sum, item) => sum + item.selectedChildren.length,
                          0
                        )}
                      </li>
                      <li>
                        Tổng tiền: {calculateTotal().toLocaleString()} VND
                      </li>
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
          </>
        )}
      </BookingBox>
    </Container>
  );
};

export default BookingConfirm;
