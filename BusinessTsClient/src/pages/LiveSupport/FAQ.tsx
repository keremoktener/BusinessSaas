// src/pages/UserFaqPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Box, Accordion,
    AccordionSummary, AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../store';
import { useTranslation } from 'react-i18next';
import { fetchFindAllFaq } from '../../store/feature/liveSupportSlice';

const UserFaqPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const faqList = useAppSelector((state) => state.liveSupport.faqList);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch FAQs from backend
    useEffect(() => {
        dispatch(fetchFindAllFaq());
    }, [dispatch]);

    // Filter FAQs based on the search term
    const filteredFaqs = faqList.filter(faq =>
        faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ py: 8, bgcolor: 'myBackgroundColour.main' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" color="primary.main" align="center" gutterBottom>
                    {t('liveSupport.faq.titleFAQ')}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <TextField
                        label={t('liveSupport.faq.search')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
                        {t('liveSupport.faq.noResults')}
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default UserFaqPage;
