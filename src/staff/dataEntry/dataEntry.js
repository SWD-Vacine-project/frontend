import { useState } from "react";
import NavbarForStaff from "../NavbarForStaff";
import CustomerTable from "./Customer&Child/customerTable";
import VaccineList from "./Vaccine/vaccineTable";
import VaccineBatch from "./VaccineBatch/vaccineBatch";
import VaccineCombo from "./VaccineCombo/vaccineCombo";
import DoctorNurseCRUD from "./Doctor&Nurse/Doctor_Nurse";

const StaffDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("CustomerTable");

  return (
    <div>
      <NavbarForStaff setActiveComponent={setActiveComponent} />
      <div className="content">
        {activeComponent === "CustomerTable" && <CustomerTable />}
        {activeComponent === "VaccineList" && <VaccineList />}
        {activeComponent === "VaccineBatch" && <VaccineBatch />}
        {activeComponent === "VaccineCombo" && <VaccineCombo />}
        {activeComponent === "DoctorNurseCRUD" && <DoctorNurseCRUD />}
      </div>
    </div>
  );
};

export default StaffDashboard;
