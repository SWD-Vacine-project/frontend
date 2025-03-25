import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message, InputNumber } from "antd";
import axios from "axios";

const { Option } = Select;

const AddCombo = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    comboName: "",
    description: "",
    price: 0,
    vaccineIds: [],
  });
  const [allVaccines, setAllVaccines] = useState([]);
  const [vaccineCount, setVaccineCount] = useState(1);

  useEffect(() => {
    fetchAllVaccines();
  }, []);

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

  const handleAddCombo = async () => {
    if (formData.vaccineIds.length < vaccineCount) {
      message.warning(`You must select exactly ${vaccineCount} vaccines.`);
      return;
    }

    const payload = {
        name: formData.comboName,
        description: formData.description,
        price: formData.price,
        vaccineIds: formData.vaccineIds,
      };
    
      console.log("Sending data to API:", payload); // Log request data

    try {
      await axios.post(
        "https://vaccine-system1.azurewebsites.net/api/Vaccine/create-vacccine-combo",
        {
          name: formData.comboName,
          description: formData.description,
          price: formData.price,
          vaccineIds: formData.vaccineIds,
        }
      );
      message.success("Vaccine Combo added successfully!");
      onClose();
      refreshData();
    } catch (error) {
      message.error("Failed to add combo.");
      console.error("Error adding combo:", error);
    }
  };

  return (
    <Modal
      title="Add Vaccine Combo"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAddCombo}>
          Add
        </Button>,
      ]}
    >
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
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="How many vaccines in this combo?">
          <InputNumber
            min={1}
            value={vaccineCount}
            onChange={(value) => setVaccineCount(value)}
          />
        </Form.Item>

        <Form.Item label="Select Vaccines">
          <Select
            mode="multiple"
            value={formData.vaccineIds}
            onChange={handleVaccineChange}
            style={{ width: "100%" }}
            showSearch
            virtual
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
    </Modal>
  );
};

export default AddCombo;