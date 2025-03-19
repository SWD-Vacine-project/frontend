import React, { useState, useContext } from "react";
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
  InputLabel,
} from "@mui/material";
import { BookingContext } from "../../components/context/BookingContext"; // Giả sử bạn có context để lấy thông tin
import { useLocation } from "react-router-dom";

// Tạo styles với makeStyles
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

interface Service {
  vaccineId: number;
  appointmentId: number;
  comboId: number | null; // comboId có thể là null nếu không phải combo
  quantity: number;
  price: number;
}

const PaymentForm: React.FC = () => {
  const classes = useStyles();
  const { selectedServices, selectedDateTime } = useContext(BookingContext); // Lấy thông tin từ context
  const [paymentMethod, setPaymentMethod] = useState<string>("cash"); // Mặc định là tiền mặt
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const location = useLocation();

  const { appointmentId } = location.state || { appointmentId: "" };

  const API_BASE_URL =
    "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net";

  // Tính toán TotalAmount từ selectedServices
  const totalAmount = "130304";

  // Lấy thông tin CustomerId từ context hoặc localStorage
  const customerId = 10; // Thay bằng giá trị thực tế

  // Xác định Type dựa trên logic của bạn
  const type = selectedServices.length < 1 ? "Combo" : "Single";

  // Tạo CreatedAt và UpdatedAt
  const createdAt = new Date(
    new Date().getTime() + 7 * 60 * 60 * 1000
  ).toISOString();
  const updatedAt = new Date(
    new Date().getTime() + 7 * 60 * 60 * 1000
  ).toISOString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Tạo invoice với trạng thái phù hợp
      const invoiceStatus = paymentMethod === "cash" ? "Unpaid" : "Pending";

      // Tạo danh sách InvoiceDetails từ selectedServices
      const invoiceDetails = selectedServices.map((service: Service) => ({
        VaccineId: service.vaccineId, // Giả sử mỗi service có vaccineId
        AppointmentId: service.appointmentId, // Giả sử mỗi service có appointmentId
        ComboId: service.comboId, // Giả sử mỗi service có comboId
        Quantity: service.quantity, // Giả sử mỗi service có quantity
        Price: service.price, // Giả sử mỗi service có price
      }));

      const invoiceResponse = await axios.post(
        `${API_BASE_URL}/api/Invoice/create-invoice1`,
        {
          CustomerId: customerId,
          TotalAmount: totalAmount,
          Status: invoiceStatus,
          Type: type,
          CreatedAt: createdAt,
          UpdatedAt: updatedAt,
          InvoiceDetails: invoiceDetails,
          AppointmentId: appointmentId,
        }
      );

      if (invoiceResponse.status === 200) {
        const createdInvoice = invoiceResponse.data;
        const invoiceId = createdInvoice.invoiceId; // Lấy invoiceId từ phản hồi

        if (paymentMethod === "vnpay") {
          // Nếu chọn VNPay, tạo URL thanh toán
          const paymentResponse = await axios.get(
            `${API_BASE_URL}/VnPay/CreatePaymentUrl`,
            {
              params: {
                moneyToPay: totalAmount,
                description: `Payment for invoice ${invoiceId}`,
                invoiceId,
              },
            }
          );
          if (paymentResponse.status === 201) {
            setPaymentUrl(paymentResponse.data);
            window.location.href = paymentResponse.data; // Chuyển hướng đến URL thanh toán
          }
        } else {
          // Nếu chọn tiền mặt, hiển thị thông báo thành công
          alert(
            `Invoice created successfully. Invoice ID: ${invoiceId}. Payment method: Cash.`
          );
          const redirectUrl = `http://localhost:3000/book/payment-result?method=cash&amount=${totalAmount}&invoiceId=${invoiceId}`;
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
      alert("Failed to create payment URL. Please try again.");
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
            <h1 style={{ fontSize: "14px", textAlign: "center" }}>
              Payment Method
            </h1>
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
