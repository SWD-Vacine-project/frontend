import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "./VaccineCombo_style.module.css";
import { Table, Input, Button } from "antd";
import UpdateCombo from "./updateCombo";
import AddCombo from "./addCombo";
import NavbarForStaff from "../../NavbarForStaff";

const VaccineCombo = () => {
  const [combos, setCombos] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVaccineCombos();
  }, []);

  const fetchVaccineCombos = async () => {
    try {
      const response = await axios.get(
        "https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-combo"
      );
      setCombos(response.data);
      setFilteredCombos(response.data);
    } catch (error) {
      console.error("Error fetching vaccine combos:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredCombos(
      combos.filter((combo) => combo.comboName.toLowerCase().includes(value))
    );
  };

  const handleRowClick = (record) => {
    setSelectedCombo(record);
    setIsModalOpen(true);
  };

  return (
    <div>
      <NavbarForStaff />
      <div className={style.container}>

        <h2>Vaccine Combo List</h2>

        <div className={style.toolbar}>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => setAddModalVisible(true)}
          >
            Add Combo
          </Button>

          <Input
            placeholder="Search by Combo Name..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: 300 }}
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          />
        </div>

        <Table
          dataSource={filteredCombos}
          rowKey="comboId"
          bordered
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={style.clickableRow}
        >
          <Table.Column
            title="Combo Name"
            dataIndex="comboName"
            key="comboName"
          />
          <Table.Column
            title="Description"
            dataIndex="description"
            key="description"
          />
          <Table.Column title="Price ($)" dataIndex="price" key="price" />
          <Table.Column
            title="Vaccines"
            dataIndex="vaccines"
            key="vaccines"
            render={(vaccines) =>
              vaccines.length > 0
                ? vaccines.map((vaccine) => (
                    <div key={vaccine.vaccineId}>
                      <strong>{vaccine.vaccineName}</strong>:{" "}
                      {vaccine.description}
                    </div>
                  ))
                : "No vaccines included"
            }
          />
        </Table>

        {/* Modal Update Vaccine Combo */}
        <UpdateCombo
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          combo={selectedCombo}
          refreshData={fetchVaccineCombos}
        />

        <AddCombo
          isOpen={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          refreshData={fetchVaccineCombos}
        />
      </div>
    </div>
  );
};

export default VaccineCombo;
