// PaymentSection.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./PaymentSection.css";

const PaymentSection = ({ onBack }) => {
  const navigate = useNavigate();

  // payment selection & inputs
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("");

  // summary breakdown (explicit fields)
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // address
  const [savedAddress, setSavedAddress] = useState("");

  // dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPayload, setDialogPayload] = useState({ method: "", meta: null });

  useEffect(() => {
    // Load cart either from localStorage "cart" (array of items) or use empty
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Ensure numeric price * quantity; guard against missing values
    const calcSubtotal = cart.reduce((acc, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      return acc + price * qty;
    }, 0);

    // Load couponData (may be missing)
    const couponData = JSON.parse(localStorage.getItem("couponData") || "{}");

    // Use numeric defaults. If you want to force defaults (80,40) use || 80 etc.
    // But parse to Number to avoid string problems.
    const disc = Number(couponData.discount ?? 80); // try couponData.discount, else fallback to 80
    const ship = Number(couponData.shipping ?? 40);
    const cpn = Number(couponData.couponDiscount ?? 0);

    // Save address: prefer deliveryAddress then first of userAddresses
    const deliveryAddress = localStorage.getItem("deliveryAddress");
    if (deliveryAddress) {
      setSavedAddress(deliveryAddress);
    } else {
      const addresses = JSON.parse(localStorage.getItem("userAddresses") || "[]");
      if (addresses.length > 0) {
        const a = addresses[0];
        setSavedAddress(
          `${a.fullName}\n${a.house}\n${a.street}\n${a.city}, ${a.state} - ${a.pincode}\n${a.country}\n📞 ${a.mobile}`
        );
      } else {
        setSavedAddress("");
      }
    }

    // Correct formula (same as your OrderSummary): subtotal - discount - couponDiscount + shipping
    const total = calcSubtotal - disc - cpn + ship;

    // Set states
    setSubtotal(calcSubtotal);
    setDiscount(disc);
    setShipping(ship);
    setCouponDiscount(cpn);
    setTotalAmount(total);

    // Debug logs — open browser console to inspect
    console.group("PaymentSection Debug");
    console.log("cart", cart);
    console.log("calcSubtotal", calcSubtotal);
    console.log("couponData (raw)", couponData);
    console.log("discount (number)", disc);
    console.log("shipping (number)", ship);
    console.log("couponDiscount (number)", cpn);
    console.log("calculated totalAmount", total);
    console.groupEnd();
  }, []);

  // helpers & flows
  const maskCard = (num = "") => {
    const digits = (num || "").replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return "**** **** **** " + digits.slice(-4);
  };

  const sendUpiRequest = () => {
    if (!upiId.trim()) return alert("Please enter UPI ID.");
    alert("Request sent to your UPI app. Please approve the request there.");
    setDialogPayload({ method: "upi", meta: { upiId } });
    setDialogOpen(true);
  };

  const sendCardRequest = () => {
    const digits = (card.number || "").replace(/\s+/g, "");
    if (!digits || !card.cvv || !card.expiry) return alert("Please enter full card details.");
    if (digits.length < 12) return alert("Please enter a valid card number.");
    alert("Card request sent. Proceed to confirm payment.");
    setDialogPayload({ method: "card", meta: { mask: maskCard(digits) } });
    setDialogOpen(true);
  };

  const sendNetbankingRequest = () => {
    if (!bank) return alert("Please select a bank.");
    alert(`Request sent to ${bank}. Redirecting to bank page...`);
    setDialogPayload({ method: "netbanking", meta: { bank } });
    setDialogOpen(true);
  };

  const confirmCOD = () => {
    if (!savedAddress) return alert("No saved address found. Please add an address first.");
    setDialogPayload({ method: "cod", meta: { address: savedAddress } });
    setDialogOpen(true);
  };

  // inside PaymentSection.jsx (replace the function finalizePayment)
const finalizePayment = () => {
  // read cart & addresses
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const addressList = JSON.parse(localStorage.getItem("userAddresses") || "[]");
  const deliveryAddressRaw = localStorage.getItem("deliveryAddress");
  const selectedAddress = deliveryAddressRaw
    ? JSON.parse(deliveryAddressRaw)
    : addressList[0] || null;

  // compute subtotal (guard types)
  const subtotal = cart.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 1), 0);

  // read couponData (from your app; keep behaviour consistent with OrderSummary)
  const couponData = JSON.parse(localStorage.getItem("couponData") || "{}");
  // these should be numbers; fallback to previous defaults
  const discount = Number(couponData.discount ?? 80);      // same default you used earlier
  const shipping = Number(couponData.shipping ?? 40);
  const couponDiscount = Number(couponData.couponDiscount ?? 0);

  // final total (same formula used in OrderSummary/PaymentSection)
  const totalAmount = subtotal - discount - couponDiscount + shipping;

  const fullOrder = {
    id: `ORD-${Date.now()}`,
    method: dialogPayload.method,
    amount: Number(totalAmount),
    meta: dialogPayload.meta || null,
    time: new Date().toISOString(),
    cart,
    address: selectedAddress,
    summary: {
      subtotal,
      discount,
      couponDiscount,
      shipping,
      totalAmount,
    },
  };

  // save lastOrder and append to allOrders
  localStorage.setItem("lastOrder", JSON.stringify(fullOrder));
  const allOrders = JSON.parse(localStorage.getItem("allOrders") || "[]");
  allOrders.push(fullOrder);
  localStorage.setItem("allOrders", JSON.stringify(allOrders));

  // optionally clear cart
  localStorage.removeItem("cart");

  setDialogOpen(false);
  navigate("/payment-success");
};




  return (
    <Box className="payment-container" sx={{ display: "flex", gap: 3, p: 2 }}>
      <Box sx={{ flex: 2, background: "#fff", p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <IconButton onClick={() => (onBack ? onBack() : navigate(-1))}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Payment Methods
          </Typography>
        </Box>

        <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          {/* UPI */}
          <Box sx={{ mb: 1, p: 1, borderRadius: 1, ...(selectedMethod === "upi" ? { boxShadow: "0 6px 14px rgba(25,118,210,0.04)", background: "#f6fbff" } : {}) }}>
            <FormControlLabel value="upi" control={<Radio />} label="UPI (Google Pay, PhonePe, Paytm)" />
            {selectedMethod === "upi" && (
              <Box sx={{ ml: 4, mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField label="Enter UPI ID" size="small" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => setUpiId("")}>Clear</Button>
                  <Button variant="contained" onClick={sendUpiRequest}>Send UPI Request</Button>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Card */}
          <Box sx={{ mb: 1, p: 1, borderRadius: 1, ...(selectedMethod === "card" ? { boxShadow: "0 6px 14px rgba(25,118,210,0.04)", background: "#f6fbff" } : {}) }}>
            <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
            {selectedMethod === "card" && (
              <Box sx={{ ml: 4, mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField label="Card Number" size="small" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField label="Expiry (MM/YY)" size="small" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} sx={{ flex: 1 }} />
                  <TextField label="CVV" size="small" type="password" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} sx={{ width: 130 }} />
                </Box>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => setCard({ number: "", expiry: "", cvv: "" })}>Clear</Button>
                  <Button variant="contained" onClick={sendCardRequest}>Send Request</Button>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Netbanking */}
          <Box sx={{ mb: 1, p: 1, borderRadius: 1, ...(selectedMethod === "netbanking" ? { boxShadow: "0 6px 14px rgba(25,118,210,0.04)", background: "#f6fbff" } : {}) }}>
            <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
            {selectedMethod === "netbanking" && (
              <Box sx={{ ml: 4, mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField select label="Select Bank" size="small" value={bank} onChange={(e) => setBank(e.target.value)}>
                  <MenuItem value="SBI">State Bank of India</MenuItem>
                  <MenuItem value="HDFC">HDFC Bank</MenuItem>
                  <MenuItem value="ICICI">ICICI Bank</MenuItem>
                  <MenuItem value="AXIS">Axis Bank</MenuItem>
                </TextField>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => setBank("")}>Clear</Button>
                  <Button variant="contained" onClick={sendNetbankingRequest}>Send Request</Button>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* COD */}
          <Box sx={{ mb: 1, p: 1, borderRadius: 1, ...(selectedMethod === "cod" ? { boxShadow: "0 6px 14px rgba(25,118,210,0.04)", background: "#f6fbff" } : {}) }}>
            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
            {selectedMethod === "cod" && (
              <Box sx={{ ml: 4, mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField label="Saved Delivery Address" size="small" value={savedAddress} multiline rows={3} InputProps={{ readOnly: true }} />
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => navigate("/Address")}>Edit Address</Button>
                  <Button variant="contained" onClick={confirmCOD}>Confirm & Place Order (COD)</Button>
                </Box>
              </Box>
            )}
          </Box>
        </RadioGroup>
      </Box>

      {/* RIGHT - SUMMARY */}
      <Box sx={{ width: 360, background: "#fff", p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Order Summary</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <span>Discount</span>
          <span>-₹ {discount}</span>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <span>Coupon Discount</span>
          <span>-₹ {couponDiscount}</span>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <span>Shipping</span>
          <span>₹ {shipping}</span>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 800, mt: 1 }}>
          <span>Total Amount</span>
          <span>₹ {totalAmount}</span>
        </Box>

        {/* Debug: show raw values (remove in production) */}
        <Box sx={{ mt: 2, p: 1, background: "#f3f6fb", borderRadius: 1 }}>
          <Typography variant="caption" color="textSecondary">Debug values (open console to inspect)</Typography>
          <Typography variant="caption" display="block">subtotal: {subtotal}</Typography>
          <Typography variant="caption" display="block">discount: {discount}</Typography>
          <Typography variant="caption" display="block">couponDiscount: {couponDiscount}</Typography>
          <Typography variant="caption" display="block">shipping: {shipping}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={() => (onBack ? onBack() : navigate(-1))} sx={{ flex: 1 }}>← Back</Button>
          <Button variant="contained" onClick={() => {
            // trigger send flow for selected method
            if (selectedMethod === "upi") sendUpiRequest();
            else if (selectedMethod === "card") sendCardRequest();
            else if (selectedMethod === "netbanking") sendNetbankingRequest();
            else if (selectedMethod === "cod") confirmCOD();
          }} sx={{ flex: 1 }}>
            Pay Now
          </Button>
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogPayload.method === "cod" ? "Confirm COD Order" : "Confirm Payment"}</DialogTitle>
        <DialogContent>
          {dialogPayload.method === "upi" && (
            <>
              <Typography>A request was sent to UPI ID <strong>{dialogPayload.meta?.upiId}</strong>.</Typography>
              <Typography sx={{ mt: 1 }}>Pay ₹{totalAmount} via your UPI app to complete the order.</Typography>
            </>
          )}
          {dialogPayload.method === "card" && (
            <>
              <Typography>Pay ₹{totalAmount} using card <strong>{dialogPayload.meta?.mask}</strong>.</Typography>
            </>
          )}
          {dialogPayload.method === "netbanking" && (
            <>
              <Typography>Pay ₹{totalAmount} via <strong>{dialogPayload.meta?.bank}</strong>. You will be redirected to the bank page.</Typography>
            </>
          )}
          {dialogPayload.method === "cod" && (
            <>
              <Typography>Deliver to:</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>{dialogPayload.meta?.address}</Typography>
              <Typography sx={{ mt: 1 }}>Pay ₹{totalAmount} in cash on delivery.</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={finalizePayment}>{dialogPayload.method === "cod" ? "Confirm Order" : "Pay Now"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentSection;
