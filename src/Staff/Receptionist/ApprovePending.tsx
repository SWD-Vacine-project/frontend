import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Pagination,
  Modal,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiUser } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  approvePage: {
    maxWidth: "1200px",
    margin: "40px auto",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "20px",
  },
  glassNavbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    borderRadius: "10px",
    marginBottom: "30px",
    color: "#fff",
  },
  navLeft: {
    display: "flex",
    gap: "15px",
  },
  navButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background 0.3s",
    "&:hover": {
      background: "rgba(255,255,255,0.3)",
    },
  },
  avatarContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4a3aff",
    fontWeight: "bold",
    cursor: "pointer",
    position: "relative",
  },
  userMenu: {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "#fff",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "220px",
    zIndex: 100,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: "#f0f0f0",
    },
  },
  header: {
    textAlign: "center",
    color: "#4a3aff",
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: 600,
  },
  refreshButton: {
    backgroundColor: "#4a3aff",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 auto 20px auto",
    transition: "background 0.3s",
    "&:hover": {
      backgroundColor: "#3b8ccb",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "#fff",
    padding: "12px 8px",
    border: "1px solid #e0e0e0",
    fontSize: "1rem",
    textAlign: "center",
  },
  td: {
    padding: "12px 8px",
    border: "1px solid #e0e0e0",
    fontSize: "0.95rem",
    textAlign: "center",
    color: "#333",
  },
  tr: {
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#f2f8ff",
    },
  },
  approveButton: {
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background 0.3s",
    "&:hover": {
      background: "#3b8ccb",
    },
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    "& .MuiPaginationItem-root": {
      backgroundColor: "#4a3aff",
      color: "#fff",
      transition: "background-color 0.3s, transform 0.2s",
      "&:hover": {
        backgroundColor: "#3b8ccb",
      },
      "&.Mui-selected": {
        backgroundColor: "#8ACBFF",
        color: "#fff",
      },
    },
  },
  noData: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#777",
    padding: "20px 0",
  },
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    padding: "20px",
    outline: "none",
  },
  modalHeader: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#4a3aff",
    textAlign: "center",
  },
});

interface Invoice {
  invoiceId: number;
  customerId: number;
  totalAmount: number;
  status: string;
  type: string;
  createdAt: string;
  invoiceDetails: Array<{
    appointmentId: number;
    appointmentDate: string;
    vaccineId: number | null;
    comboId: number;
    quantity: number;
    price: number;
  }>;
}

