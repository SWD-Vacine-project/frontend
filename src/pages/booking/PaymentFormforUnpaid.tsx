import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
  },
  paper: {
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    width: "100%",
  },
  button: {
    marginTop: "16px",
    backgroundColor: "#1976d2",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#115293",
    },
  },
  link: {
    marginTop: "16px",
    color: "#1976d2",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    pointerEvents: "none",
  },
}));

const PaymentForm: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin invoice được truyền từ ManageBookings
  const { invoice } = location.state || {};

  // Nếu không có invoice thì chuyển hướng về ManageBookings
  useEffect(() => {
    if (!invoice) {
      navigate("/manage-booking");
    }
  }, [invoice, navigate]);

  // Chỉ hỗ trợ thanh toán bằng VNPay nên không cần state cho paymentMethod

  // Lấy các dữ liệu cần thiết từ invoice
  const { invoiceId, customerId, totalAmount, type, appointmentIds, createdAt } = invoice;
  const formattedCreatedAt = moment(createdAt).format("DD/MM/YYYY HH:mm");

  // Tạo thời gian cập nhật (UTC+7)
  const updatedAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString();

  // State lưu URL thanh toán (nếu cần hiển thị cho người dùng)
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Gọi API lấy URL thanh toán của VNPay
      const paymentResponse = await axios.get(
        `https://vaccine-system2.azurewebsites.net/VnPay/CreatePaymentUrl`,
        {
          params: {
            moneyToPay: totalAmount,
            description: `Payment for invoice ${invoiceId}`,
            invoiceId,
            returnUrl: `http://localhost:3000/payment-result`,
          },
        }
      );
      if (paymentResponse.status === 201) {
        setPaymentUrl(paymentResponse.data);
        window.location.href = paymentResponse.data;
      }
    } catch (error) {
      console.error("Error processing VNPay payment:", error);
      alert("Thanh toán thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Payment for Invoice {invoiceId}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            label="Customer ID"
            value={customerId}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Total Amount (VND)"
            value={totalAmount}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Type"
            value={type}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Appointment IDs"
            value={
              appointmentIds && appointmentIds.length > 0
                ? appointmentIds.join(", ")
                : "N/A"
            }
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Created At"
            value={formattedCreatedAt}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Updated At"
            value={updatedAt}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <Button type="submit" variant="contained" className={classes.button}>
            Pay Now with VNPay
          </Button>
        </form>
        {paymentUrl && (
          <Typography variant="body1" className={classes.link}>
            Payment URL: <Link href={paymentUrl}>{paymentUrl}</Link>
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default PaymentForm;
