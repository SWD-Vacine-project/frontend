// import { useState } from "react";
// import axios from "axios";
// import style from "../child-info/childInfo_style.module.css";

// export default function AddChild({ id, onChildAdded }) {
//   const [showDialog, setShowDialog] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [childData, setChildData] = useState({
//     name: "",
//     dob: "",
//     gender: "",
//     bloodType: "",
//   });

//   // Cập nhật dữ liệu khi nhập form
//   const handleChange = (e) => {
//     setChildData({ ...childData, [e.target.name]: e.target.value });
//   };

//   // Gửi dữ liệu tạo trẻ mới
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     const storedData = JSON.parse(localStorage.getItem("user"));

//     const requestData = {
//         customerId: storedData.id, // ID của phụ huynh
//         name: childData.name,
//         dob: childData.dob,
//         gender: childData.gender,
//         bloodType: childData.bloodType,
//     };

//     console.log("Dữ liệu gửi đi:", requestData);

//     try {
//         const response = await axios.post(
//             "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Child/create-child",
//             requestData,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("Phản hồi từ server:", response.data);
//         alert("Thêm trẻ thành công!");
//         onChildAdded(response.data);
//         setShowDialog(false);
//         setChildData({ name: "", dob: "", gender: "", bloodType: "" });
        
//         setTimeout(() => {
//           window.location.reload();
//         }, 500);

//     } catch (error) {
//         if (error.response) {
//             console.log("Lỗi từ server:", error.response.data);
//             setError(error.response.data.message || "Lỗi từ server");
//         } else if (error.request) {
//             console.log("Không có phản hồi từ máy chủ:", error.request);
//             setError("Không có phản hồi từ máy chủ");
//         } else {
//             console.log("Lỗi hệ thống:", error.message);
//             setError("Lỗi hệ thống, vui lòng thử lại");
//         }
//     } finally {
//         setLoading(false);
//     }
// };

//   return (
//     <>
//       {/* Nút mở dialog */}
//       <div className={style.child_container_plus} onClick={() => setShowDialog(true)}>
//         <div className={style.add_child}>
//           <i className="bx bx-plus" style={{ fontSize: "20rem", color: "#ccc" }}></i>
//         </div>
//       </div>

//       {/* Dialog nhập thông tin */}
//       {showDialog && (
//         <div className={style.dialog_overlay}>
//           <div className={style.dialog_box}>
//             <h2>Thêm Trẻ</h2>

//             {error && <p className={style.error_message}>{error}</p>}

//             <form onSubmit={handleSubmit}>
//               <label>Tên trẻ:</label>
//               <input type="text" name="name" value={childData.name} onChange={handleChange} required />

//               <label>Ngày sinh:</label>
//               <input type="date" name="dob" value={childData.dob} onChange={handleChange} required />

//               <label>Giới tính:</label>
//               <select name="gender" value={childData.gender} onChange={handleChange} required>
//                 <option value="">Chọn</option>
//                 <option value="M">Nam</option>
//                 <option value="F">Nữ</option>
//               </select>

//               <label>Nhóm máu:</label>
//               <select name="bloodType" value={childData.bloodType} onChange={handleChange} required>
//                 <option value="">Chọn</option>
//                 <option value="A">A</option>
//                 <option value="B">B</option>
//                 <option value="AB">AB</option>
//                 <option value="O">O</option>
//               </select>

//               <div className={style.dialog_buttons}>
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Đang xử lý..." : "Thêm trẻ"}
//                 </button>
//                 <button type="button" onClick={() => setShowDialog(false)}>Hủy</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Select, Button, message } from "antd";
import style from "../child-info/childInfo_style.module.css";

export default function AddChild({ onChildAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const storedData = JSON.parse(sessionStorage.getItem("user"));
      if (!storedData?.id) throw new Error("User data not found.");

      const requestData = { ...values, customerId: storedData.id };

      console.log("Sending data:", requestData);

      const response = await axios.post(
        "https://vaccine-system1.azurewebsites.net/Child/create-child",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Server response:", response.data);
      message.success("Child added successfully!");

      onChildAdded(response.data);
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      message.error(error.response?.data?.message || error.message || "System error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={style.child_container_plus} onClick={() => setIsModalOpen(true)}>
        <div className={style.add_child}>
          <i className="bx bx-plus" style={{ fontSize: "20rem", color: "#ccc" }}></i>
        </div>
      </div>

      <Modal
        title="Add Child"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Child Name" rules={[{ required: true, message: "Please enter child name" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: "Please select date of birth" }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender" }]}>
            <Select>
              <Select.Option value="M">Male</Select.Option>
              <Select.Option value="F">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="bloodType" label="Blood Type" rules={[{ required: true, message: "Please select blood type" }]}>
            <Select>
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="AB">AB</Select.Option>
              <Select.Option value="O">O</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}