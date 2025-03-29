import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import moment from "moment";
import LoadingAnimation from "../../animation/loading-animation";

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
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("Paid");

  // Hiển thị thông báo nếu có thông tin appointment mới được chuyển qua state
  useEffect(() => {
    if (
      location.state &&
      location.state.appointmentIds &&
      location.state.appointmentDate
    ) {
      toast.success(
        `Appointment mới: ${location.state.appointmentIds.join(
          ", "
        )} - Ngày: ${moment(location.state.appointmentDate).format(
          "DD/MM/YYYY HH:mm"
        )}`
      );
    }
  }, [location.state]);

  // Fetch dữ liệu invoices, invoice-details và appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy user từ sessionStorage
        const storedUser = sessionStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!userId) {
          toast.error("Không tìm thấy thông tin user");
          setLoading(false);
          return;
        }

        // 1. Lấy invoices
        const invoicesResponse = await axios.get(
          "https://vaccine-system2.azurewebsites.net/api/Invoice/get-invoices"
        );
        // Lọc invoices theo customerId của user hiện tại
        const userInvoices = invoicesResponse.data.filter(
          (invoice) => invoice.customerId === userId
        );
        const sortedInvoices = userInvoices.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 2. Lấy invoiceDetails
        const invoiceDetailsResponse = await axios.get(
          "https://vaccine-system2.azurewebsites.net/api/InvoiceDetail/get-invoice-details"
        );
        const sortedInvoiceDetails = invoiceDetailsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 3. Lấy appointments
        const appointmentsResponse = await axios.get(
          "https://vaccine-system2.azurewebsites.net/Appointment/get-appointments"
        );
        const sortedAppointments = appointmentsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Kết hợp dữ liệu
        const combinedData = sortedInvoices.map((invoice) => {
          // Lọc ra tất cả invoiceDetail của invoice này
          const invoiceDetailsOfInvoice = sortedInvoiceDetails.filter(
            (detail) => detail.invoiceId === invoice.invoiceId
          );

          // Tìm appointment tương ứng cho mỗi invoiceDetail
          const appointmentsOfInvoice = invoiceDetailsOfInvoice.map((detail) => {
            if (!detail.appointmentId) return null;
            return sortedAppointments.find(
              (app) => app.appointmentId === detail.appointmentId
            );
          });

          // Loại bỏ các null (nếu có detail không có appointmentId)
          const validAppointments = appointmentsOfInvoice.filter(Boolean);

          // Tạo mảng appointmentId và appointmentDate
          const appointmentIds = validAppointments.map(
            (app) => app.appointmentId
          );
          const appointmentDates = validAppointments.map(
            (app) => app.appointmentDate
          );

          return {
            ...invoice,
            appointmentIds,
            appointmentDates,
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

  // Thay đổi hành vi nút Pay: chuyển hướng sang PaymentForm với dữ liệu invoice
  const handlePay = (invoice) => {
    navigate("/payment-form", { state: { invoice } });
  };

  // Lọc invoices theo tab Paid/Unpaid
  const getCurrentInvoices = () => {
    if (currentTab === "Paid") {
      return invoices.filter((invoice) => invoice.status === "Paid");
    } else if (currentTab === "Unpaid") {
      return invoices.filter((invoice) => invoice.status === "Unpaid");
    } else {
      return invoices;
    }
  };

  // Phân trang
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
                  <th className={classes.th}>Appointment IDs</th>
                  <th className={classes.th}>Appointment Dates</th>
                  <th className={classes.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice, index) => {
                    const { appointmentIds, appointmentDates } = invoice;
                    const appointmentIdsString =
                      appointmentIds && appointmentIds.length > 0
                        ? appointmentIds.join(", ")
                        : "N/A";
                    const appointmentDatesString =
                      appointmentDates && appointmentDates.length > 0
                        ? appointmentDates
                            .map((date) =>
                              date && moment(date, moment.ISO_8601, true).isValid()
                                ? moment(date).format("DD/MM/YYYY HH:mm")
                                : "N/A"
                            )
                            .join(", ")
                        : "N/A";
                    return (
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
                        <td className={classes.td}>{appointmentIdsString}</td>
                        <td className={classes.td}>{appointmentDatesString}</td>
                        <td className={classes.td}>
                          {invoice.status === "Unpaid" ? (
                            <button
                              className={classes.button}
                              onClick={() => handlePay(invoice)}
                            >
                              Pay
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className={classes.noData}>
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
