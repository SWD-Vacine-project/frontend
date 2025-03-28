import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Typography, Paper, CircularProgress, Button } from "@mui/material";
import axios from "axios";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#cdd8fb",
  },
  paper: {
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  success: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  failed: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#d32f2f",
  },
  details: {
    textAlign: "left",
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
  },
  button: {
    marginTop: "24px",
    padding: "12px 24px",
    borderRadius: "12px",
    backgroundColor: "#3f51b5",
    color: "#ffffff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#cdd8fb",
    },
  },
}));

interface PaymentDetails {
  method: string;
  amount: string;
  invoiceId: string;
  responseCode?: string;
  bankCode?: string;
  bankTranNo?: string;
  cardType?: string;
  orderInfo?: string;
  payDate?: string;
  txnRef?: string;
}

const PaymentResult: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentMethod = queryParams.get("method") || "cash";
    let details: PaymentDetails;
    if (paymentMethod === "vnpay") {
      details = {
        method: "VNPay",
        amount: queryParams.get("vnp_Amount") ? `${queryParams.get("vnp_Amount")} VND` : "N/A",
        bankCode: queryParams.get("vnp_BankCode") || "N/A",
        bankTranNo: queryParams.get("vnp_BankTranNo") || "N/A",
        cardType: queryParams.get("vnp_CardType") || "N/A",
        orderInfo: queryParams.get("vnp_OrderInfo") || "N/A",
        payDate: queryParams.get("vnp_PayDate") || "N/A",
        responseCode: queryParams.get("vnp_ResponseCode") || "99",
        txnRef: queryParams.get("vnp_TxnRef") || "N/A",
        invoiceId: queryParams.get("invoiceId") || "N/A",
      };
      setIsSuccess(details.responseCode === "00");
    } else {
      details = {
        method: "Cash",
        amount: queryParams.get("amount") ? `${queryParams.get("amount")} VND` : "N/A",
        invoiceId: queryParams.get("invoiceId") || "N/A",
        responseCode: "00",
      };
      setIsSuccess(true);
    }
    setPaymentDetails(details);
    setLoading(false);
  }, [location]);

  // Gọi API cập nhật trạng thái hóa đơn sau khi thanh toán thành công
  useEffect(() => {
    const updateInvoiceStatus = async () => {
      if (paymentDetails && isSuccess && paymentDetails.invoiceId && !statusUpdated) {
        try {
          await axios.put(
            `https://vaccine-system2.azurewebsites.net/api/Invoice/update-invoice-status-to-paid/${paymentDetails.invoiceId}`
          );
          setStatusUpdated(true);
        } catch (error) {
          console.error("Error updating invoice status:", error);
        }
      }
    };
    updateInvoiceStatus();
  }, [paymentDetails, isSuccess, statusUpdated]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {loading ? (
          <div>
            <CircularProgress />
            <Typography variant="h6" style={{ marginTop: "12px" }}>
              Processing payment...
            </Typography>
          </div>
        ) : paymentDetails ? (
          <>
            <Typography variant="h3" className={isSuccess ? classes.success : classes.failed}>
              {isSuccess ? "🎉 Payment Successful! 🎉" : "❌ Payment Failed ❌"}
            </Typography>
            <Typography variant="body1" className={classes.details}>
              <strong>Invoice ID:</strong> {paymentDetails.invoiceId}
            </Typography>
            <Typography variant="body1" className={classes.details}>
              <strong>Payment Method:</strong> {paymentDetails.method}
            </Typography>
            <Typography variant="body1" className={classes.details}>
              <strong>Amount:</strong> {paymentDetails.amount}
            </Typography>
            {paymentDetails.txnRef && (
              <Typography variant="body1" className={classes.details}>
                <strong>Transaction Reference:</strong> {paymentDetails.txnRef}
              </Typography>
            )}
            <Button className={classes.button} onClick={() => navigate("/manage-booking")}>
              Go to Manage Booking
            </Button>
          </>
        ) : (
          <Typography variant="h6" className={classes.failed}>
            No payment details available.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default PaymentResult;
