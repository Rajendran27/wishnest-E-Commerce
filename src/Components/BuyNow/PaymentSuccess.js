// PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const last = JSON.parse(localStorage.getItem("lastOrder") || "null");
    setOrder(last);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background: "#f7f9fb",
      }}
    >
      <Box
        sx={{
          width: "760px",
          maxWidth: "96%",
          background: "#fff",
          borderRadius: 14,
          p: 6,
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(25, 118, 210, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#e6f4ff 0%, #ffffff 100%)",
            mb: 3,
            mx: "auto",
            boxShadow: "0 6px 18px rgba(25, 118, 210, 0.08)",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#1976d2" }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Payment Successful
        </Typography>
        <Typography variant="body1" sx={{ color: "#374151", mb: 2 }}>
          Thank you — your payment was processed successfully.
        </Typography>

        {order ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₹{order.summary?.totalAmount ?? order.amount ?? 0}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Payment Method: {(order.method || "N/A").toString().toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Time: {order.time ? new Date(order.time).toLocaleString() : "N/A"}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
            Order details not found.
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 12, justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 30,
              px: 5,
              background: "linear-gradient(45deg,#1976d2 30%, #42a5f5 90%)",
              color: "#fff",
            }}
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/OrderDetails")}
            sx={{ borderRadius: 30, px: 4 }}
          >
            View Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
