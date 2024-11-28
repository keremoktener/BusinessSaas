import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f5f5f5" }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Thank You!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Your information has been submitted successfully.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBackToHome}>
                Back to Home
            </Button>
        </Box>
    );
};

export default ThankYouPage;
