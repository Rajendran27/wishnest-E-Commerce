import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const heroBanners = [
  {
    title: "Welcome to WishNest",
    subtitle: "Shop your favorite fashion, electronics, and more!",
    img: "https://ps.w.org/hero-banner-ultimate/assets/banner-772x250.png?rev=2585803",
  },
  {
    title: "Mega Electronics Sale",
    subtitle: "Up to 50% off on Mobiles, Laptops & Accessories!",
    img: "https://ceblog.s3.amazonaws.com/wp-content/uploads/2024/08/16162705/Birdies-Hero-Image.png",
  },
  {
    title: "Fashion Fiesta",
    subtitle: "Trendy outfits and accessories for every occasion!",
    img: "https://www.dynamicyield.com/wp-content/uploads/2024/04/fashion-trends-1-1.jpg",
  },
  {
    title: "Home & Kitchen Essentials",
    subtitle: "Cookware, decor, and appliances at best prices!",
    img: "https://tse3.mm.bing.net/th/id/OIP.2JXYSzcFWkkw4Ygnnd2gqgHaDK?pid=Api&P=0&h=180",
  },
];

const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: `WishNest Product ${i + 1}`,
  img: `https://source.unsplash.com/400x400/?product,${i}`,
  price: `${(i + 1) * 99}`,
}));

export default function HomePage() {
  const heroSettings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: false, // keeps sliding even if hovered
  };

  const productSlider = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        color: "#111",
        overflowX: "hidden",
      }}
      style={{ marginLeft: 150, marginTop: 64, padding: 20 }}
    >
      {/* ✅ Hero Section Auto-Slider */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 4,
          mb: 5,
        }}
      >
        <Slider {...heroSettings}>
          {heroBanners.map((banner, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                height: { xs: 300, md: 450 },
                backgroundImage: `url(${banner.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: "relative",
                  zIndex: 2,
                  p: { xs: 3, md: 6 },
                  borderRadius: 3,
                  backdropFilter: "blur(3px)",
                  maxWidth: "80%",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ mb: 1, textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {banner.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textShadow: "1px 1px 6px rgba(0,0,0,0.4)",
                    mb: 2,
                  }}
                >
                  {banner.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 3,
                    px: 4,
                  }}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                >
                  Shop Now
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* 🔥 Top Deals */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          🔥 Top Deals for You
        </Typography>
        <Slider {...productSlider}>
          {products.map((prod) => (
            <Box key={prod.id} px={1}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={prod.img}
                  alt={prod.name}
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {prod.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{prod.price}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* 🌟 Trending Now */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          🌟 Trending Now
        </Typography>
        <Slider {...productSlider}>
          {products.map((prod) => (
            <Box key={prod.id} px={1}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://source.unsplash.com/400x400/?trending,${prod.id}`}
                  alt={prod.name}
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {prod.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{prod.price}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* ⚡ Best of Electronics */}
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          ⚡ Best of Electronics
        </Typography>
        <Slider {...productSlider}>
          {products.map((prod) => (
            <Box key={prod.id} px={1}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://source.unsplash.com/400x400/?electronics,${prod.id}`}
                  alt={prod.name}
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {prod.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{prod.price}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          mt: 6,
          bgcolor: "#f1f1f1",
          color: "#555",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} WishNest. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
