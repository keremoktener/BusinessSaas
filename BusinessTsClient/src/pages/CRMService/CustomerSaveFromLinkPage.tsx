import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Grid,
    Box,
    Paper,
    IconButton,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchSaveExternalCustomer } from "../../store/feature/crmSlice.tsx";
import StarRatings from 'react-star-ratings';
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";
import MailIcon from "@mui/icons-material/Mail";
import {Home, PhoneInTalk, PhoneIphone} from "@mui/icons-material";

const CustomerRegistrationPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [memberId, setMemberId] = useState<string | null>(null);
    const [emailEditable, setEmailEditable] = useState(false); // E-posta alanını düzenlenebilir hale getirmek için state
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const id = params.get("memberId");
        setMemberId(id);

        const emailParam = params.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { [key: string]: string } = {};
        if (!firstName) newErrors.firstName = "First name is required.";
        if (!lastName) newErrors.lastName = "Last name is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!phone) newErrors.phone = "Phone number is required.";
        if (!address) newErrors.address = "Address is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const customerData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            rating,
            memberId,
        };

        handleSaveCustomer(customerData);
    };

    const handleSaveCustomer = (customerData: any) => {
        dispatch(fetchSaveExternalCustomer(customerData)).then((data) => {
            if (data.payload.message === "Customer saved successfully") {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setRating(0);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.added_successfully"),
                    icon: "success",
                }).then(() => {
                    navigate("/thank-you");
                });

            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
            }

        }).catch((error) => {
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
        });
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f5f5f5" }}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, width: '450px' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {t('crmService.fill_your_details_and_rate_us')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('crmService.firstName')}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('crmService.lastName')}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('crmService.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    readOnly: !emailEditable, // E-posta alanını düzenlenebilir yapma
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={t('crmService.change')}>
                                                <IconButton onClick={() => setEmailEditable(true)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('crmService.phone')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIphone />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('crmService.address')}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={!!errors.address}
                                helperText={errors.address}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Home />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
                            <Typography sx={{ mb: 1 }} variant="body1" gutterBottom>
                                {t('crmService.please_rate_your_experience')}
                            </Typography>
                            <StarRatings
                                rating={rating}
                                starRatedColor="gold"
                                changeRating={(newRating: React.SetStateAction<number>) => setRating(newRating)}
                                numberOfStars={5}
                                name="rating"
                                starDimension="30px"
                                starSpacing="5px"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                {t('crmService.save')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CustomerRegistrationPage;
