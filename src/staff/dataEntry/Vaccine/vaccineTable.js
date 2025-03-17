// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Modal, Button, Table } from "antd";

// const VaccineList = () => {
//   const [vaccines, setVaccines] = useState([]);
//   const [selectedBatches, setSelectedBatches] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     axios.get("https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-for-staff")
//       .then(response => setVaccines(response.data))
//       .catch(error => console.error("Error fetching data:", error));
//   }, []);

//   const showBatches = (batches) => {
//     if (batches.length === 0) {
//       alert("No batches available for this vaccine");
//       return;
//     }
//     setSelectedBatches(batches);
//     setModalVisible(true);
//   };

//   return (
//     <div>
//       <h2>Vaccine List</h2>
//       <Table dataSource={vaccines} rowKey="vaccineId" bordered>
//         <Table.Column title="Vaccine Name" dataIndex="vaccineName" key="name" />
//         <Table.Column title="Description" dataIndex="description" key="desc" />
//         <Table.Column
//           title="Actions"
//           key="actions"
//           render={(record) => (
//             <Button onClick={() => showBatches(record.batches)}>View Batches</Button>
//           )}
//         />
//       </Table>

//       <Modal
//         title="Vaccine Batches"
//         visible={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//       >
//         <Table dataSource={selectedBatches} rowKey="batchNumber" bordered>
//           <Table.Column title="Batch Number" dataIndex="batchNumber" key="batchNumber" />
//           <Table.Column title="Manufacturer" dataIndex="manufacturer" key="manufacturer" />
//           <Table.Column title="Expiry Date" dataIndex="expiryDate" key="expiryDate" />
//           <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
//         </Table>
//       </Modal>
//     </div>
//   );
// };

// export default VaccineList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Input } from "antd";
import style from "./VaccineTable_style.module.css";

const VaccineList = () => {
  const [vaccines, setVaccines] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noBatchModalVisible, setNoBatchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async (name = "") => {
    try {
      const url = name
        ? `https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-by-name?name=${name}`
        : "https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-for-staff";

      const response = await axios.get(url);
      console.log("API Response:", response.data); // Debug dữ liệu trả về

      if (Array.isArray(response.data)) {
        // Chuẩn hóa dữ liệu
        const normalizedData = response.data.map((vaccine) => ({
          ...vaccine,
          vaccineName: vaccine.vaccineName || vaccine.name, // Chuyển name thành vaccineName
        }));

        setVaccines(normalizedData);
      } else {
        console.error("Unexpected API response format:", response.data);
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
    fetchVaccines(value); // Gọi API tìm kiếm theo tên
  };

  return (
    <div>
      <h2>Vaccine List</h2>

      <div className={style.toolbar}>
        {/* Nút Add và Update Vaccine */}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            Add Vaccine
          </Button>
          <Button type="default">Update Vaccine</Button>
        </div>

        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Search by vaccine name..."
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />
      </div>

      {/* Bảng danh sách vaccine */}
      <Table dataSource={vaccines} rowKey="vaccineId" bordered>
        <Table.Column title="Vaccine Name" dataIndex="vaccineName" key="name" />
        <Table.Column title="Description" dataIndex="description" key="desc" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(record) => (
            <Button onClick={() => showBatches(record.batches)}>
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
        footer={null}
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
    </div>
  );
};

export default VaccineList;
