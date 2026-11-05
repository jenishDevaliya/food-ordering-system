import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const userId = localStorage.getItem("userId");
  const [paymentMode, setPaymentMode] = useState('');
  const [address, setAddress] = useState('');
  const [cartDetails, setCartDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const navigate = useNavigate();


  const handlePlaceOrder = async () => {
    
    if (paymentMode === "online") {
      const { cardNumber, expiryDate, cvv } = cartDetails;
      
      if (!cardNumber || !expiryDate || !cvv) {
        toast.error("Please fill all card details");
        return;
       }
      }
      
    try {
      const res = await fetch("http://127.0.0.1:8000/api/place_order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          address: address,
          paymentMode: paymentMode,
          cardNumber: paymentMode === "online" ? cartDetails.cardNumber : '',
          expiryDate: paymentMode === "online" ? cartDetails.expiryDate : '',
          cvv: paymentMode === "online" ? cartDetails.cvv : '',


        })
      });

      const result = await res.json();

      if (res.status === 201) {
        toast.success(result.message);
        setTimeout(() => 
          navigate('/my-orders'), 2000);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-credit-card me-2"></i> Checkout & Payment
        </h3>

        <div className="card p-4 shadow">
          {/* Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Delivery Address</label>
            <textarea
              className="form-control border-primary-subtle"
              rows="3"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          {/* Payment Methods */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="cod"
              checked={paymentMode === "cod"}
              onChange={() => setPaymentMode("cod")}
            />
            <label className="form-check-label">Cash on Delivery</label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="online"
              checked={paymentMode === "online"}
              onChange={() => setPaymentMode("online")}
            />
            <label className="form-check-label">Online Payment</label>
          </div>

          {/* Card Details */}
          {paymentMode === "online" && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Card Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="1234 **** **** ****"
                  value={cartDetails.cardNumber}
                  onChange={(e) =>
                    setCartDetails({ ...cartDetails, cardNumber: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="MM/YY"
                  value={cartDetails.expiryDate}
                  onChange={(e) =>
                    setCartDetails({ ...cartDetails, expiryDate: e.target.value })
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">CVV</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="***"
                  value={cartDetails.cvv}
                  onChange={(e) =>
                    setCartDetails({ ...cartDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <button
            className="btn btn-success mt-4 w-100"
            onClick={handlePlaceOrder}
          >
            <i className="fas fa-check-circle me-2"></i> Confirm & Place Order
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PaymentPage;
