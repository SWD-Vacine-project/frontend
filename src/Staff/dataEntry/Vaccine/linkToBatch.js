import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, message } from "antd";
import axios from "axios";

const LinkVaccineBatch = ({ visible, onClose, vaccine, onLinkSuccess }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [customBatch, setCustomBatch] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (visible) {
      fetchBatches();
      console.log("link to batch", vaccine);
    }
  }, [visible]);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system2.azurewebsites.net/VaccineBatch/get-vaccine-batch"
      );
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      message.error("Failed to load batches.");
    }
  };

  const handleLink = async () => {
    if (!quantity || quantity <= 0) {
      message.error("Quantity must be greater than 0.");
      return;
    }
    const batchId = selectedBatch || customBatch;
    if (!batchId) {
      message.error("Please select or enter a batch ID.");
      return;
    }

    const payload = {
      vaccineId: vaccine.vaccineId,
      quantity: parseInt(quantity, 10),
      batchId,
    };

    try {
      await axios.post(
        "https://vaccine-system2.azurewebsites.net/VaccineBatch/link-vaccine-to-batch",
        payload
      );
      message.success("Vaccine successfully linked to batch.");
      onLinkSuccess();
      onClose();
    } catch (error) {
      console.error("Error linking vaccine to batch:", error);
      message.error("Failed to link vaccine to batch.");
    }
  };

  return (
    <Modal
      title="Link Vaccine to Batch"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <p>Vaccine Name: {vaccine?.vaccineName}</p>
      <Input
        type="number"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min={1}
      />
      <Select
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Select existing batch"
        onChange={setSelectedBatch}
        allowClear
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {batches.map((batch) => (
          <Select.Option key={batch.batchNumber} value={batch.batchNumber}>
            {batch.batchNumber}
          </Select.Option>
        ))}
      </Select>
      {/* <Input
        style={{ marginTop: 10 }}
        placeholder="Or enter new batch ID"
        value={customBatch}
        onChange={(e) => setCustomBatch(e.target.value)}
      /> */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Button onClick={onClose} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleLink}>
          Link to Batch
        </Button>
      </div>
    </Modal>
  );
};

export default LinkVaccineBatch;