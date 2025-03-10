import { Routes, Route } from "react-router-dom";
import SelectDateTime from "./SelectDateTime";
import BookingConfirm from "./BookingConfirm";
import PaymentForm from "./PaymentForm";
import PaymentResult from "./PaymentResult";

const Book = () => {
  return (
    <Routes>
      <Route path="/select-datetime" element={<SelectDateTime />} />
      <Route path="/booking-confirm" element={<BookingConfirm />} />
      <Route path="/payment-form" element={<PaymentForm />} />
      <Route path="/payment-result" element={<PaymentResult />} />
    </Routes>
  );
};

export default Book;
