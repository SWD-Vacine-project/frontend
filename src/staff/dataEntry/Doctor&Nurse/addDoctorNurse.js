import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const AddDoctorNurse = ({ visible, onClose, reloadData }) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  // Hàm tính tuổi từ DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    return dayjs().diff(dayjs(dob), "year");
  };

  // Tạo userName theo format ST-[username+3 số cuối phone]
  const generateUserName = (name, phone) => {
    if (!name || !phone || phone.length < 3) return "";
    return `ST_${name.replace(/\s/g, "").toLowerCase()}${phone.slice(-3)}`;
  };

  // Xử lý thay đổi form
  const handleValuesChange = (changedValues, allValues) => {
    if (role === "Nurse" && (changedValues.name || changedValues.phone)) {
      const newUserName = generateUserName(allValues.name, allValues.phone);
      setUserName(newUserName);
      form.setFieldsValue({ userName: newUserName });
    }

    if (changedValues.dob) {
      form.setFieldsValue({ age: calculateAge(allValues.dob) });
    }
  };

  // Xử lý submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
        age: calculateAge(values.dob),
        gender: values.gender === "Male" ? "M" : "F",
      };

      console.log("Sending data:", formattedData);

      if (role === "Doctor") {
        await axios.post(
          "https://vaccine-system1.azurewebsites.net/Doctor/create-doctor",
          formattedData
        );
      } else {
        const nurseData = {
          ...formattedData,
          userName: userName.replace("ST_", ""), // Bỏ "ST-" khi gửi API
          role: "Nurse",
          // userName: userName,
          password: "password",
        };

        console.log("Nurse data being sent:", nurseData);

        await axios.post(
          "https://vaccine-system1.azurewebsites.net/Staff/create-staff",
          nurseData
        );
      }

      message.success(`${role} added successfully!`);
      onClose();
      reloadData();
      form.resetFields();
      setUserName("");
    } catch (error) {
      console.error(`Error adding ${role}:`, error?.response?.data || error);
      message.error(`Failed to add ${role}!`);
    }
  };

  return (
    <Modal
      title="Add Doctor or Nurse"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        {/* Chọn Role */}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select
            placeholder="Select Role"
            onChange={(value) => {
              setRole(value);
              form.setFieldsValue({ role: value }); // Cập nhật giá trị vào form
            }}
          >
            <Option value="Doctor">Doctor</Option>
            <Option value="Nurse">Nurse</Option>
          </Select>
        </Form.Item>

        {/* Các trường chung */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dob"
          label="Date of Birth"
          rules={[{ required: true, message: "Please enter DOB!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            { required: true, message: "Age is required!" },
            { type: "number", min: 20, message: "Age must be at least 20!" },
          ]}
        >
          <Input type="number" disabled />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Please enter phone!" },
            { pattern: /^\d{10}$/, message: "Phone must be exactly 10 digits!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Nếu là Doctor */}
        {role === "Doctor" && (
          <>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter email!" }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter address!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Please enter degree!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="experienceYears"
              label="Experience (Years)"
              rules={[
                { required: true, message: "Please enter experience years!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </>
        )}

        {/* Nếu là Nurse */}
        {role === "Nurse" && (
          <>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter email!" }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Please enter degree!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="experienceYears"
              label="Experience (Years)"
              rules={[
                { required: true, message: "Please enter experience years!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            {/* Username (Tự động tạo, không thể chỉnh sửa) */}
            <Form.Item label="Username">
              <Input value={userName} disabled />
            </Form.Item>

            {/* Password (Mặc định, không thể chỉnh sửa) */}
            <Form.Item label="Password">
              <Input value="password" disabled />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AddDoctorNurse;
