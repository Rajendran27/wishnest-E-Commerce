import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const AddProducts = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [productNo, setProductNo] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        callback(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };


  // --- Image preview ---
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file); // create local URL
    setImage(imageUrl);
    setPreview(imageUrl);
  } else {
    setImage(null);
    setPreview(null);
  }
};



  // --- Validation ---
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const numberRegex = /^[0-9]+$/;

    if (!productNo.trim()) newErrors.productNo = "Product No. is required";
    if (!name.trim()) newErrors.name = "Product name is required";
    else if (!nameRegex.test(name))
      newErrors.name = "Name should contain only letters";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (!numberRegex.test(price))
      newErrors.price = "Price should contain only numbers";
    if (!category) newErrors.category = "Category is required";
    if (!image) newErrors.image = "Image is required";

    return newErrors;
  };

  // --- Submit ---
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setErrors({});

  const newProduct = {
    id: productNo,
    name: name,
    price: price,
    category: category,
    image: image, // save base64 or URL image
  };

  try {
    if (category === "Mobile") {
      // Mobile → JSON server on port 3003
      await axios.post("http://localhost:3003/Mobile", newProduct);
      alert("Mobile product added successfully!");
    } 
    else if (category === "Electronics & Appliances") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3004/Electronics", newProduct);
      alert("Electronics product added successfully!");
    } 
     else if (category === "Fashion") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3005/Fashion", newProduct);
      alert(" product added successfully!");
    } 
    else if (category === "Beauty") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3006/Beauty", newProduct);
      alert(" product added successfully!");
    } 
    else if (category === "Kitchen") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3007/Kitchen", newProduct);
      alert(" product added successfully!");
    } 
    else if (category === "Sports") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3008/Sports", newProduct);
      alert(" product added successfully!");
    } 
    else if (category === "Furniture") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3009/Furniture", newProduct);
      alert(" product added successfully!");
    } 
    else if (category === "Toys") {
      // Electronics → JSON server on port 3004
      await axios.post("http://localhost:3010/Toys", newProduct);
      alert(" product added successfully!");
    } 
    else {
      // Other categories → same port (3003)
      await axios.post(`http://localhost:3003/${category.toLowerCase()}`, newProduct);
      alert(`${category} product added successfully!`);
      navigate(`/${category.toLowerCase()}`);
    }
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please check console for details.");
  }
  setName("")
  setProductNo("")
  setCategory("")
  setPrice("")
  setImage(null);
  setPreview(null);
};


  return (
    <Box className="page-container">
      <Box className="form-wrapper">
        {/* Left Section */}
        <Box className="form-section">
          <h2>Add Product Details</h2>

          <TextField
            label="Product No."
            variant="outlined"
            fullWidth
            value={productNo}
            onChange={(e) => setProductNo(e.target.value)}
            className="input-field"
            error={!!errors.productNo}
            helperText={errors.productNo}
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
                error={!!errors.category}
                helperText={errors.category}
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
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
            error={!!errors.price}
            helperText={errors.price}
          />

          <Box className="file-upload">
            <label htmlFor="product-image">Upload Image</label>
            <input
              type="file"
              id="product-image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.image && (
              <div style={{ color: "red", marginTop: "4px" }}>{errors.image}</div>
            )}
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
            onClick={handleSubmit}
            className="submit-btn"
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProducts;
