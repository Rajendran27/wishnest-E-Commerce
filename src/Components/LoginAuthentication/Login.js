import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./Auth/Firebase"; // ✅ correct import
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // ✅ Store all details for later use
      localStorage.setItem("role", userData.role);
      localStorage.setItem("name", userData.name);
      localStorage.setItem("email", userData.email);

      // Redirect based on role
      if (userData.role === "Admin") navigate("/");
      else if (userData.role === "Manager") navigate("/manager-dashboard");
      else navigate("/");
    } else {
      alert("User data not found in Firestore!");
    }
  } catch (error) {
    console.error(error);
    alert("Invalid credentials");
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
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />

          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.2, backgroundColor: "#1e293b" }}>
            Login
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/forget-password" underline="hover">
            Forgot Password?
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link href="/register" underline="hover" sx={{ fontWeight: 600 }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
