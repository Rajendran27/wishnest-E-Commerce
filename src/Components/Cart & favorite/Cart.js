import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Cart.css";
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const navigate = useNavigate();


  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(80);
  const [shipping, setShipping] = useState(40);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const handleDelete = (id) => {
    const filtered = cart.filter((item) => item.id !== id);
    updateCart(filtered);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalAmount = subtotal - discount - couponDiscount + shipping;

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "save50") {
      setCouponDiscount(50);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code");
    }
  };

  return (
    <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <h2 className="heading">Your Cart</h2>

      {cart.length === 0 ? (
         <>
  <div className="empty-cart">
    <ShoppingCartTwoToneIcon className="empty-cart-icon" />
    <p className="empty-cart-text">Your cart is empty</p>
  </div>
</>
      ) : (
        <div style={{ display: "flex", gap: "25px" }}>
          {/* LEFT SIDE — SCROLLABLE PRODUCTS */}
          <div
            className="grid-container"
            style={{
              flex: 2,
              maxHeight: "calc(100vh - 150px)",
              overflowY: "scroll",
              paddingRight: "10px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .grid-container::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {cart.map((product) => (
              <div className="card" key={product.id}>
                <div className="img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="display-img"
                  />
                </div>

                <div className="card-body">
                  <p className="name">{product.name}</p>
                  <p className="price">₹ {product.price * product.quantity}</p>

                  <div className="quantity-box">
                    <button onClick={() => decreaseQty(product.id)}>-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => increaseQty(product.id)}>+</button>
                  </div>

                  <button
  className="buy-btn-cart"
  onClick={() => navigate("/BuyNow", { state: { products: [product] } })}
>
  Buy Now
</button>

                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                  title="Remove from Cart"
                >
                  <DeleteIcon sx={{ fontSize: 22 }} />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE — COMPACT CART SUMMARY */}
          <div
            style={{
              flex: "0 0 280px",
              border: "2px solid #000",
              borderRadius: "20px",
              padding: "20px",
              background: "white",
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              height: "fit-content",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 15, fontSize: "1.2rem" }}>
              Cart Summary
            </h3>

            <div style={{ lineHeight: "1.8rem", fontSize: "0.95rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Products</span>
                <span>{cart.length}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Price</span>
                <span>₹ {subtotal}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Discount</span>
                <span style={{ color: "green" }}>-₹ {discount}</span>
              </div>

              {couponApplied && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "green",
                  }}
                >
                  <span>Coupon</span>
                  <span>-₹ {couponDiscount}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Shipping</span>
                <span>₹ {shipping}</span>
              </div>

              {/* Coupon Input */}
              <div style={{ marginTop: 10 }}>
                <span>Coupon</span>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "5px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "5px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                    }}
                    disabled={couponApplied}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    style={{
                      padding: "5px 10px",
                      background: couponApplied ? "#999" : "#000",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    {couponApplied ? "✓" : "Apply"}
                  </button>
                </div>
              </div>

              <hr style={{ margin: "15px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>Total</span>
                <span>₹ {totalAmount}</span>
              </div>

              <button
                style={{
                  width: "100%",
                  marginTop: 15,
                  padding: "8px 0",
                  border: "2px solid black",
                  background: "white",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
                 onClick={() => navigate("/BuyNow", { state: { products: cart } })}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
