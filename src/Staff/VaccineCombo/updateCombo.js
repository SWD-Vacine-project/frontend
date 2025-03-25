import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message, InputNumber } from "antd";
import axios from "axios";

const { Option } = Select;

const UpdateCombo = ({ isOpen, onClose, combo, refreshData }) => {
  const [formData, setFormData] = useState(combo);
  const [allVaccines, setAllVaccines] = useState([]);
  const [vaccineCount, setVaccineCount] = useState(combo?.vaccines.length || 1);

  useEffect(() => {
    if (combo) {
      setFormData({
        ...combo,
        vaccineIds: combo.vaccines.map((v) => v.vaccineId),
      });
      fetchAllVaccines();
    }
  }, [combo]);

  const fetchAllVaccines = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system1.azurewebsites.net/api/Vaccine"
      );
      setAllVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleVaccineChange = (selectedIds) => {
    if (selectedIds.length <= vaccineCount) {
      handleChange("vaccineIds", selectedIds);
    } else {
      message.warning(`You can only select up to ${vaccineCount} vaccines.`);
    }
  };

  const handleUpdate = async () => {
    if (formData.vaccineIds.length < vaccineCount) {
        message.warning(`You must select exactly ${vaccineCount} vaccines.`);
        return;
      }    

      try {
        await axios.put(
          `https://vaccine-system1.azurewebsites.net/api/Vaccine/update-vacccine-combo/${formData.comboId}`,
          {
            name: formData.comboName,
            description: formData.description,
            price: formData.price,
            vaccineIds: formData.vaccineIds,
          }
        );
        message.success("Vaccine Combo updated successfully!");
        onClose();
        refreshData();
      } catch (error) {
        message.error("Failed to update combo.");
        console.error("Error updating combo:", error);
      }
    };

  return (
    <Modal
      title="Update Vaccine Combo"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      {formData && (
        <Form layout="vertical">
          <Form.Item label="Combo Name">
            <Input
              value={formData.comboName}
              onChange={(e) => handleChange("comboName", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Price ($)">
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                handleChange("price", parseFloat(e.target.value))
              }
            />
          </Form.Item>

          {/* Hỏi số lượng vaccine trước */}
          <Form.Item label="How many vaccines in this combo?">
            <InputNumber
              min={1}
              value={vaccineCount}
              onChange={(value) => setVaccineCount(value)}
            />
          </Form.Item>

          {/* Chọn vaccine theo số lượng đã chọn */}
          <Form.Item label="Select Vaccines">
            <Select
              mode="multiple"
              value={formData.vaccineIds}
              onChange={handleVaccineChange}
              style={{ width: "100%" }}
              showSearch
              virtual // Kích hoạt Virtual Scrolling
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {allVaccines.map((vaccine) => (
                <Option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                  {vaccine.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateCombo;