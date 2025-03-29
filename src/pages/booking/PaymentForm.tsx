import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles<any>(() => ({
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

  // Lấy dữ liệu từ state (BookingConfirm phải truyền appointmentId, không phải appointmentIds)
  const {
    appointmentDate,
    appointmentIds, // Nếu Combo
    appointmentId,  // Nếu Single
    totalAmount,
    customerId,
    type,
    cartItems
  } = location.state || {};

  // Mặc định chọn tiền mặt
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const API_BASE_URL =
    "https://vaccine-system2.azurewebsites.net/";

  // Nếu không truyền totalAmount thì fallback là "0"
  const finalTotalAmount = totalAmount || "0";

  // Tạo thời gian theo giờ Việt Nam (UTC+7)
  const createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString();
  const updatedAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Xác định invoiceStatus dựa vào paymentMethod (nếu server cần)
      const invoiceStatus = paymentMethod === "cash" ? "Unpaid" : "Pending";

      // 1. Tạo Invoice
      const invoiceResponse = await axios.post(`${API_BASE_URL}/api/Invoice/create-invoice`, {
        customerId: customerId,
        totalAmount: finalTotalAmount,
        type: type,
        createdAt: createdAt,
        updatedAt: updatedAt,
        // Nếu server yêu cầu status, thêm: status: invoiceStatus,
      });

      if (invoiceResponse.status === 200) {
        const createdInvoice = invoiceResponse.data;
        const invoiceId = createdInvoice.invoiceId;
        console.log("Created invoiceId:", invoiceId);

        // 2. Tạo InvoiceDetail (liên kết invoiceId với appointmentId)
       // Sau khi tạo Invoice thành công (và có invoiceId):
if (cartItems && cartItems.length > 0) {
  for (const item of cartItems) {
    // Nếu đây là vaccine đơn
    if ("vaccineId" in item.vaccine && item.vaccine.vaccineId) {
      // Sử dụng appointmentId duy nhất (được truyền từ BookingConfirm)
      if (appointmentId) {
        await axios.post(`${API_BASE_URL}/api/InvoiceDetail/create-invoice-detail`, {
          invoiceId: invoiceId,
          appointmentId: appointmentId,  // appointmentId duy nhất cho vaccine đơn
          vaccineId: item.vaccine.vaccineId,
          comboId: null,  // hoặc để 0/null nếu không áp dụng
          quantity: item.selectedChildren.length, // số lượng trẻ (hoặc số lượng đặt lịch)
          price: item.vaccine.price,
        });
      }
    } 
    // Nếu đây là combo vaccine
    else if ("comboId" in item.vaccine && item.vaccine.comboId) {
      // Nếu có mảng appointmentIds được truyền (cho combo)
      if (appointmentIds && appointmentIds.length > 0) {
        // Lặp qua từng appointmentId và tạo InvoiceDetail cho mỗi cái
        for (const appId of appointmentIds) {
          await axios.post(`${API_BASE_URL}/api/InvoiceDetail/create-invoice-detail`, {
            invoiceId: invoiceId,
            appointmentId: appId,
            vaccineId: null,  // hoặc 0/null nếu không áp dụng
            comboId: item.vaccine.comboId,
            quantity: item.selectedChildren.length,
            price: item.vaccine.price,
          });
        }
      }
    }
  }
}


        // 3. Xử lý thanh toán
        if (paymentMethod === "vnpay") {
          const paymentResponse = await axios.get(`https://vaccine-system2.azurewebsites.net/VnPay/CreatePaymentUrl`, {
            params: {
              moneyToPay: finalTotalAmount,
              description: `Payment for invoice ${invoiceId}`,
              invoiceId,
              returnUrl: `http://localhost:3000/book/payment-result`,
            },
          });
          console.log("VNPay response:", paymentResponse.data);

          if (paymentResponse.status === 201) {
            setPaymentUrl(paymentResponse.data);
            window.location.href = paymentResponse.data;
          }
        } else {
          alert(`Invoice created successfully. ID: ${invoiceId}, Payment method: Cash.`);
          const redirectUrl = `http://localhost:3000/book/payment-result?method=cash&amount=${finalTotalAmount}&invoiceId=${invoiceId}`;
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error("Error creating invoice or invoice detail:", error);
      alert("Failed to create invoice. Please check console for details.");
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Create Payment
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            label="Customer ID"
            value={customerId || ""}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Total Amount (VND)"
            value={finalTotalAmount}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Type"
            value={type || ""}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          {/* Hiển thị Appointment ID duy nhất */}
          <TextField
  label="Appointment ID"
  value={
    appointmentIds && appointmentIds.length > 0
      ? appointmentIds.join(", ")
      : appointmentId ? appointmentId.toString() : "N/A"
  }
  className={`${classes.input} ${classes.disabledInput}`}
  disabled
/>
          <TextField
            label="Appointment Date"
            value={
              appointmentDate
                ? moment(appointmentDate).format("DD/MM/YYYY HH:mm")
                : "N/A"
            }
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Created At"
            value={createdAt}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <TextField
            label="Updated At"
            value={updatedAt}
            className={`${classes.input} ${classes.disabledInput}`}
            disabled
          />
          <FormControl>
            <Typography style={{ fontSize: "14px", textAlign: "center" }}>
              Payment Method
            </Typography>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as string)}
              required
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="vnpay">VNPay</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" className={classes.button}>
            Pay Now
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
