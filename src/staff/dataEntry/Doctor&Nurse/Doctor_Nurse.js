import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Space, notification, Modal, Form, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import styles from "./Doctor&Nurse_style.module.css";
import { motion } from "framer-motion";

const { Option } = Select;

const mockData = [
  { id: 1, name: "Dr. John Doe", role: "Doctor", specialization: "Cardiology" },
  { id: 2, name: "Nurse Jane Smith", role: "Nurse", department: "Pediatrics" },
  { id: 3, name: "Dr. Alice Brown", role: "Doctor", specialization: "Neurology" },
  { id: 4, name: "Nurse Emily White", role: "Nurse", department: "Emergency" },
  { id: 5, name: "Dr. John Doe", role: "Doctor", specialization: "Cardiology" },
  { id: 6, name: "Nurse Jane Smith", role: "Nurse", department: "Pediatrics" },
  { id: 7, name: "Dr. Alice Brown", role: "Doctor", specialization: "Neurology" },
  { id: 88, name: "Nurse Emily White", role: "Nurse", department: "Emergency" },
];

const DoctorNurseCRUD = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shake, setShake] = useState(null);

  useEffect(() => {
    setDataSource(mockData);
  }, []);

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
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (<SearchOutlined style={{ color: filtered ? "#6A0DAD" : "#aaa" }} />),
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) => searchedColumn === dataIndex ? (
      <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
    ) : text,
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleAdd = () => {
    form.validateFields().then(values => {
      setDataSource([...dataSource, { id: dataSource.length + 1, ...values }]);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setShake(id);
    setTimeout(() => {
      setDataSource(dataSource.filter(item => item.id !== id));
      setShake(null);
    }, 500);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    { title: "Name", dataIndex: "name", key: "name", ...getColumnSearchProps("name") },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Doctor", value: "Doctor" },
        { text: "Nurse", value: "Nurse" },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: "Specialization / Department",
      dataIndex: "specialization",
      key: "specialization",
      render: (text, record) => record.role === "Doctor" ? text : record.department,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary">Edit</Button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="delete-btn"
            onClick={() => handleDelete(record.id)}
            animate={shake === record.id ? { x: [-5, 5, -5, 5, 0] } : {}}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </motion.button>
        </Space>
      ),
    },
  ];

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className={styles.title}>Manage Doctors & Nurses</h2>
      <div className={styles.toolbar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Add</Button>
        <Input placeholder="Search..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className={styles.searchBox} />
      </div>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Table dataSource={dataSource} columns={columns} rowKey="id" className={styles.table} />
      </motion.div>
      <Modal title="Add New" visible={isModalVisible} onCancel={handleCancel} onOk={handleAdd}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}> 
            <Select> <Option value="Doctor">Doctor</Option> <Option value="Nurse">Nurse</Option> </Select> 
          </Form.Item>
          <Form.Item name="specialization" label="Specialization / Department"> <Input /> </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default DoctorNurseCRUD;