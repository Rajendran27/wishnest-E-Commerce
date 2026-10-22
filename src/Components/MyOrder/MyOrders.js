import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Button } from "@mui/material";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

    if (orders.length === 0) {
    return (
      <Box className="noOrdersContainer">
        <LocalMallIcon className="noOrdersIcon" />
        <Typography variant="h6" className="noOrdersText">
          No orders found.
        </Typography>
        <Button
          variant="contained"
          className="backHomeBtn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    );
  }


  const handleOrderClick = (order) => {
    localStorage.setItem("lastOrder", JSON.stringify(order)); // store selected order
    navigate("/OrderDetails"); // go to details page
  };

  return (
    <Box className="myOrdersPage" p={3} >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              className="orderCard"
              onClick={() => handleOrderClick(order)}
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                transition: "all 0.2s",
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Order ID: {order.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Date: {new Date(order.time).toLocaleString()}
                </Typography>

                {/* Show first product thumbnail */}
                {order.cart?.[0] && (
                  <img
                    src={order.cart[0].image}
                    alt={order.cart[0].name}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                )}

                <Typography sx={{ fontWeight: 700 }}>
                  ₹ {order.summary?.totalAmount ?? order.amount ?? 0}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {order.cart?.length} item(s)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyOrders;
