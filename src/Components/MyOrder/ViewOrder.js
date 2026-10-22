import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Logo from '../Assets/Logo.png'
import "./OrderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const last = JSON.parse(localStorage.getItem("lastOrder") || "null");
    setOrder(last);
  }, []);

  if (!order) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6">No order found.</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const { id, time, address, cart = [], summary = {}, method } = order;
  const displayTotal = summary?.totalAmount ?? order.amount ?? 0;

  return (
    <Box className="orderPage">
      <Paper className="orderContainer" elevation={4}>
        {/* Header */}
        <Box className="orderHeader">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            className="backBtn"
          >
            Back
          </Button>
          <Typography variant="h6" className="orderTitle">
            Order Details
          </Typography>
          <Typography variant="subtitle1" className="orderId">
            {id}
          </Typography>
        </Box>

        {/* Address + Date */}
        <Box className="topSection">
          <Card className="addressBox">
            <CardContent>
              <Typography className="sectionTitle">Delivery Address</Typography>
              {address ? (
                <>
                  <Typography>{address.fullName}</Typography>
                  <Typography>{address.house}, {address.street}</Typography>
                  <Typography>{address.city}, {address.state} - {address.pincode}</Typography>
                  <Typography>{address.country}</Typography>
                  <Typography>📞 {address.mobile}</Typography>
                  {address.email && <Typography>✉️ {address.email}</Typography>}
                </>
              ) : (
                <Typography>No address provided.</Typography>
              )}
            </CardContent>
          </Card>

          <Card className="dateBox">
            <CardContent>
              <Typography className="sectionTitle">Date & Time</Typography>
              <Typography>{time ? new Date(time).toLocaleString() : "N/A"}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Payment: {method?.toUpperCase() ?? "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Product Details */}
        <Card className="productBox">
          <CardContent>
            <Typography className="sectionTitle">Product Details</Typography>
            {cart && cart.length > 0 ? (
              cart.map((p, idx) => (
                <Grid container key={idx} spacing={2} sx={{ py: 1, alignItems: "center" }}>
                  <Grid item xs={2}>
                    <img src={p.image} alt={p.name} className="productImage" />
                  </Grid>
                  <Grid item xs={7}>
                    <Typography sx={{ fontWeight: 700 }}>{p.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {p.description || ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} textAlign="right">
                    <Typography>Qty: {p.quantity}</Typography>
                    <Typography>₹ {Number(p.price) * Number(p.quantity)}</Typography>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography>No products found.</Typography>
            )}
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <Box className="bottomSection">
          <Box className="thankyouCircle">
            {/* <Typography sx={{ fontWeight: 800 }}>Thank You</Typography>
            <Typography>Shop Again</Typography> */}

            <img src={Logo} alt="Logo" className="logoImage" />
            
          </Box>

          <Card className="summaryBox">
            <CardContent>
              <Typography className="sectionTitle">Payment & Order Summary</Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>₹ {summary?.subtotal ?? 0}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Discount</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>- ₹ {summary?.discount ?? 0}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Coupon Discount</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>- ₹ {summary?.couponDiscount ?? 0}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Shipping</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography>₹ {summary?.shipping ?? 0}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 800 }}>Total</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography sx={{ fontWeight: 800 }}>₹ {displayTotal}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetails;
