import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message, InputNumber } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const UpdateVaccineBatch = ({ visible, onClose, batch, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);

  useEffect(() => {
    if (batch) {
      form.setFieldsValue({
        batchNumber: batch.batchNumber,
        manufacturer: batch.manufacturer,
        manufactureDate: dayjs(batch.manufactureDate),
        expiryDate: dayjs(batch.expiryDate),
        country: batch.country,
        status: batch.status,
      });
      setVaccines(batch.vaccines || []);
    }
  }, [batch, form]);

  useEffect(() => {
    axios.get("https://vaccine-system2.azurewebsites.net/api/Vaccine")
      .then(response => setAllVaccines(response.data))
      .catch(error => console.error("Error fetching vaccines:", error));
  }, []);

  const addVaccine = () => {
    setVaccines([...vaccines, { vaccineId: null, quantity: 1 }]);
  };

  const updateVaccine = (index, field, value) => {
    const updatedVaccines = [...vaccines];
    updatedVaccines[index][field] = value;
    setVaccines(updatedVaccines);
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        // batchNumber: batch.batchNumber,
        manufacturer: values.manufacturer,
        manufactureDate: values.manufactureDate.format("YYYY-MM-DD"),
        expiryDate: values.expiryDate.format("YYYY-MM-DD"),
        country: values.country,
        status: values.status,
        vaccineBatchDetails: vaccines.map(v => ({ vaccineId: v.vaccineId, quantity: v.quantity })),
      };

      console.log("hehehehe");
      console.log("Payload gửi lên API:", JSON.stringify(payload, null, 2));

      await axios.put(
        `https://vaccine-system2.azurewebsites.net/VaccineBatch/update/${batch.batchNumber}`,
        payload
      );

      message.success("Vaccine batch updated successfully");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      message.error("Failed to update vaccine batch");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Update Vaccine Batch" visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="batchNumber" label="Batch Number">
          <Input disabled />
        </Form.Item>
        <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="manufactureDate" label="Manufacture Date" rules={[{ required: true }]}> 
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}> 
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}> 
          <Select>
            <Option value="available">Available</Option>
            <Option value="out_of_stock">Out of Stock</Option>
            <Option value="expired">Expired</Option>
          </Select>
        </Form.Item>

        <h3>Vaccines in this Batch</h3>
        {vaccines.map((vaccine, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <Select
              value={vaccine.vaccineId}
              onChange={(value) => updateVaccine(index, "vaccineId", value)}
              style={{ flex: 1 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {allVaccines.map(v => (
                <Option key={v.vaccineId} value={v.vaccineId}>{v.name}</Option>
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

        <Button type="dashed" onClick={addVaccine} style={{ marginBottom: "15px" }}>
          + Add Vaccine
        </Button>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateVaccineBatch;