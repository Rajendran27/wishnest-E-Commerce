import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  StepConnector,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import PaymentSection from "./PaymentSection";
import AddressForm from "./Address";

// Step labels and icons
const steps = [
  { label: "Address", icon: <LocationOnIcon /> },
  { label: "Order Summary", icon: <ShoppingCartIcon /> },
  { label: "Payment", icon: <PaymentIcon /> },
];

// Stepper connector style
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  top: 22,
  left: "calc(-50% + 30px)",
  right: "calc(50% + 30px)",
  [`& .${StepConnector.line}`]: {
    borderColor: "#d1d5db",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

// ✅ Step icon styling with dynamic color (blue when active, green when completed)
const CustomStepIconRoot = styled("div")(({ ownerState }) => ({
  backgroundColor: ownerState.completed
    ? "#119d4bff" // green when completed
    : ownerState.active
    ? "#1976d2" // blue when active
    : "#e0e0e0", // gray when inactive
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: ownerState.active
    ? "0 0 10px rgba(25, 118, 210, 0.6)"
    : "none",
}));

function CustomStepIcon(props) {
  const { active, completed, icon } = props;
  const step = steps[Number(icon) - 1];
  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {step.icon}
    </CustomStepIconRoot>
  );
}

const BuyNow = () => {
  const location = useLocation();
  const { products } = location.state || { products: [] };

  const [activeStep, setActiveStep] = useState(0);

  // Next and Back handlers
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box style={{ marginLeft: 150, marginTop: 74, padding: 20 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        {/* Step 1: Address */}
        {activeStep === 0 && <AddressForm onNext={handleNext} />}

        {/* Step 2: Order Summary */}
        {activeStep === 1 && (
          <OrderSummary
            products={products}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* Step 3: Payment */}
        {activeStep === 2 && <PaymentSection onBack={handleBack} />}
      </Box>
    </Box>
  );
};

export default BuyNow;
