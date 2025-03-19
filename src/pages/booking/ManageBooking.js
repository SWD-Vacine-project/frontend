import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import moment from "moment";
import LoadingAnimation from "../../animation/loading-animation";

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  manageBookingsPage: {
    height: "fit-content",
    padding: "1rem 0",
    maxWidth: "1000px",
    margin: "2rem auto",
    borderRadius: "8px",
    marginTop: "100px",
    backgroundColor: "#f9f9f9", // Light background color
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow
    animation: "$fadeIn 0.5s ease-in-out", // Fade-in animation
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
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
    color: "#4D9FEC", // Light Blue
    fontWeight: "bold",
    animation: "$slideIn 0.5s ease-in-out", // Slide-in animation
  },
  "@keyframes slideIn": {
    "0%": {
      opacity: 0,
      transform: "translateX(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  toggleButton: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
    gap: "1rem", // Space between buttons
  },
  button: {
    padding: "0.6rem 1.2rem",
    border: "none",
    backgroundColor: "#4D9FEC", // Light Blue
    color: "white",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1.5rem",
    transition: "background-color .3s, transform 0.2s ease, border .3s",
    "&:hover": {
      backgroundColor: "#3B8ECB", // Darker shade of primary color
      transform: "scale(1.05)",
    },
    "&.active": {
      backgroundColor: "#8ACBFF", // Darker shade for active tab
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1.5rem",
    animation: "$fadeIn 0.5s ease-in-out", // Fade-in animation
  },
  th: {
    border: "1px solid #F0F0F0", // Light Gray
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "1.5rem",
    backgroundColor: "#4D9FEC", // Light Blue
    color: "white",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #F0F0F0", // Light Gray
    padding: "0.8rem",
    textAlign: "center",
    fontSize: "1.5rem",
    backgroundColor: "#FFFFFF", // White
    color: "#333333", // Dark Gray
    transition: "background-color 0.3s ease",
  },
  tr: {
    "&:hover": {
      backgroundColor: "#E8F4FF", // Light shade of primary color on hover
    },
  },
  statusCell: {
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  statusPaid: {
    color: "#5cb85c", // Green
    backgroundColor: "#E1F3E5", // Light green background
  },
  statusUnpaid: {
    color: "#f0ad4e", // Yellow
    backgroundColor: "#FFF9E1", // Light yellow background
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
    "& .MuiPaginationItem-root": {
      backgroundColor: "#4D9FEC", // Light Blue
      color: "#fff",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      "&:hover": {
        backgroundColor: "#3B8ECB", // Darker shade of primary color on hover
      },
      "&.Mui-selected": {
        backgroundColor: "#8ACBFF", // Slightly different primary shade for selected
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
  starRating: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "1.5rem",
  },
  commentInput: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  submitButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4D9FEC",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#3B8ECB",
    },
  },
}));

const ManageBookings = () => {
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const [appointments, setAppointments] = useState([]);
  const [currentTab, setCurrentTab] = useState("Paid");
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  // Fetch invoices, invoice-details, and appointments from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invoices
        const invoicesResponse = await axios.get(
          "https://vaccine-system1.azurewebsites.net/api/Invoice/get-invoices"
        );
        const sortedInvoices = invoicesResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Fetch invoice-details
        const invoiceDetailsResponse = await axios.get(
          "https://vaccine-system1.azurewebsites.net/api/InvoiceDetail/get-invoice-details"
        );
        const sortedInvoiceDetails = invoiceDetailsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          "https://vaccine-system1.azurewebsites.net/Appointment/get-appointments"
        );
        const sortedAppointments = appointmentsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Combine data from invoices, invoice-details and appointments.
        // First try to match using invoiceDetails; if not found, then try by customerId.
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
            // Fallback: match by customerId (if available)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invoices
        const invoicesResponse = await axios.get(
          "https://vaccine-system1.azurewebsites.net/api/Invoice/get-invoices"
        );
        const sortedInvoices = invoicesResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoices(sortedInvoices);

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          "https://vaccine-system1.azurewebsites.net/Appointment/get-appointments"
        );
        const sortedAppointments = appointmentsResponse.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAppointments(sortedAppointments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter invoices based on current tab
  const getCurrentData = () => {
    if (currentTab === "Paid") {
      return invoices.filter((invoice) => invoice.status === "Paid");
    } else if (currentTab === "Unpaid") {
      return invoices.filter((invoice) => invoice.status === "Unpaid");
    } else if (currentTab === "Rated") {
      return appointments.filter(
        (appointment) => appointment.status === "Success"
      );
    } else {
      return [];
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentData = getCurrentData().slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const handleRatingChange = (appointmentId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [appointmentId]: rating,
    }));
  };

  const handleCommentChange = (appointmentId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [appointmentId]: comment,
    }));
  };

  const handleSubmitFeedback = async (appointmentId) => {
    const rating = ratings[appointmentId];
    const comment = comments[appointmentId];

    if (!rating || !comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await axios.post(
        "https://vaccine-system1.azurewebsites.net/api/FeedBack/create-feedback",
        {
          CustomerId: appointments.find(
            (appointment) => appointment.appointmentId === appointmentId
          ).customerId,
          DoctorId: 1, // Replace with actual doctor ID
          StaffId: 1, // Replace with actual staff ID
          VaccineId: 1, // Replace with actual vaccine ID
          AppointmentId: appointmentId,
          Rating: rating,
          Comment: comment,
        }
      );

      if (response.status === 200) {
        toast.success("Feedback submitted successfully!");
        // Update the status of the appointment to "Rated"
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appointmentId === appointmentId
              ? { ...appointment, status: "Rated" }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTabChange = (status) => {
    setCurrentTab(status);
    setCurrentPage(1);
  };

  const StarRating = ({ rating, onChange }) => {
    return (
      <div className={classes.starRating}>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <span
              key={index}
              style={{
                cursor: "pointer",
                color: index <= rating ? "gold" : "gray",
              }}
              onClick={() => onChange(index)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
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
        <button
          className={`${classes.button} ${
            currentTab === "Rated" ? "active" : ""
          }`}
          onClick={() => handleTabChange("Rated")}
        >
          Rated
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
                  {currentTab === "Rated" ? (
                    <>
                      <th className={classes.th}>Customer ID</th>
                      <th className={classes.th}>Status</th>
                      <th className={classes.th}>Appointment ID</th>
                      <th className={classes.th}>Appointment Date</th>
                      <th className={classes.th}>Rating</th>
                      <th className={classes.th}>Comment</th>
                      <th className={classes.th}>Submit</th>
                    </>
                  ) : (
                    <>
                      <th className={classes.th}>Invoice ID</th>
                      <th className={classes.th}>Customer ID</th>
                      <th className={classes.th}>Total Amount</th>
                      <th className={classes.th}>Status</th>
                      <th className={classes.th}>Type</th>
                      <th className={classes.th}>Created At</th>
                      <th className={classes.th}>Appointment ID</th>
                      <th className={classes.th}>Appointment Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={item.invoiceId || item.appointmentId}
                      className={classes.tr}
                    >
                      <td className={classes.td}>
                        {indexOfFirstBooking + index + 1}
                      </td>
                      {currentTab === "Rated" ? (
                        <>
                          <td className={classes.td}>{item.customerId}</td>
                          <td className={classes.td}>{item.status}</td>
                          <td className={classes.td}>{item.appointmentId}</td>
                          <td className={classes.td}>
                            {moment(item.appointmentDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </td>
                          <td className={classes.td}>
                            <StarRating
                              rating={ratings[item.appointmentId] || 0}
                              onChange={(rating) =>
                                handleRatingChange(item.appointmentId, rating)
                              }
                            />
                          </td>
                          <td className={classes.td}>
                            <input
                              type="text"
                              value={comments[item.appointmentId] || ""}
                              onChange={(e) =>
                                handleCommentChange(
                                  item.appointmentId,
                                  e.target.value
                                )
                              }
                              className={classes.commentInput}
                            />
                          </td>
                          <td className={classes.td}>
                            <button
                              onClick={() =>
                                handleSubmitFeedback(item.appointmentId)
                              }
                              className={classes.submitButton}
                            >
                              Submit
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={classes.td}>{item.invoiceId}</td>
                          <td className={classes.td}>{item.customerId}</td>
                          <td className={classes.td}>{item.totalAmount}</td>
                          <td
                            className={`${classes.statusCell} ${
                              item.status === "Paid"
                                ? classes.statusPaid
                                : classes.statusUnpaid
                            }`}
                          >
                            {item.status}
                          </td>
                          <td className={classes.td}>{item.type}</td>
                          <td className={classes.td}>
                            {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                          </td>
                          <td className={classes.td}>{item.appointmentId}</td>
                          <td className={classes.td}>
                            {item.appointmentDate &&
                            item.appointmentDate !== "N/A" &&
                            moment(
                              item.appointmentDate,
                              moment.ISO_8601,
                              true
                            ).isValid()
                              ? moment(item.appointmentDate).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "N/A"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={currentTab === "Rated" ? 8 : 9}
                      className={classes.noData}
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {getCurrentData().length > bookingsPerPage && (
              <Pagination
                count={Math.ceil(getCurrentData().length / bookingsPerPage)}
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
