import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles"; // Import makeStyles từ @mui/styles
import axios from "axios";
import moment from "moment";
import LoadingAnimation from "../../animation/loading-animation";

// Định nghĩa useStyles để tạo các lớp CSS sử dụng makeStyles
const useStyles = makeStyles((theme) => ({
  manageBookingsPage: {
    height: "fit-content",
    padding: "1rem 0",
    maxWidth: "1000px",
    margin: "2rem auto",
    borderRadius: "8px",
    marginTop: "100px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    animation: "$fadeIn 0.5s ease-in-out",
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  bookingsSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "1rem",
  },
  manageBookingsTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#4D9FEC",
    fontWeight: "bold",
    animation: "$slideIn 0.5s ease-in-out",
  },
  "@keyframes slideIn": {
    "0%": { opacity: 0, transform: "translateX(-20px)" },
    "100%": { opacity: 1, transform: "translateX(0)" },
  },
  toggleButton: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
    gap: "1rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    border: "none",
    backgroundColor: "#4D9FEC",
    color: "white",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1.5rem",
    transition: "background-color .3s, transform 0.2s ease, border .3s",
    "&:hover": {
      backgroundColor: "#3B8ECB",
      transform: "scale(1.05)",
    },
    "&.active": {
      backgroundColor: "#8ACBFF",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1.5rem",
    animation: "$fadeIn 0.5s ease-in-out",
  },
  th: {
    border: "1px solid #F0F0F0",
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "1.5rem",
    backgroundColor: "#4D9FEC",
    color: "white",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #F0F0F0",
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "1.5rem",
    backgroundColor: "#FFFFFF",
    color: "#333333",
    transition: "background-color 0.3s ease",
  },
  tr: {
    "&:hover": {
      backgroundColor: "#E8F4FF",
    },
  },
  statusCell: {
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  statusPaid: {
    color: "#5cb85c",
    backgroundColor: "#E1F3E5",
  },
  statusUnpaid: {
    color: "#f0ad4e",
    backgroundColor: "#FFF9E1",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
    "& .MuiPaginationItem-root": {
      backgroundColor: "#4D9FEC",
      color: "#fff",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      "&:hover": {
        backgroundColor: "#3B8ECB",
      },
      "&.Mui-selected": {
        backgroundColor: "#8ACBFF",
        color: "#fff",
      },
    },
  },
  noData: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
    marginTop: "2rem",
  },
}));

const ManageBookings = () => {
  const classes = useStyles(); // Sử dụng useStyles đã định nghĩa
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("Paid");

  // Hiển thị thông báo nếu có thông tin appointment mới được chuyển qua state
  useEffect(() => {
    if (location.state && location.state.appointmentIds && location.state.appointmentDate) {
      toast.success(
        `Appointment mới: ${location.state.appointmentIds.join(
          ", "
        )} - Ngày: ${moment(location.state.appointmentDate).format("DD/MM/YYYY HH:mm")}`
      );
    }
  }, [location.state]);

  // Fetch dữ liệu invoices, invoice-details và appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesResponse = await axios.get(
          "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Invoice/get-invoices"
        );
        const sortedInvoices = invoicesResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const invoiceDetailsResponse = await axios.get(
          "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/InvoiceDetail/get-invoice-details"
        );
        const sortedInvoiceDetails = invoiceDetailsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const appointmentsResponse = await axios.get(
          "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Appointment/get-appointments"
        );
        const sortedAppointments = appointmentsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const combinedData = sortedInvoices.map((invoice) => {
          const invoiceDetail = sortedInvoiceDetails.find(
            (detail) => detail.invoiceId === invoice.invoiceId
          );
          let appointment;
          if (invoiceDetail && invoiceDetail.appointmentId) {
            appointment = sortedAppointments.find(
              (app) => app.appointmentId === invoiceDetail.appointmentId
            );
          }
          if (!appointment) {
            appointment = sortedAppointments.find(
              (app) => app.customerId === invoice.customerId
            );
          }
          return {
            ...invoice,
            appointmentId: appointment ? appointment.appointmentId : "N/A",
            appointmentDate:
              appointment && appointment.appointmentDate
                ? appointment.appointmentDate
                : "N/A",
          };
        });

        setInvoices(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentInvoices = () => {
    if (currentTab === "Paid") {
      return invoices.filter((invoice) => invoice.status === "Paid");
    } else if (currentTab === "Unpaid") {
      return invoices.filter((invoice) => invoice.status === "Unpaid");
    } else {
      return invoices;
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentInvoices = getCurrentInvoices().slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTabChange = (status) => {
    setCurrentTab(status);
    setCurrentPage(1);
  };

  return (
    <div className={classes.manageBookingsPage}>
      {loading && <LoadingAnimation />}
      <h2 className={classes.manageBookingsTitle}>Manage Bookings</h2>
      <div className={classes.toggleButton}>
        <button
          className={`${classes.button} ${
            currentTab === "Paid" ? "active" : ""
          }`}
          onClick={() => handleTabChange("Paid")}
        >
          Paid
        </button>
        <button
          className={`${classes.button} ${
            currentTab === "Unpaid" ? "active" : ""
          }`}
          onClick={() => handleTabChange("Unpaid")}
        >
          Unpaid
        </button>
      </div>

      <div className={classes.bookingsSection}>
        <h1>{currentTab} Bookings</h1>
        {loading ? (
          <p>Loading {currentTab.toLowerCase()} bookings...</p>
        ) : (
          <>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.th}>#</th>
                  <th className={classes.th}>Invoice ID</th>
                  <th className={classes.th}>Customer ID</th>
                  <th className={classes.th}>Total Amount</th>
                  <th className={classes.th}>Status</th>
                  <th className={classes.th}>Type</th>
                  <th className={classes.th}>Created At</th>
                  <th className={classes.th}>Appointment ID</th>
                  <th className={classes.th}>Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice, index) => (
                    <tr key={invoice.invoiceId} className={classes.tr}>
                      <td className={classes.td}>
                        {indexOfFirstBooking + index + 1}
                      </td>
                      <td className={classes.td}>{invoice.invoiceId}</td>
                      <td className={classes.td}>{invoice.customerId}</td>
                      <td className={classes.td}>{invoice.totalAmount}</td>
                      <td
                        className={`${classes.statusCell} ${
                          invoice.status === "Paid"
                            ? classes.statusPaid
                            : classes.statusUnpaid
                        }`}
                      >
                        {invoice.status}
                      </td>
                      <td className={classes.td}>{invoice.type}</td>
                      <td className={classes.td}>
                        {moment(invoice.createdAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className={classes.td}>{invoice.appointmentId}</td>
                      <td className={classes.td}>
                        {invoice.appointmentDate &&
                        invoice.appointmentDate !== "N/A" &&
                        moment(
                          invoice.appointmentDate,
                          moment.ISO_8601,
                          true
                        ).isValid()
                          ? moment(invoice.appointmentDate).format(
                              "DD/MM/YYYY HH:mm"
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className={classes.noData}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {getCurrentInvoices().length > bookingsPerPage && (
              <Pagination
                count={Math.ceil(getCurrentInvoices().length / bookingsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                size="large"
                className={classes.pagination}
              />
            )}
          </>
        )}
      </div>

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default ManageBookings;