interface User {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

interface Batch {
  batchNumber: number;
  vaccineName: string;
  description: string;
  price: number;
  quantity: number;
  preOrderQuantity: number;
  expiryDate: string;
}

const ApprovePendingPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invoicesPerPage] = useState<number>(7);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State cho combo
  const [selectedComboInvoice, setSelectedComboInvoice] = useState<Invoice | null>(null);
  // Lưu kết quả batch cho mỗi appointment: key: appointmentId, value: Batch hoặc null
  const [selectedBatches, setSelectedBatches] = useState<{ [key: number]: Batch | null }>({});
  const [openComboModal, setOpenComboModal] = useState(false);

  // State cho modal chọn batch cho từng appointment
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<number | null>(null);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);

  // Lấy user từ sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/signIn");
      return;
    }
    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      sessionStorage.removeItem("user");
      navigate("/signIn");
    }
  }, [navigate]);

  // Lấy danh sách pending invoices
  useEffect(() => {
    fetchPendingInvoices();
  }, []);

  const fetchPendingInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://vaccine-system1.azurewebsites.net/api/Invoice/pending-invoices"
      );
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      toast.error("Failed to load pending invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Khi nhấn nút "Get Batch" trên invoice combo
  const handleApprove = (invoice: Invoice) => {
    if (invoice.type.toLowerCase() === "combo") {
      // Reset selectedBatches cho invoice mới
      setSelectedBatches({});
      setSelectedComboInvoice(invoice);
      setOpenComboModal(true);
    } else {
      toast.info("Loại Single - tạm thời chỉ get batch combo!");
    }
  };

  // Hàm gọi API lấy danh sách batch cho từng appointment và mở modal chọn batch
  const handleGetBatchForAppointment = async (appointmentId: number) => {
    if (!selectedComboInvoice) return;
    const detail = selectedComboInvoice.invoiceDetails.find(
      (d) => d.appointmentId === appointmentId
    );
    if (!detail) return;

    if (!detail.vaccineId) {
      toast.error("Không có thông tin vaccine cho appointment được chọn.");
      return;
    }

    const formattedDate = moment(detail.appointmentDate).format("YYYY-MM-DDTHH:mm:ss");
    const url = `https://vaccine-system1.azurewebsites.net/VaccineBatch/get-batch-by-vaccineID/${detail.vaccineId}/${formattedDate}`;

    try {
      const response = await axios.get(url);
      const batchData: Batch[] = response.data;
      if (batchData.length === 0) {
        toast.error("Không có batch phù hợp cho appointment này.");
        setSelectedBatches((prev) => ({ ...prev, [appointmentId]: null }));
      } else {
        setCurrentAppointmentId(appointmentId);
        setAvailableBatches(batchData);
        setOpenBatchModal(true);
      }
    } catch (error) {
      console.error("Error fetching batch:", error);
      toast.error("Failed to fetch batch data. Please try again.");
      setSelectedBatches((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Hàm xử lý khi chọn batch từ modal batch
  const handleSelectBatch = (batch: Batch) => {
    if (currentAppointmentId === null) return;
    setSelectedBatches((prev) => ({ ...prev, [currentAppointmentId]: batch }));
    setOpenBatchModal(false);
    setCurrentAppointmentId(null);
  };

  // Hàm xử lý khi nhấn Confirm Selections: gọi API cập nhật invoice và approve từng appointment
  const handleConfirmSelections = async () => {
    if (!selectedComboInvoice) return;
    // Kiểm tra tất cả các appointment đã có batch hay chưa
    const allValid = selectedComboInvoice.invoiceDetails.every(
      (detail) => selectedBatches[detail.appointmentId]
    );
    if (!allValid) {
      toast.error("Một số appointment chưa có batch được chọn.");
      return;
    }
    try {
      // Cập nhật trạng thái invoice thành unpaid
      await axios.put(
        `https://vaccine-system1.azurewebsites.net/api/Invoice/update-invoice-status-unpaid/${selectedComboInvoice.invoiceId}`
      );
      // Cập nhật trạng thái từng appointment thành approved
      await Promise.all(
        selectedComboInvoice.invoiceDetails.map((detail) => {
          const batch = selectedBatches[detail.appointmentId];
          if (!batch)
            return Promise.reject(`No batch for appointment ${detail.appointmentId}`);
          return axios.put(
            `https://vaccine-system1.azurewebsites.net/Appointment/Approved-status-appointment/${detail.appointmentId}/${batch.batchNumber}`
          );
        })
      );
      toast.success("Appointments confirmed successfully!");
      setInvoices((prev) =>
        prev.filter((inv) => inv.invoiceId !== selectedComboInvoice.invoiceId)
      );
      // Reset state
      setSelectedComboInvoice(null);
      setSelectedBatches({});
      setOpenComboModal(false);
    } catch (error) {
      console.error("Error confirming appointments:", error);
      toast.error("Failed to confirm appointments.");
    }
  };

  // Hàm xử lý khi nhấn Cancel Appointments: gọi API cập nhật trạng thái từng appointment thành rejected và invoice thành canceled
  const handleCancelAppointments = async () => {
    if (!selectedComboInvoice) return;
    try {
      // Cập nhật trạng thái từng appointment thành rejected
      await Promise.all(
        selectedComboInvoice.invoiceDetails.map((detail) => {
          return axios.put(
            `https://vaccine-system1.azurewebsites.net/Appointment/update-status-appointment-rejected/${detail.appointmentId}`
          );
        })
      );
      // Cập nhật trạng thái invoice thành canceled
      await axios.put(
        `https://vaccine-system1.azurewebsites.net/api/Invoice/update-invoice-status-canceled/${selectedComboInvoice.invoiceId}`
      );
      toast.success("Appointments canceled successfully!");
      setInvoices((prev) =>
        prev.filter((inv) => inv.invoiceId !== selectedComboInvoice.invoiceId)
      );
      // Reset state
      setSelectedComboInvoice(null);
      setSelectedBatches({});
      setOpenComboModal(false);
    } catch (error) {
      console.error("Error canceling appointments:", error);
      toast.error("Failed to cancel appointments.");
    }
  };

  // Phân trang
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const handlePageChange = (event: any, value: number) => {
    setCurrentPage(value);
  };

  // Navbar
  const GlassNavbar = () => (
    <motion.nav className={classes.glassNavbar} initial={{ y: -50 }} animate={{ y: 0 }}>
      <div className={classes.navLeft}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={classes.navButton}
          onClick={() => navigate("/checkIn")}
        >
          🔖 Check-in
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={classes.navButton}
          onClick={() => navigate("/accept-appointments")}
        >
          ✅ Approve Appointments
        </motion.button>
      </div>
      <div>
        <motion.div
          className={classes.avatarContainer}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={32} />}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={classes.userMenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={classes.menuItem} onClick={() => navigate("/profile")}>
                  <FiUser size={18} />
                  <span>Profile</span>
                </div>
                <div
                  className={classes.menuItem}
                  onClick={() => {
                    sessionStorage.removeItem("user");
                    navigate("/signIn");
                  }}
                >
                  <FaSignOutAlt size={18} />
                  <span>Logout</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );

  return (
    <div className={classes.approvePage}>
      <GlassNavbar />
      <h2 className={classes.header}>Pending Invoices</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={classes.refreshButton}
        onClick={fetchPendingInvoices}
        disabled={loading}
      >
        <FiRefreshCw
          size={20}
          style={{
            transform: loading ? "rotate(360deg)" : "none",
            transition: "transform 0.6s linear",
          }}
        />
        {loading ? "Refreshing..." : "Refresh List"}
      </motion.button>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading pending invoices...</p>
      ) : (
        <>
          {currentInvoices.length > 0 ? (
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
                  <th className={classes.th}>Invoice Details</th>
                  <th className={classes.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((invoice, index) => {
                  const details =
                    invoice.invoiceDetails && invoice.invoiceDetails.length > 0
                      ? invoice.invoiceDetails
                          .map((detail) =>
                            `ID: ${detail.appointmentId} (${moment(detail.appointmentDate).format(
                              "DD/MM/YYYY HH:mm"
                            )})`
                          )
                          .join(" | ")
                      : "N/A";
                  return (
                    <tr key={invoice.invoiceId} className={classes.tr}>
                      <td className={classes.td}>{indexOfFirstInvoice + index + 1}</td>
                      <td className={classes.td}>{invoice.invoiceId}</td>
                      <td className={classes.td}>{invoice.customerId}</td>
                      <td className={classes.td}>${invoice.totalAmount}</td>
                      <td className={classes.td}>{invoice.status}</td>
                      <td className={classes.td}>{invoice.type}</td>
                      <td className={classes.td}>
                        {moment(invoice.createdAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className={classes.td}>{details}</td>
                      <td className={classes.td}>
                        <button
                          className={classes.approveButton}
                          onClick={() => handleApprove(invoice)}
                        >
                          Get Batch
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className={classes.noData}>No pending invoices available.</p>
          )}
          {invoices.length > invoicesPerPage && (
            <Pagination
              count={Math.ceil(invoices.length / invoicesPerPage)}
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

      {/* Modal chọn appointment của combo với 2 nút: Confirm Selections và Cancel Appointments */}
      <Modal
        open={openComboModal}
        onClose={() => {
          setOpenComboModal(false);
          setSelectedComboInvoice(null);
        }}
        aria-labelledby="combo-modal-title"
      >
        <Box className={classes.modalBox}>
          <Typography variant="h6" align="center" className={classes.modalHeader}>
            Select Appointment
          </Typography>
          {selectedComboInvoice &&
            selectedComboInvoice.invoiceDetails.map((detail) => (
              <div
                key={detail.appointmentId}
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "5px",
                }}
              >
                <p>
                  <strong>Appointment:</strong> {detail.appointmentId} -{" "}
                  {moment(detail.appointmentDate).format("DD/MM/YYYY HH:mm")}
                </p>
                <Button
                  variant="contained"
                  style={{ marginRight: "10px", backgroundColor: "#4a3aff", color: "#fff" }}
                  onClick={() => handleGetBatchForAppointment(detail.appointmentId)}
                >
                  Get Batch
                </Button>
                {selectedBatches[detail.appointmentId] ? (
                  <p style={{ display: "inline-block", marginLeft: "10px" }}>
                    Selected Batch: {selectedBatches[detail.appointmentId]?.batchNumber} -{" "}
                    {selectedBatches[detail.appointmentId]?.vaccineName}
                  </p>
                ) : (
                  <p style={{ display: "inline-block", marginLeft: "10px", color: "red" }}>
                    No batch selected
                  </p>
                )}
              </div>
            ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#4a3aff", color: "#fff" }}
              onClick={handleConfirmSelections}
            >
              Confirm Selections
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelAppointments}
              style={{ color: "red", borderColor: "red" }}
            >
              Cancel Appointments
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Modal chọn Batch cho từng appointment với giao diện cải tiến */}
      <Modal
        open={openBatchModal}
        onClose={() => {
          setOpenBatchModal(false);
          setCurrentAppointmentId(null);
        }}
        aria-labelledby="batch-modal-title"
      >
        <Box className={classes.modalBox} style={{ padding: "30px" }}>
          <Typography variant="h5" align="center" style={{ color: "#4a3aff", marginBottom: "20px" }}>
            Select Batch
          </Typography>
          <List>
            {availableBatches.map((batch) => (
              <ListItem key={batch.batchNumber} disablePadding>
                <ListItemButton onClick={() => handleSelectBatch(batch)}>
                  <ListItemText
                    primary={`Batch: ${batch.batchNumber} - ${batch.vaccineName}`}
                    secondary={`Qty: ${batch.quantity} | Exp: ${moment(batch.expiryDate).format("DD/MM/YYYY")}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenBatchModal(false);
              setCurrentAppointmentId(null);
            }}
            style={{ marginTop: "20px", color: "red", borderColor: "red", width: "100%" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default ApprovePendingPage;
