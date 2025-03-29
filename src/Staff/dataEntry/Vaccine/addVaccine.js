import React, { useState } from "react";
import { Modal, Button, Form, Input, InputNumber, message } from "antd";
import axios from "axios";

const AddVaccine = ({ visible, onClose, onAddSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await axios.post("https://vaccine-system2.azurewebsites.net/api/Vaccine/create-vaccine", values);

      message.success("Vaccine added successfully!");
      form.resetFields();
      onAddSuccess(); // Gọi lại API để cập nhật danh sách
      onClose();
    } catch (error) {
      message.error("Failed to add vaccine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Vaccine"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" loading={loading} onClick={handleAdd}>
          Add Vaccine
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Vaccine Name"
          name="name"
          rules={[{ required: true, message: "Please enter vaccine name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Max Late Date"
          name="maxLateDate"
          rules={[
            { required: true, message: "Please enter max late date" },
            { type: "number", min: 1, message: "Must be greater than 0" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter price" },
            { type: "number", min: 1, message: "Must be greater than 0" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Internal Duration Doses"
          name="internalDurationDoses"
          rules={[
            { required: true, message: "Please enter internal duration doses" },
            { type: "number", min: 1, message: "Must be greater than 0" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVaccine;