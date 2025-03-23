import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import style from "./VaccineBatch_style.module.css";
import { Table, Input, Tag, Button } from "antd";
import NavbarForStaff from "../../NavbarForStaff";
import dayjs from "dayjs";
import UpdateVaccineBatch from "./updateVaccineBatch";
import AddVaccineBatch from "./addVaccineBatch";

const VaccineBatch = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchVaccineBatches();
  }, []);

  const fetchVaccineBatches = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system1.azurewebsites.net/VaccineBatch/get-vaccine-batch"
      );
      setBatches(response.data);
      setFilteredBatches(response.data);
    } catch (error) {
      console.error("Error fetching vaccine batches:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = batches.filter((batch) =>
      batch.batchNumber?.toLowerCase().includes(value)
    );
    setFilteredBatches(filtered);
  };

  const handleRowClick = (record) => {
    setSelectedBatch(record);
    setUpdateModalVisible(true);
  };

  // Lấy danh sách các quốc gia duy nhất từ dữ liệu
  const uniqueCountries = [...new Set(batches.map((batch) => batch.country))];

  // Danh sách các trạng thái cố định
  const statusFilters = [
    { text: "Available", value: "Available" },
    { text: "Out of Stock", value: "Out of Stock" },
    { text: "Expired", value: "Expired" },
  ];

  return (
    <div>
      <NavbarForStaff />
      <div className={style.container}>
        <h2>Vaccine Batch List</h2>
        <div className={style.toolbar}>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => setAddModalVisible(true)}
          >
            Add Vaccine Batch
          </Button>
          <Input
            placeholder="Search by Batch Number..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: 300 }}
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          />
        </div>
        <Table
          dataSource={filteredBatches}
          rowKey="batchNumber"
          bordered
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        >
          <Table.Column title="Batch Number" dataIndex="batchNumber" />
          <Table.Column title="Manufacturer" dataIndex="manufacturer" />
          <Table.Column
            title="Manufacture Date"
            dataIndex="manufactureDate"
            render={(date) => dayjs(date).format("YYYY-MM-DD")}
          />
          <Table.Column
            title="Expiry Date"
            dataIndex="expiryDate"
            render={(date) => dayjs(date).format("YYYY-MM-DD")}
          />
          <Table.Column
            title="Country"
            dataIndex="country"
            filters={uniqueCountries.map((country) => ({
              text: country,
              value: country,
            }))}
            onFilter={(value, record) => record.country === value}
          />
          <Table.Column
            title="Status"
            dataIndex="status"
            filters={statusFilters}
            onFilter={(value, record) => record.status === value}
            render={(status) => {
              let color =
                status === "Available"
                  ? "green"
                  : status === "Out of Stock"
                  ? "orange"
                  : "red";
              return <Tag color={color}>{status}</Tag>;
            }}
          />
        </Table>
      </div>

      <UpdateVaccineBatch
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        batch={selectedBatch}
        onUpdateSuccess={fetchVaccineBatches}
      />

      <AddVaccineBatch
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddSuccess={fetchVaccineBatches}
      />
    </div>
  );
};

export default VaccineBatch;
