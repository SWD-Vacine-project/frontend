import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Menu, Table, Button, Modal, Input, Select, Form } from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "../Vaccine/VaccineTable_style.module.css";

const { Option } = Select;
const { Header, Sider, Content } = Layout;

const VaccineTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine"
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showEditModal = (record) => {
    setEditingVaccine(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingVaccine) {
        setData(
          data.map((item) =>
            item.id === editingVaccine.id ? { ...values, id: editingVaccine.id } : item
          )
        );
      } else {
        setData([...data, { ...values, id: data.length + 1 }]);
      }
      setFilteredData(data);
      setIsModalOpen(false);
      setEditingVaccine(null);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVaccine(null);
    form.resetFields();
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(
      data.filter((item) => item.name.toLowerCase().includes(value))
    );
  };

  const columns = [
    { title: "Vaccine Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Manufacturer", dataIndex: "manufacturer", key: "manufacturer" },
    { title: "Batch", dataIndex: "batch", key: "batch" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Expiry Date", dataIndex: "expiry", key: "expiry" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => showEditModal(record)} className={styles.editButton}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider theme="dark" width={250} className={styles.sider}>
        <div className={styles.title}>Vaccine Management</div>
        <Menu theme="dark" mode="vertical">
          <Menu.Item key="1" icon={<DatabaseOutlined />}>
            Create Batch
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            Create Vaccine
          </Menu.Item>
          <Menu.Item key="3" icon={<PlusOutlined />}>
            Create Vaccine Combo
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>Manage Vaccines</Header>
        <Content className={styles.content}>
          <div className={styles.toolbar}>
            <Button type="primary" onClick={() => showEditModal(null)}>
              Add Vaccine
            </Button>
            <Input
              placeholder="Search vaccine..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchBox}
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            className={styles.table}
          />

          <Modal
            title={editingVaccine ? "Edit Vaccine" : "Add Vaccine"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label="Vaccine Name"
                rules={[{ required: true, message: "Please enter vaccine name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="type" label="Type">
                <Select className={styles.selectBox}>
                  <Option value="Virus">Virus</Option>
                  <Option value="Bacteria">Bacteria</Option>
                </Select>
              </Form.Item>
              <Form.Item name="manufacturer" label="Manufacturer">
                <Input />
              </Form.Item>
              <Form.Item name="batch" label="Batch">
                <Input />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="expiry" label="Expiry Date">
                <Input type="date" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default VaccineTable;
