import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  MenuItem,
} from "@mui/material";
import { auth, db } from "./Auth/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AdminSellerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // store user info + role (Admin/Seller)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      alert(`${formData.role} registration successful!`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #ffffff, #1e293b)",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Admin / Seller Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField
            select
            fullWidth
            label="Select Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Seller">Seller</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.2, backgroundColor: "#1e293b" }}>
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" underline="hover" sx={{ fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminSellerRegister;
