import React, {useState} from "react";
import {
    Grid,
    TextField,
    Button,
    Paper,
    Typography
} from "@mui/material";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {
    fetchSendingEmailExternalSourceCustomer
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MailIcon from "@mui/icons-material/Mail";
import InputAdornment from "@mui/material/InputAdornment";

const CustomerSendEmailPage = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState('');

    const sendEmailForCustomer = async () => {
        dispatch(fetchSendingEmailExternalSourceCustomer({ email }))
            .then((data) => {
                if (data.payload.message === "Email send successfully") {
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.sent"),
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: t("swal.error"),
                        text: t("crmService.error"),
                        icon: "error",
                    });
                }
            }).catch((error) => {
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error"),
                icon: "error",
            });
        });
    };

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100vh', bgcolor: '#f9f9f9' }}
        >
            <Paper elevation={4} sx={{ padding: 4, maxWidth: 500, width: '100%', borderRadius: '8px' }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', marginBottom: 2 }}>
                    {t('crmService.sendEmail')}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label={t('crmService.email')}
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={sendEmailForCustomer}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                padding: '10px 0',
                                borderRadius: 4,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                }
                            }}
                        >
                            {t('crmService.send')}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}

export default CustomerSendEmailPage;
