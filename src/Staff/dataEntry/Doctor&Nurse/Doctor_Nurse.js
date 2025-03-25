import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Space, Spin } from "antd";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import NavbarForStaff from "../../NavbarForStaff";
import UpdateDoctorNurse from "./UpdateDoctorNurse";
import styles from "./Doctor&Nurse_style.module.css";
import AddDoctorNurse from "./addDoctorNurse";

const DoctorNurseCRUD = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorRes, nurseRes] = await Promise.all([
        axios.get("https://vaccine-system1.azurewebsites.net/Doctor/get-doctors"),
        axios.get("https://vaccine-system1.azurewebsites.net/Staff/get-all-nurse"),
      ]);

      const doctors = doctorRes.data.map((doc) => ({
        id: doc.doctorId,
        name: doc.name,
        role: "Doctor",
        gender: doc.gender === "M" ? "Male" : "Female",
        phone: doc.phone,
        degree: doc.degree,
        experienceYears: doc.experienceYears,
      }));

      const nurses = nurseRes.data.map((nurse) => ({
        id: nurse.staffId,
        name: nurse.name,
        role: "Nurse",
        gender: nurse.gender === "M" ? "Male" : "Female",
        phone: nurse.phone,
        degree: nurse.degree,
        experienceYears: nurse.experienceYears,
      }));

      setDataSource([...doctors, ...nurses]);
      setFilteredData([...doctors, ...nurses]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  // Tìm kiếm theo tên hoặc số điện thoại
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) => item.name.toLowerCase().includes(value) || item.phone.includes(value)
    );
    setFilteredData(filtered);
  };

  // Cấu trúc bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          <Button icon={<EditOutlined />} type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <NavbarForStaff />
      <div className={styles.container}>
        <h2 className={styles.title}>Manage Doctors & Nurses</h2>

        {loading ? (
          <div className={styles.loading_container}>
            <Spin size="large" />
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* Thanh tìm kiếm */}
            <div className={styles.searchContainer}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className={styles.addButton}>
                Add
              </Button>

              <Input
                placeholder="Search by Name or Phone"
                value={searchText}
                onChange={handleSearch}
                prefix={<SearchOutlined />}
                className={styles.searchInput}
              />
            </div>

            {/* Bảng danh sách */}
            <Table dataSource={filteredData} columns={columns} rowKey="id" className={styles.table} />
          </>
        )}

        {/* Modal thêm mới */}
        <AddDoctorNurse
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          reloadData={fetchData}
        />

        {/* Modal cập nhật */}
        {selectedUser && (
          <UpdateDoctorNurse
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            user={selectedUser}
            reloadData={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorNurseCRUD;