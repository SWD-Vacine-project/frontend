import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import axios from "axios";

const { Option } = Select;

const UpdateDoctorNurse = ({ visible, onClose, user, reloadData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("User data received in UpdateDoctorNurse:", user); // Kiểm tra user
    if (user.role === "Doctor") {
      fetchDoctorDetails(user.id);
    } else if (user.role === "Nurse") {
      fetchNurseDetails(user.id);
    }
  }, [user]);

  console.log("Selected user data:", user);

  // Gọi API lấy thông tin Doctor
  const fetchDoctorDetails = async (doctorId) => {
    console.log("Fetching details for doctorId:", doctorId);
    try {
      const res = await axios.get(
        `https://vaccine-system2.azurewebsites.net/Doctor/get-doctor-by-id/${doctorId}`
      );
      const doctorData = res.data;
      doctorData.gender = doctorData.gender === "M" ? "Male" : "Female";

      form.setFieldsValue(doctorData);
      console.log("API response (Doctor):", doctorData);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      notification.error({ message: "Failed to load doctor details" });
    }
  };

  // Gọi API lấy thông tin Nurse
  const fetchNurseDetails = async (staffId) => {
    console.log("Fetching details for nurseId:", staffId);
    try {
      const res = await axios.get(
        `https://vaccine-system2.azurewebsites.net/Staff/get-staff-by-id/${staffId}`
      );
      const nurseData = res.data;
      nurseData.gender = nurseData.gender === "M" ? "Male" : "Female";

      form.setFieldsValue(nurseData);
      console.log("API response (Nurse):", nurseData);
    } catch (error) {
      console.error("Error fetching nurse details:", error);
      notification.error({ message: "Failed to load nurse details" });
    }
  };

  // Xử lý cập nhật thông tin
  const handleUpdate = async (values) => {
    setLoading(true);

    // Validate phone (phải có đúng 10 số)
    if (!/^\d{10}$/.test(values.phone)) {
      notification.error({ message: "Phone number must be exactly 10 digits!" });
      setLoading(false);
      return;
    }

    // Validate experienceYears (phải > 0)
    if (values.experienceYears <= 0) {
      notification.error({ message: "Experience years must be greater than 0!" });
      setLoading(false);
      return;
    }

    const updatedValues = {
      ...values,
      gender: values.gender === "Male" ? "M" : "F", // Chuyển đổi giới tính trước khi gửi API
    };

    try {
      if (user.role === "Doctor") {
        await axios.put(
          `https://vaccine-system2.azurewebsites.net/Doctor/update-doctor/${user.id}`,
          updatedValues
        );
      } else {
        await axios.put(
          `https://vaccine-system2.azurewebsites.net/Staff/update-staff/${user.id}`,
          updatedValues
        );
      }

      notification.success({ message: `${user.role} updated successfully!` });
      onClose();
      reloadData();
    } catch (error) {
      console.error("Update failed:", error);
      notification.error({ message: `Failed to update ${user.role}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Update ${user.role}`} open={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender!" }]}>
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone!" }]}>
          <Input />
        </Form.Item>

        {/* Nếu là Nurse thì hiển thị thêm các trường sau */}
        {user.role === "Nurse" && (
          <>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email!" }]}>
              <Input type="email" />
            </Form.Item>

            <Form.Item name="role" label="Role">
              <Input disabled />
            </Form.Item>

            <Form.Item name="userName" label="Username">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Password">
              <Input value="********" disabled />
            </Form.Item>

            <Form.Item name="degree" label="Degree" rules={[{ required: true, message: "Please enter degree!" }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="experienceYears"
              label="Experience Years"
              rules={[{ required: true, message: "Please enter experience years!" }]}
            >
              <Input type="number" />
            </Form.Item>
          </>
        )}

        {/* Nếu là Doctor thì hiển thị các trường của Doctor */}
        {user.role === "Doctor" && (
          <>
            <Form.Item name="age" label="Age">
              <Input type="number" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="degree" label="Degree">
              <Input />
            </Form.Item>

            <Form.Item name="experienceYears" label="Experience Years">
              <Input type="number" />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDoctorNurse;