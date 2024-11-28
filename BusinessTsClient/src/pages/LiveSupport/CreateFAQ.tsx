// src/pages/AdminFaqPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Box
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../store';
import { useTranslation } from 'react-i18next';
import { IFaq, fatchSaveFaq, fatchUpdateFaq, fetchFindAllFaq, fetchDeleteFaq } from '../../store/feature/liveSupportSlice';
import { Delete, Edit } from '@mui/icons-material';

const AdminFaqPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const faqList = useAppSelector((state) => state.liveSupport.faqList);
    const [selectedFaq, setSelectedFaq] = useState<IFaq | null>(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    // Fetch FAQs from backend
    useEffect(() => {
        dispatch(fetchFindAllFaq())
    }, []);



    // Handle form submission for creating or updating FAQs
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedFaq) {
                const faqData: Partial<IFaq> = {
                    question: question,
                    answer: answer,
                    id: selectedFaq.id
                };
                // Update FAQ
                dispatch(fatchUpdateFaq(faqData)).then(() => {
                    dispatch(fetchFindAllFaq())
                })
            } else {
                const faqData: Partial<IFaq> = {
                    question: question,
                    answer: answer,
                };
                // Create FAQ
                dispatch(fatchSaveFaq(faqData)).then(() => {
                    dispatch(fetchFindAllFaq())
                })
            }
            setQuestion('');
            setAnswer('');
            setSelectedFaq(null);
            dispatch(fetchFindAllFaq())
        } catch (error) {
            console.error("Error submitting FAQ:", error);
        }
    };

    // Load selected FAQ into form for editing
    const handleEdit = (faq: IFaq) => {
        setSelectedFaq(faq);
        setQuestion(faq.question || '');
        setAnswer(faq.answer || '');
    };

    const handleDelete = (faq: IFaq) => {
        dispatch(fetchDeleteFaq(faq.id || 0)).then(() => {
            dispatch(fetchFindAllFaq())
        })
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {t('liveSupport.faq.title')}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                    label={t('liveSupport.faq.question')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={question}
                    required
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <TextField
                    label={t('liveSupport.faq.answer')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    {selectedFaq ? t('liveSupport.faq.update') : t('liveSupport.faq.create')}
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>{t('liveSupport.faq.question')}</TableCell>
                            <TableCell>{t('liveSupport.faq.answer')}</TableCell>
                            <TableCell align="center">{t('liveSupport.faq.action')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faqList.map((faq) => (
                            <TableRow key={faq.id}>
                                <TableCell>{faq.question}</TableCell>
                                <TableCell>{faq.answer}</TableCell>
                                <TableCell align="center">
                                    <Button color="primary" onClick={() => handleEdit(faq)}>
                                        <Edit />
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleDelete(faq)}
                                        sx={{ ml: 1 }}
                                    >
                                        <Delete />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminFaqPage;
