import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";
import ChildrenList from "./ChildrenCarousel";
import style from "../Customer&Child/CustomerTable_style.module.css";
import NavbarForStaff from "../../NavbarForStaff";
import { Spin } from "antd";


const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://vaccine-system1.azurewebsites.net/Customer/get-customer"
        );
        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setEditingCustomer(customer.customerId);
    setFormData({
      name: customer.name || "",
      dob: customer.dob || "",
      gender: customer.gender || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      bloodType: customer.bloodType || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;

    try {
      await axios.put(
        `https://vaccine-system1.azurewebsites.net/Customer/update-customer/${editingCustomer}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      notification.success({
        message: "Update Successful",
        description: "Customer information has been updated successfully.",
      });

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.customerId === editingCustomer
            ? { ...customer, ...formData }
            : customer
        )
      );
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);

      notification.error({
        message: "Update Failed",
        description: "An error occurred while updating customer information.",
      });
    }
  };

  // const handleOpenModal = (customerId) => {
  //   setSelectedCustomerId(customerId);
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShowChildren = (customer) => {
    console.log("Clicked Customer ID:", customer.customerId); // Kiểm tra ID có đúng không
    setSelectedCustomerId(customer.customerId); // Lưu customerId
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className={style.loading_container}>/
        <Spin size="large" />
        <p>Loading customer data...</p>
      </div>
    );  if (error) return <p className="error">Failed to load data.</p>;
  if (customers.length === 0)
    return <p className="error">No customer data available.</p>;

  return (
    <div>
      <NavbarForStaff />

      <div className={style.customer_container}>
        <h2>Customer Information</h2>
        <table className={style.customer_table}>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Birthday</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Blood Type</th>
              <th>Number of Children</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerId ?? "N/A"}</td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    customer.name ?? "N/A"
                  )}
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  ) : (
                    customer.dob ?? "N/A"
                  )}
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={style["select-box"]}
                    >
                      <option>Choose gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  ) : (
                    customer.gender ?? "N/A"
                  )}
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    customer.phone ?? "N/A"
                  )}
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    customer.address ?? "N/A"
                  )}
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className={style["select-box"]}
                    >
                      <option>Choose blood type</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  ) : (
                    customer.bloodType ?? "N/A"
                  )}
                </td>
                <td>
                  <button onClick={() => handleShowChildren(customer)}>
                    {customer.children ? customer.children.length : "N/A"}
                  </button>
                </td>
                <td>
                  {editingCustomer === customer.customerId ? (
                    <>
                      <button className={style.btn} onClick={handleUpdate}>
                        Save
                      </button>
                      <button
                        className={style.cancel_btn}
                        onClick={() => setEditingCustomer(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={style.btn}
                      onClick={() => handleEditClick(customer)}
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ChildrenList
          customerId={selectedCustomerId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default CustomerTable;