import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  LocationOn,
  Apartment,
  Public,
  Markunread,
  Pin,
} from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./Address.css";
import { useNavigate } from "react-router-dom";

const AddressForm = ({ onNext }) => {

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load saved addresses
  useEffect(() => {
    const saved = localStorage.getItem("userAddresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.mobile || !formData.street) return;

    let updatedAddresses;
    if (isEditing) {
      updatedAddresses = [...addresses];
      updatedAddresses[editIndex] = formData;
    } else {
      updatedAddresses = [...addresses, formData];
    }

    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    setFormData({
      fullName: "",
      mobile: "",
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      email: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setShowForm(true);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    if (updated.length === 0) setShowForm(true);
  };

  const handleAddAddress = () => {
    setFormData({
      fullName: "",
      mobile: "",
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      email: "",
    });
    setShowForm(true);
    setIsEditing(false);
  };

  return (
    <Box className="address-page">
      {/* --- Address Form --- */}
      {showForm ? (
        <Box className="address-form">
          <Typography variant="h5" className="form-title">
            {isEditing ? "Edit Address" : "Add Your Address"} <PlaceIcon />
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={11}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                sx={{ width: "30rem" }}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                InputProps={{ startAdornment: <Person className="icon" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Mobile Number"
                variant="outlined"
                sx={{ width: "18rem" }}
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                InputProps={{ startAdornment: <Phone className="icon" /> }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="House / Building Name"
                variant="outlined"
                name="house"
                value={formData.house}
                onChange={handleChange}
                InputProps={{ startAdornment: <Home className="icon" /> }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                multiline
                sx={{ width: "32rem" }}
                label="Street / Area / Locality"
                variant="outlined"
                name="street"
                value={formData.street}
                onChange={handleChange}
                InputProps={{ startAdornment: <LocationOn className="icon" /> }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                name="city"
                value={formData.city}
                onChange={handleChange}
                InputProps={{ startAdornment: <Apartment className="icon" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="State"
                variant="outlined"
                name="state"
                value={formData.state}
                onChange={handleChange}
                InputProps={{ startAdornment: <Public className="icon" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Pincode"
                variant="outlined"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                InputProps={{ startAdornment: <Pin className="icon" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                name="country"
                value={formData.country}
                onChange={handleChange}
                InputProps={{ startAdornment: <Public className="icon" /> }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email (optional)"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{ startAdornment: <Markunread className="icon" /> }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box className="button-wrapper">
                <Button
                  variant="contained"
                  className="save-button"
                  sx={{ marginTop: "-30px" }}
                  onClick={handleSaveAddress}
                >
                  Save Address
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        /* --- Saved Addresses Page --- */
        <Box className="address-form saved-address-section">
          <Typography variant="h5" className="form-title">
            Saved Addresses     <Box mt={1} ml={3} textAlign="center">
           <Button
  variant="contained"
  size="large"
  sx={{
    borderRadius: "50%",
    minWidth: "56px",
    width: "56px",
    height: "56px",
    boxShadow: "0 3px 8px rgba(25, 118, 210, 0.4)",
    p: 0,
  }}
  onClick={handleAddAddress}
>
  <AddLocationAltOutlinedIcon />
</Button>

          </Box>
          </Typography>

          <Grid container spacing={3}>
            {addresses.map((addr, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  className="saved-address-card"
                  sx={{
                    p: 3,
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
  variant="h6"
  sx={{
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  {addr.fullName}

  <Box sx={{ display: "flex", gap: "8px" }}>
    <IconButton
      color="primary"
      onClick={() => handleEdit(index)}
      sx={{
        backgroundColor: "#E3F2FD",
        boxShadow: "0 3px 6px rgba(33, 150, 243, 0.3)",
        "&:hover": {
          backgroundColor: "#BBDEFB",
        },
        width: 36,
        height: 36,
      }}
    >
      <EditIcon />
    </IconButton>

    <IconButton
      color="error"
      onClick={() => handleDelete(index)}
      sx={{
        backgroundColor: "#FFEBEE",
        boxShadow: "0 3px 6px rgba(244, 67, 54, 0.3)",
        "&:hover": {
          backgroundColor: "#FFCDD2",
        },
        width: 36,
        height: 36,
      }}
    >
      <DeleteIcon />
    </IconButton>
  </Box>
</Typography>

                    <Divider sx={{ my: 1.5 }} />
                    <Typography>{addr.house}</Typography>
                    <Typography>{addr.street}</Typography>
                    <Typography>
                      {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>📞 {addr.mobile}</Typography>
                    {addr.email && <Typography>✉️ {addr.email}</Typography>}

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          

          <Box mt={4} textAlign="center" display="flex" justifyContent="center" gap={3}>

             <Button
  variant="contained"
  onClick={() => navigate('/Cart')}
  size="large"
  startIcon={<ArrowBackIcon />}
  sx={{
    borderRadius: "30px",
    px: 5,
    py: 1.4,
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.5px",
    fontSize: "1rem",
    background: "linear-gradient(45deg, #4f6983ff 30%, #4e6679ff 90%)",
    boxShadow: "0 4px 10px rgba(25, 118, 210, 0.4)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(45deg, #4f6983ff 30%, #4e6679ff 90%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 14px rgba(25, 118, 210, 0.5)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  }}
>
  Back
</Button>

            <Button
  variant="contained"
  onClick={onNext}
  size="large"
  endIcon={<ArrowForwardIcon />}
  sx={{
    borderRadius: "30px",
    px: 5,
    py: 1.4,
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.5px",
    fontSize: "1rem",
    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
    boxShadow: "0 4px 10px rgba(25, 118, 210, 0.4)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(45deg, #1565c0 30%, #2196f3 90%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 14px rgba(25, 118, 210, 0.5)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  }}
>
  Next
</Button>

          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AddressForm;
