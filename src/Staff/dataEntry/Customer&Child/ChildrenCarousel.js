import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Spin, notification, Table, Input, Button, Select } from "antd";

const { Option } = Select;

const ChildrenList = ({ customerId, isOpen, onClose }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingChild, setEditingChild] = useState({});

  useEffect(() => {
    if (customerId && isOpen) {
      fetchChildren(customerId);
    }
    console.log("hehehehe ", customerId);
  }, [customerId, isOpen]);

  const fetchChildren = async (customerId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://vaccine-system2.azurewebsites.net/Child/get-child/${customerId}`
      );

      if (response.data && Array.isArray(response.data)) {
        setChildren(response.data);
      } else {
        setChildren([]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      notification.error({
        message: "Error",
        description: "Failed to load children data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (childId, field, value) => {
    setChildren((prevChildren) =>
      prevChildren.map((child) =>
        child.childId === childId ? { ...child, [field]: value } : child
      )
    );

    setEditingChild((prevEditing) => ({
      ...prevEditing,
      [childId]: {
        ...prevEditing[childId],
        customerId, // Đảm bảo có customerId
        [field]: value,
      },
    }));
  };

  // Gửi API cập nhật thông tin
  const handleSave = async (childId) => {
    if (!editingChild[childId]) {
      notification.error({
        message: "Error",
        description: "No changes detected!",
      });
      return;
    }

    const childToUpdate = children.find((child) => child.childId === childId);
    if (!childToUpdate) return;
    
    const { name, dob, bloodType, gender } = childToUpdate;

    
    console.log("Checking data before sending:", {
      name,
      dob,
      bloodType,
      gender,
    });

    // Kiểm tra dữ liệu trước khi gửi
    if (!name?.trim() || !dob || !bloodType || !gender) {
      notification.error({
        message: "Error",
        description: "All fields are required!",
      });
      return;
    }

    // Chuẩn bị payload
    const payload = {
      customerId,
      name: name.trim(),
      dob,
      bloodType,
      gender,
    };

    console.log("Sending update request with:", payload);

    try {
      const response = await axios.put(
        `https://vaccine-system2.azurewebsites.net/Child/update-child/${childId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update success:", response.data);
      notification.success({
        message: "Success",
        description: "Child information updated successfully",
      });

      fetchChildren(customerId); // Reload danh sách
    } catch (error) {
      console.error(
        "Error updating child:",
        error.response?.data || error.message
      );
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to update child information",
      });
    }
  };

  // Cấu hình bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Input
          value={record.name}
          onChange={(e) =>
            handleInputChange(record.childId, "name", e.target.value)
          }
        />
      ),
    },
    {
      title: "Birthday",
      dataIndex: "dob",
      key: "dob",
      render: (text, record) => (
        <Input
          type="date"
          value={record.dob}
          onChange={(e) =>
            handleInputChange(record.childId, "dob", e.target.value)
          }
        />
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text, record) => (
        <Select
          value={record.gender}
          style={{ width: "100%" }}
          onChange={(value) =>
            handleInputChange(record.childId, "gender", value)
          }
        >
          <Option value disable select></Option>
          <Option value="M">Male</Option>
          <Option value="F">Female</Option>
        </Select>
      ),
    },
    {
      title: "Blood Type",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text, record) => (
        <Select
          value={record.bloodType}
          style={{ width: "100%" }}
          onChange={(value) =>
            handleInputChange(record.childId, "bloodType", value)
          }
        >
          <Option value disable select></Option>
          <Option value="A">A</Option>
          <Option value="B">B</Option>
          <Option value="AB">AB</Option>
          <Option value="O">O</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleSave(record.childId)}>
          Save
        </Button>
      ),
    },
  ];

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={800} centered>
      <h3>Children Information</h3>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={children}
          columns={columns}
          rowKey="childId"
          pagination={false}
        />
      )}
    </Modal>
  );
};

export default ChildrenList;