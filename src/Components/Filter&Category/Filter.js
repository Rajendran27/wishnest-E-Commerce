import React, { useEffect, useState } from "react";
import {
  Box,
  Fab,
  Button,
  Grow,
  Paper,
  Stack,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import WcIcon from "@mui/icons-material/Wc";
import ManIcon from "@mui/icons-material/Man";
import Face3Icon from "@mui/icons-material/Face3";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { useLocation } from "react-router-dom";

const Filter = ({ role, onGenderSelect, onSortSelect, onFilterChange }) => {
  const location = useLocation();
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // --- Filter state variables ---
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");

  // --- Run whenever filter changes ---
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        price: selectedPrice,
        brand: selectedBrand,
        size: selectedSize,
        colour: selectedColour,
      });
    }
  }, [selectedPrice, selectedBrand, selectedSize, selectedColour]);

  // --- Gender, Filter, Sort Options ---
  const genderOptions = [
    { label: "Men", color: "#A7C7E7", icon: <ManIcon /> },
    { label: "Women", color: "#F8BBD0", icon: <Face3Icon /> },
    { label: "Kids", color: "#C8E6C9", icon: <ChildCareIcon /> },
  ];

  const sortOptions = [
    "Price : High to Low",
    "Price : Low to High",
    "Customer Rating",
    "New Arrivals",
    "Popularity",
  ];

  // --- Fashion Filters ---
  const fashionFilters = {
    priceOptions: ["Below 1000", "1000 - 3000", "Above 3000"],
    brandOptions: ["Nike", "Adidas", "Puma", "Zara", "Levis"],
    sizeOptions: ["S", "M", "L", "XL"],
    colourOptions: ["Black", "White", "Red", "Blue", "Green","Yellow","Purple"],
  };

  // --- Mobile Filters ---
  const mobileFilters = {
    priceOptions: ["Below ₹10,000", "₹10,000 - ₹30,000", "Above ₹30,000"],
    brandOptions: ["Apple", "Samsung", "Xiaomi", "OnePlus", "Vivo", "Oppo"],
    sizeOptions: ["4GB/64GB", "6GB/128GB", "8GB/256GB", "12GB/512GB"],
    colourOptions: ["Black", "White", "Blue", "Gray", "Silver"],
  };

  // --- Determine which set to use ---
  const isFashionPage = location.pathname === "/Fashion";
  const isMobilePage = location.pathname === "/Mobile";
  const activeFilters = isFashionPage ? fashionFilters : mobileFilters;

  // --- Handle Toggles ---
  const handleGenderClick = () => {
    setShowGenderFilter((prev) => !prev);
    setShowFilterOptions(false);
    setAnchorEl(null);
  };

  const handleFilterClick = () => {
    setShowFilterOptions((prev) => !prev);
    setShowGenderFilter(false);
    setAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setShowGenderFilter(false);
    setShowFilterOptions(false);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    if (option && onSortSelect) onSortSelect(option);
  };

  const handleGenderFilter = (label) => {
    if (onGenderSelect) onGenderSelect(label);
    setShowGenderFilter(false);
  };

  // --- Hide for certain routes ---
  if (["/", "/cart", "/Favorite", "/BuyNow","/OrderDetails", "/payment-success", "/MyOrders", "/MyProfile"].includes(location.pathname) || location.pathname.startsWith("/product/"))
    return null;

  // --- Hide for admin ---
  const userRole = (role || localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();
  if (userRole === "admin") return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        right: 30,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        zIndex: 1300,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "relative",
          }}
        >
          {/* --- Gender Buttons --- */}
          <Grow in={showGenderFilter}>
            <Paper
              elevation={6}
              sx={{
                position: "absolute",
                right: 60,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.8,
                py: 0.8,
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                background: "linear-gradient(90deg, #7c9bccff, #e79c9cff)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              {genderOptions.map(({ label, color, icon }) => (
                <Button
                  key={label}
                  variant="contained"
                  size="small"
                  startIcon={icon}
                  onClick={() => handleGenderFilter(label)}
                  sx={{
                    backgroundColor: color,
                    color: "#333",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "20px",
                    px: 2.2,
                    "& .MuiButton-startIcon": { marginRight: "6px" },
                    "&:hover": {
                      backgroundColor: color,
                      filter: "brightness(0.95)",
                      transform: "scale(1.08)",
                      transition: "0.25s",
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Paper>
          </Grow>

          {/* --- Filter Options --- */}
          <Grow in={showFilterOptions}>
            <Paper
              elevation={6}
              sx={{
                position: "absolute",
                right: 60,
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 1.8,
                py: 0.8,
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                background: "#7c9bccff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              <Autocomplete
                freeSolo
                options={activeFilters.priceOptions}
                value={selectedPrice}
                onChange={(e, value) => setSelectedPrice(value)}
                sx={{ width: 120 }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Price" size="small" />
                )}
              />
              <Autocomplete
                freeSolo
                options={activeFilters.brandOptions}
                value={selectedBrand}
                onChange={(e, value) => setSelectedBrand(value)}
                sx={{ width: 120 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={isFashionPage ? "Brand" : "Mobile Brand"}
                    size="small"
                  />
                )}
              />
              <Autocomplete
                freeSolo
                options={activeFilters.sizeOptions}
                value={selectedSize}
                onChange={(e, value) => setSelectedSize(value)}
                sx={{ width: 120 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={isFashionPage ? "Size" : "RAM/Memory"}
                    size="small"
                  />
                )}
              />
              <Autocomplete
                freeSolo
                options={activeFilters.colourOptions}
                value={selectedColour}
                onChange={(e, value) => setSelectedColour(value)}
                sx={{ width: 120 }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Colour" size="small" />
                )}
              />
            </Paper>
          </Grow>

          {/* --- Gender Icon --- */}
          {isFashionPage && (
            <Fab
              aria-label="gender"
              onClick={handleGenderClick}
              sx={{
                backgroundImage:
                  "linear-gradient(45deg, #6ba1feff 30%, #FE6B8B 90%)",
              }}
            >
              <WcIcon />
            </Fab>
          )}
        </Box>

        {/* --- Filter Icon --- */}
        <Fab color="primary" aria-label="filter" onClick={handleFilterClick}>
          <FilterListIcon />
        </Fab>

        {/* --- Sort Icon --- */}
        <Fab color="secondary" aria-label="sort" onClick={handleSortClick}>
          <FormatLineSpacingIcon />
        </Fab>

        {/* --- Sort Menu --- */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose(null)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleMenuClose(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Box>
  );
};

export default Filter;
