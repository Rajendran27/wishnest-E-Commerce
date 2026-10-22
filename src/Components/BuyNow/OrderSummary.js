import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./OrderSummary.css";

const OrderSummary = ({ products, onNext, onBack }) => {
  const [cartSummary, setCartSummary] = useState({
    discount: 80,
    shipping: 40,
    couponDiscount: 0,
    couponApplied: false,
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedCoupon = JSON.parse(localStorage.getItem("couponData")) || {};
    setCartSummary((prev) => ({ ...prev, ...storedCoupon }));
  }, []);

  useEffect(() => {
    const subtotal = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const { discount, shipping, couponDiscount } = cartSummary;
    setTotalAmount(subtotal - discount - couponDiscount + shipping);
  }, [products, cartSummary]);

  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🟩 This function handles "Proceed to Payment"
  const handleProceedToPayment = () => {
    const order = {
      id: "ORD" + Date.now(),
      time: new Date().toISOString(),
      address: JSON.parse(localStorage.getItem("selectedAddress") || "null"), // optional if you have address stored
      cart: products,
      summary: {
        subtotal,
        discount: cartSummary.discount,
        couponDiscount: cartSummary.couponDiscount,
        shipping: cartSummary.shipping,
        totalAmount,
      },
      method: "cod", // or dynamic payment method
    };

    // ✅ Save current order
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // ✅ Save all orders (append)
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    allOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(allOrders));

    // ✅ Continue to next step (payment page)
    if (onNext) onNext();
  };

  return (
    <div className="order-summary-container">
      {/* LEFT — PRODUCT LIST */}
      <div className="order-products">
        <h2 className="order-title">Order Summary</h2>

        {products.length === 0 ? (
          <p className="empty-text">No products to show</p>
        ) : (
          products.map((item) => (
            <div className="order-item" key={item.id}>
              <div className="order-item-left">
                <img src={item.image} alt={item.name} className="order-img" />
                <div>
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-qty">Qty: {item.quantity}</p>
                  <p className="order-item-price">
                    ₹ {item.price * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT — SUMMARY BOX */}
      {products.length > 0 && (
        <div className="summary-box">
          <h3 className="summary-title">Payment Summary</h3>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="discount">-₹ {cartSummary.discount}</span>
            </div>
            {cartSummary.couponApplied && (
              <div className="summary-row coupon-row">
                <span>Coupon</span>
                <span>-₹ {cartSummary.couponDiscount}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹ {cartSummary.shipping}</span>
            </div>

            <hr className="divider" />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹ {totalAmount}</span>
            </div>
          </div>

          <div className="button-group">
            <Button variant="outlined" onClick={onBack} className="back-btn">
              ← Back to Cart
            </Button>

            {/* 🟢 Modified this button */}
            <Button
              variant="contained"
              onClick={handleProceedToPayment}
              className="next-btn"
            >
              Proceed to Payment →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
