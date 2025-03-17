
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

      const storedData = JSON.parse(localStorage.getItem("user"));
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
