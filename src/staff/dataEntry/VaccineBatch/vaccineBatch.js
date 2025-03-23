import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import style from "./VaccineBatch_style.module.css";
import { Table, Input, Tag } from "antd";
import NavbarForStaff from "../../NavbarForStaff";

const VaccineBatch = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  // Xử lý tìm kiếm theo Batch Number
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = batches.filter((batch) =>
      batch.batchNumber?.toLowerCase().includes(value)
    );

    setFilteredBatches(filtered);
  };

  // Lấy danh sách quốc gia duy nhất để tạo bộ lọc
  const uniqueCountries = [...new Set(batches.map((batch) => batch.country))];

  return (
    <div>
      <NavbarForStaff />
      <div className={style.container}>
        <h2>Vaccine Batch List</h2>

        <div className={style.toolbar}>
          <Input
            placeholder="Search by Batch Number..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: 300 }}
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          />
        </div>

        <Table dataSource={filteredBatches} rowKey="batchNumber" bordered>
          <Table.Column
            title="Batch Number"
            dataIndex="batchNumber"
            key="batchNumber"
          />
          <Table.Column
            title="Manufacturer"
            dataIndex="manufacturer"
            key="manufacturer"
          />
          <Table.Column
            title="Manufucturer Date"
            dataIndex="manufacturerDate"
            key="manufacturerDate"
            render={(date) => new Date(date).toLocaleDateString()}
          />
          <Table.Column
            title="Expiry Date"
            dataIndex="expiryDate"
            key="expiryDate"
            render={(date) => new Date(date).toLocaleDateString()}
          />
          <Table.Column
            title="Country"
            dataIndex="country"
            key="country"
            filters={uniqueCountries.map((country) => ({
              text: country,
              value: country,
            }))}
            onFilter={(value, record) => record.country === value}
          />
          <Table.Column
            title="Status"
            dataIndex="status"
            key="status"
            filters={[
              { text: "Available", value: "Available" },
              { text: "Out of Stock", value: "Out of Stock" },
              { text: "Expired", value: "Expired" },
            ]}
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
    </div>
  );
};

export default VaccineBatch;
