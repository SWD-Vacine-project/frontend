import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Button,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const AddVaccineBatch = ({ visible, onClose, onAddSuccess }) => {
  const [batchNumber, setBatchNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [manufactureDate, setManufactureDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [country, setCountry] = useState("");
  const [vaccines, setVaccines] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);

  useEffect(() => {
    fetchVaccines();
  }, []);
  const fetchVaccines = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system1.azurewebsites.net/api/Vaccine"
      );
      setAllVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const addVaccine = () => {
    setVaccines([...vaccines, { vaccineId: null, quantity: 1 }]);
  };

  const updateVaccine = (index, field, value) => {
    const updatedVaccines = [...vaccines];
    updatedVaccines[index][field] = value;
    setVaccines(updatedVaccines);
  };

  const handleSubmit = async () => {
    if (
      !batchNumber ||
      !manufacturer ||
      !manufactureDate ||
      !expiryDate ||
      !country
    ) {
      return message.error("Please fill in all fields.");
    }
    if (vaccines.some((v) => !v.vaccineId || v.quantity <= 0)) {
      return message.error(
        "Each vaccine must have a valid ID and quantity greater than 0."
      );
    }

    const payload = {
      batchNumber,
      manufacturer,
      manufactureDate: dayjs(manufactureDate).format("YYYY-MM-DD"),
      expiryDate: dayjs(expiryDate).format("YYYY-MM-DD"),
      country,
      status: "Available",
      vaccineBatchDetails: vaccines,
    };

    try {
      await axios.post(
        "https://vaccine-system1.azurewebsites.net/VaccineBatch/create-vaccine-batch",
        payload
      );
      message.success("Vaccine batch added successfully");
      onAddSuccess();
      onClose();
    } catch (error) {
      message.error("Error adding vaccine batch");
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add Vaccine Batch"
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Input
        placeholder="Batch Number"
        value={batchNumber}
        onChange={(e) => setBatchNumber(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <DatePicker
        placeholder="Manufacture Date"
        value={manufactureDate}
        onChange={setManufactureDate}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <DatePicker
        placeholder="Expiry Date"
        value={expiryDate}
        onChange={setExpiryDate}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <Input
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {vaccines.map((vaccine, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
        >
          <Select
            value={vaccine.vaccineId}
            onChange={(value) => updateVaccine(index, "vaccineId", value)}
            style={{ flex: 1 }}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {allVaccines.map((v) => (
              <Option key={v.vaccineId} value={v.vaccineId}>
                {v.name}
              </Option>
            ))}
          </Select>
          <InputNumber
            min={1}
            value={vaccine.quantity}
            onChange={(value) => updateVaccine(index, "quantity", value)}
            style={{ width: "100px" }}
          />
        </div>
      ))}

      <Button
        type="dashed"
        onClick={addVaccine}
        style={{ marginBottom: "15px" }}
      >
        + Add Vaccine
      </Button>
    </Modal>
  );
};

export default AddVaccineBatch;