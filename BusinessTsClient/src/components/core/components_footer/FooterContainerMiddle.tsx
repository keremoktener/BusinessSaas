//SUBJECT TO CHANGE
import { Container, Divider, Grid, Typography } from '@mui/material'
import logo from '../../../images/logo.png'
import { useTranslation } from 'react-i18next';
import { Facebook as FacebookIcon, X as XIcon, LinkedIn as LinkedInIcon, Instagram as InstagramIcon } from '@mui/icons-material';
import CustomMediumIcon from '../../atoms/CustomMediumIcon';
import { useNavigate } from 'react-router-dom';
const EasyTextFieldStye = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#E0E0E0',
    borderRadius: '4px',
}

const EasyClickableTextStye = {
    cursor: 'pointer',
    '&:hover': {
        color: 'primary.main',
    }
}
function FooterContact() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    //#region UI
    return (
        <Grid sx={{
            padding: '5rem 0 5rem 0',
            backgroundImage: "url(https://cdn.cloudwises.com/ba-assets/anasayfa/before-footer-img.jpg)",
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <Container >
                <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
                    <Grid item xs={12} md={4} sx={{ ...EasyTextFieldStye, marginLeft: { xs: "1rem", md: "0" } }}>
                        <Grid container>
                            <Grid item xs={2} display={"flex"} alignItems={"center"}>
                                <img src={logo} alt="logo" style={{ height: "52px" }} />
                            </Grid>
                            <Grid item xs={10} display={"flex"} alignItems={"center"}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    sx={{
                                        mr: 2,
                                        ml: 2,
                                        display: { xs: "flex", md: "flex", lg: "flex", xl: "flex" },
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        letterSpacing: ".3rem",
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                >
                                    BUSINESS
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Typography sx={{ letterSpacing: ".1rem", fontSize: "0.8rem", margin: "1rem 0 1rem 0" }}>
                                {t('footer.description')}
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Typography
                                variant="subtitle1"
                                noWrap
                                component="a"
                                sx={{
                                    display: { xs: "flex", md: "flex", lg: "flex", xl: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".1rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {t('footer.followUs')}
                            </Typography>
                        </Grid>
                        <Grid container sx={{ margin: "1rem 0 1rem 0" }}>
                            <LinkedInIcon fontSize='medium' sx={{ margin: "0 1rem 0 0", color: "primary.main", cursor: 'pointer' }} onClick={() => window.open("https://www.linkedin.com/company/bilgeadam/")} />

                            <CustomMediumIcon fontSize='medium' sx={{ margin: "0 1rem 0 0", color: "primary.main", cursor: 'pointer' }} onClick={() => window.open("https://medium.com/batech")} />

                            <XIcon fontSize='medium' sx={{ margin: "0 1rem 0 0", color: "primary.main", cursor: 'pointer' }} onClick={() => window.open("https://x.com/bilgeadam")} />

                            <FacebookIcon fontSize='medium' sx={{ margin: "0 1rem 0 0", color: "primary.main", cursor: 'pointer' }} onClick={() => window.open("https://www.facebook.com/bilgeadam")} />

                            <InstagramIcon fontSize='medium' sx={{ margin: "0 1rem 0 0", color: "primary.main", cursor: 'pointer' }} onClick={() => window.open("https://www.instagram.com/bilgeadam_teknoloji/")} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ ...EasyTextFieldStye, marginTop: { xs: "1rem", md: "0" }, marginLeft: { xs: "1rem", md: "0" } }}>
                        <Grid container padding={"0.7rem 0"}>
                            <Typography
                                variant="subtitle1"
                                noWrap
                                component="a"
                                sx={{
                                    display: { xs: "flex", md: "flex", lg: "flex", xl: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".1rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {t('footer.links')}
                            </Typography>
                        </Grid>
                        <Divider sx={{ borderColor: "primary.main", width: "20%", marginBottom: "0.4rem" }} />
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container padding={"0.6rem 0"}>
                                    <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                                        {t('footer.home')}
                                    </Typography>
                                </Grid>
                                <Grid container padding={"0.6rem 0"}>
                                    <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                                        {t('footer.services')}
                                    </Typography>
                                </Grid>
                                <Grid container padding={"0.6rem 0"}>
                                    <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                                        {t('footer.about')}
                                    </Typography>
                                </Grid>
                                <Grid container padding={"0.6rem 0"}>
                                    <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                                        {t('footer.contact')}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container padding={"0.6rem 0"}>
                                    <Typography fontSize="0.8rem" sx={EasyClickableTextStye} onClick={() => navigate('/faq')}>
                                        {t('footer.faq')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    )
    //#endregion UI
}

export default FooterContact