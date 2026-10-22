import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import "./AddProducts.css";

const categories = [
  "Fashion",
  "Electronics & Appliances",
  "Mobile",
  "Beauty",
  "Home & Kitchen",
  "Sports & Games",
  "Furniture",
  "Toys",
];

const Update = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryFromState = location.state?.category;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);

  // --- Fetch existing product details ---
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const baseUrl =
        categoryFromState === "Electronics"
          ? "http://localhost:3004/Electronics"
          : "http://localhost:3005/Fashion";

      const res = await axios.get(`${baseUrl}/${id}`);
      setName(res.data.name || "");
      setPrice(res.data.price || "");
      setCategory(res.data.category || "");
      setImage(res.data.image || "");
      setPreview(res.data.image || "");
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };
  // --- Convert image to Base64 before saving ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // --- Update product ---
  const handleUpdate = async (e) => {
  e.preventDefault();

  const updateData = { id, name, price, category, image };

  const baseUrl =
    categoryFromState === "Electronics"
      ? "http://localhost:3004/Electronics"
      : "http://localhost:3005/Fashion";

  try {
    await axios.put(`${baseUrl}/${id}`, updateData);
    alert("Product updated successfully!");
    navigate(`/${categoryFromState}`);
  } catch (error) {
    console.log("Error updating product:", error);
    alert("Failed to update product.");
  }
};


  return (
    <Box className="page-container">
      <Box className="form-wrapper">
        {/* Left Section */}
        <Box className="form-section">
          <h2>Update Product Details</h2>

          <TextField
            label="Product ID"
            variant="outlined"
            fullWidth
            value={id}
            InputProps={{ readOnly: true }}
            className="input-field"
          />

          <Autocomplete
            freeSolo
            options={categories}
            value={category}
            onChange={(event, newValue) => setCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product Category"
                variant="outlined"
                fullWidth
              />
            )}
            className="input-field"
          />

          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />

          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
          />

          <Box className="file-upload">
            <label htmlFor="product-image">Upload Image</label>
            <input
              type="file"
              id="product-image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box className="preview-section">
          {preview ? (
            <img src={preview} alt="Product Preview" className="preview-img" />
          ) : (
            <p className="placeholder-text">Image preview will appear here</p>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            className="edit-btn"
          >
            Update Product
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Update;
