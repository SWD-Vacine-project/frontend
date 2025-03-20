import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  notification,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { motion } from "framer-motion";
import axios from "axios";
import NavbarForStaff from "../../NavbarForStaff";
import styles from "./Doctor&Nurse_style.module.css";

const { Option } = Select;

const DoctorNurseCRUD = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const [doctorRes, nurseRes] = await Promise.all([
        axios.get("https://vaccine-system1.azurewebsites.net/Doctor/get-doctors"),
        axios.get("https://vaccine-system1.azurewebsites.net/Staff/get-all-nurse"),
      ]);

      const doctors = doctorRes.data.map((doc) => ({
        name: doc.name,
        role: "Doctor",
        gender: doc.gender === "M" ? "Male" : "Female",
        phone: doc.phone,
        degree: doc.degree,
        experienceYears: doc.experienceYears,
      }));

      const nurses = nurseRes.data.map((nurse) => ({
        name: nurse.name,
        role: "Nurse",
        gender: nurse.gender === "M" ? "Male" : "Female",
        phone: nurse.phone,
        degree: nurse.degree,
        experienceYears: nurse.experienceYears,
      }));

      const mergedData = [...doctors, ...nurses];

      setDataSource(mergedData);
      setFilteredData(mergedData); // Lưu bản gốc cho tìm kiếm
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({ message: "Failed to load data" });
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Tìm kiếm trong bảng
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#6A0DAD" : "#aaa" }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
    setFilteredData(
      dataSource.filter((item) =>
        item[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
      )
    );
  };

  const handleReset = async(clearFilters) => {
    if (clearFilters) clearFilters();
    setSearchText("");
    setSearchedColumn("");
    resetFiltersAndSearch();
    await fetchData(); // Tải lại API
  };

  const resetFiltersAndSearch = () => {
    setSearchText("");
    setFilteredData(dataSource);
  };

  // Cấu trúc bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Doctor", value: "Doctor" },
        { text: "Nurse", value: "Nurse" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Degree",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "Experience (Years)",
      dataIndex: "experienceYears",
      key: "experienceYears",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary">
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <NavbarForStaff />
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>Manage Doctors & Nurses</h2>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add
          </Button>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setFilteredData(
                dataSource.filter((item) =>
                  item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                  item.phone.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }}
            className={styles.searchBox}
          />
        </div>
        <Table dataSource={filteredData} columns={columns} rowKey="name" className={styles.table} />
      </motion.div>
    </div>
  );
};

export default DoctorNurseCRUD;
