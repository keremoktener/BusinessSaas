import { styled } from '@mui/material/styles';
export const Body = styled('main')(({ theme }) => ({
    minHeight: 'calc(100vh - 64px)',
    marginTop: theme.spacing(0),
}));