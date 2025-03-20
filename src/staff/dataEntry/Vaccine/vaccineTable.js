import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Input, Form } from "antd";
import style from "./VaccineTable_style.module.css";
import { SearchOutlined } from "@ant-design/icons";
import UpdateVaccine from "./updateVaccine";
import AddVaccine from "./addVaccine";

const VaccineList = () => {
  const [vaccines, setVaccines] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noBatchModalVisible, setNoBatchModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async (name = "") => {
    try {
      const url = name
        ? `https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-by-name?name=${name}`
        : "https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-for-staff";

      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setVaccines(
          response.data.map((vaccine) => ({
            ...vaccine,
            vaccineName: vaccine.vaccineName || vaccine.name,
          }))
        );
      } else {
        setVaccines([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setVaccines([]);
    }
  };

  const showBatches = (batches) => {
    if (!batches || batches.length === 0) {
      setNoBatchModalVisible(true);
      return;
    }
    setSelectedBatches(batches);
    setModalVisible(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    fetchVaccines(value);
  };

  const handleRowClick = (record) => {
    setSelectedVaccine(record);
    setUpdateModalVisible(true);
  };

  return (
    <div className={style.component}>
      <div className={style.VaccineList}>
        <h2>Vaccine List</h2>
      </div>

      <div className={style.toolbar}>
        {/* Thanh tìm kiếm */}
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => setAddModalVisible(true)}
        >
          Add Vaccine
        </Button>
        <Input
          placeholder="Search by vaccine name..."
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
        />
      </div>

      {/* Bảng danh sách vaccine */}
      <Table
        dataSource={vaccines}
        rowKey="vaccineId"
        bordered
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Click vào hàng mở modal update
        })}
        rowClassName={style.rowHover} // Hiệu ứng hover
      >
        <Table.Column title="Vaccine Name" dataIndex="vaccineName" key="name" />
        <Table.Column title="Description" dataIndex="description" key="desc" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(record) => (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn mở modal update khi bấm View Batches
                showBatches(record.batches);
              }}
            >
              View Batches
            </Button>
          )}
        />
      </Table>

      {/* Modal hiển thị danh sách Batches */}
      <Modal
        title="Vaccine Batches"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="linkBatch"
            type="primary"
            onClick={() => console.log("Link to batch")}
          >
            Link to Batch
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Table dataSource={selectedBatches} rowKey="batchNumber" bordered>
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
            title="Expiry Date"
            dataIndex="expiryDate"
            key="expiryDate"
          />
          <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
        </Table>
      </Modal>

      {/* Modal khi không có batch */}
      <Modal
        title="No Batches Available"
        open={noBatchModalVisible}
        onCancel={() => setNoBatchModalVisible(false)}
        footer={[
          <Button
            key="linkBatch"
            type="primary"
            onClick={() => setNoBatchModalVisible(false)}
          >
            Link to Batch
          </Button>,
          <Button key="close" onClick={() => setNoBatchModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p>This vaccine does not have any available batches.</p>
      </Modal>

      {/* Modal Update Vaccine */}
      {/* <Modal
        title="Update Vaccine"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
        {selectedVaccine && (
          <Form layout="vertical">
            <Form.Item label="Vaccine Name">
              <Input value={selectedVaccine.vaccineName} disabled />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea value={selectedVaccine.description} />
            </Form.Item>
            <Button type="primary">Update</Button>
          </Form>
        )}
      </Modal> */}
      <UpdateVaccine
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        vaccine={selectedVaccine}
        onUpdateSuccess={fetchVaccines}
      />

      <AddVaccine
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddSuccess={fetchVaccines} // Gọi lại API để cập nhật danh sách sau khi thêm thành công
      />
    </div>
  );
};

export default VaccineList;
