import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, InputNumber, message } from "antd";
import axios from "axios";

const UpdateVaccine = ({ visible, onClose, vaccine, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Vaccine data hehe:", vaccine);
    if (vaccine && visible) {
      form.setFieldsValue({
        name: vaccine.vaccineName || "",
        maxLateDate: vaccine.maxLateDate || "",
        price: vaccine.price || 0,
        description: vaccine.description || "",
        internalDurationDoses: vaccine.internalDurationDoses || 0,
      });
    }
  }, [vaccine, visible]); // Chỉ cập nhật khi `vaccine` hoặc `visible` thay đổi

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await axios.put(
        `https://vaccine-system2.azurewebsites.net/api/Vaccine/update-vaccine/${vaccine.vaccineId}`,
        values
      );
      message.success("Vaccine updated successfully!");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      message.error("Failed to update vaccine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Vaccine"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" loading={loading} onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Vaccine Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Max Late Date" name="maxLateDate" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Internal Duration Doses" name="internalDurationDoses" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateVaccine;

