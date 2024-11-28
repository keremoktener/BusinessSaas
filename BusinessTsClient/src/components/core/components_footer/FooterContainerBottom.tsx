//SUBJECT TO CHANGE
import { Container, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next';

const EasyClickableTextStye = {
  cursor: 'pointer',
  '&:hover': {
    color: 'primary.main',
  }
}
function FooterCopyright() {
  const { t } = useTranslation();
  //#region UI
  return (
    <Grid sx={{ backgroundColor: '#202020', padding: '1rem 0' }}>
      <Container >
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography
              fontSize="0.8rem"
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              {t('footer.copyright')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} container>
            <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'right' } }}>
              <Grid item>
                <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                  {t('footer.home')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                  {t('footer.terms')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                  {t('footer.privacy')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontSize="0.8rem" sx={EasyClickableTextStye}>
                  {t('footer.contact')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
  //#endregion UI
}

export default FooterCopyright