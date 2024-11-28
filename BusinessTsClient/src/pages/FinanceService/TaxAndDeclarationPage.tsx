import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useTranslation} from "react-i18next";
import React from 'react';
import {
    MenuItem,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box, InputLabel, Select, FormControl
} from '@mui/material';
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from 'recharts';
import {
    fetchCalculateTotalExpenseByDate,
    fetchCalculateTotalIncomeByDate,
    fetchCreateDeclaration, fetchFindAllDeclaration
} from "../../store/feature/financeSlice.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {IDeclaration} from "../../model/IDeclaration.tsx";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import axios from "axios";

const TaxAndDeclarationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [declarations, setDeclarations] = useState<IDeclaration[]>([])
    const [searchText, setSearchText] = useState('');
    const [taxType, setTaxType] = useState<string>('');
    const [grossIncome, setGrossIncome] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [netIncome, setNetIncome] = useState<number>(0);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [netIncomeAfterTax, setNetIncomeAfterTax] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 0, 2));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 11, 31));
    const [isCalculated, setIsCalculated] = useState<boolean>(false);
    const [currency, setCurrency] = useState('TRY');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        dispatch(fetchFindAllDeclaration({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            const updatedDeclarationsTaxType = data.payload.data.map(declaration => ({
                ...declaration,
                taxType: declaration.taxType === 'income' ? t("financeService.income") :
                    declaration.taxType === 'corporate' ? t("financeService.corporate") :
                        declaration.taxType === 'kdv' ? t("financeService.vat") :
                            declaration.taxType
            }));
            setDeclarations(updatedDeclarationsTaxType);
        })
    }, [dispatch, searchText]);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY');
            setExchangeRates(response.data.rates);
        };
        fetchExchangeRates();
    }, []);

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCurrency(event.target.value as string);
    };

    const formatCurrency = (value: number) => {
        const rate = exchangeRates[currency] || 1;
        const convertedValue = value * rate;
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency,
        }).format(convertedValue);
    };

    const fetchDeclarationData = () => {
        dispatch(fetchFindAllDeclaration({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setDeclarations(data.payload.data);
        })
    }

    const declarationColumns: GridColDef[] = [
        {field: 'startDate', headerName: t("financeService.startDate"), flex: 1.5, headerAlign: "center"},
        {field: 'endDate', headerName: t("financeService.endDate"), flex: 1.5, headerAlign: "center"},
        {
            field: 'totalIncome',
            headerName: t("financeService.totalIncome"),
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                return (
                    <div style={{
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {formatCurrency(params.row.totalIncome)}
                    </div>
                );
            },
        },
        {
            field: 'totalExpense',
            headerName: t("financeService.totalExpense"),
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                return (
                    <div style={{
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {formatCurrency(params.row.totalExpense)}
                    </div>
                );
            },
        },
        {
            field: 'netIncome',
            headerName: t("financeService.netIncome"),
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                return (
                    <div style={{
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {formatCurrency(params.row.netIncome)}
                    </div>
                );
            },
        },
        {
            field: 'totalTax',
            headerName: t("financeService.totalTax"),
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                return (
                    <div style={{
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {formatCurrency(params.row.totalTax)}
                    </div>
                );
            },
        },
        {field: 'taxType', headerName: t("financeService.taxType"), flex: 1.5, headerAlign: "center"},
        {field: 'status', headerName: t("financeService.status"), flex: 1.5, headerAlign: "center"},
    ];

    const getRowClassName = (params) => {
        return params.row.status === 'INACTIVE' ? 'inactive-row' : '';
    };

    const handleSearch = async () => {
        if (startDate && endDate) {
            const incomeResult = await dispatch(fetchCalculateTotalIncomeByDate({
                startDate,
                endDate
            })).unwrap();

            const expenseResult = await dispatch(fetchCalculateTotalExpenseByDate({
                startDate,
                endDate
            })).unwrap();

            const totalIncome = incomeResult.data ? parseFloat(incomeResult.data) : 0;
            const totalExpense = expenseResult.data ? parseFloat(expenseResult.data) : 0;

            setGrossIncome(totalIncome);
            setExpense(totalExpense);
            setNetIncome(totalIncome - totalExpense);

            const result = await dispatch(fetchCreateDeclaration({
                taxType,
                totalIncome,
                totalExpense,
                startDate,
                endDate
            })).unwrap();

            const tax = result.data ? parseFloat(result.data) : 0;
            setTotalTax(tax);
            console.log("netIncome", netIncome);
            console.log("tax", tax);
            setNetIncomeAfterTax(netIncome - tax);
            console.log("netIncomeAfterTax", netIncomeAfterTax);
            setIsCalculated(true);
            fetchDeclarationData();
        }
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('resultTable');
        if (input) {
            html2canvas(input).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10, 180, canvas.height * 180 / canvas.width);
                pdf.save("declaration-results.pdf");
            });
        }
    };

    return (
        <div style={{height: "auto"}}>
            <div style={{display: 'flex', gap: '10px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        sx={{width: '100%'}}
                        onChange={(newValue) =>
                            setStartDate(newValue ? newValue.toDate() : null)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        sx={{width: '100%'}}
                        onChange={(newValue) =>
                            setEndDate(newValue ? newValue.toDate() : null)}
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
            </div>

            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px', width: '15%' }}>
                <TextField
                    select
                    label={t("financeService.taxtype")}
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="kdv">{t("financeService.vat")}</MenuItem>
                    <MenuItem value="corporate">{t("financeService.corporate")}</MenuItem>
                    <MenuItem value="income">{t("financeService.income")}</MenuItem>
                </TextField>

                <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
                    {t('financeService.createdeclaration')}
                </Button>
            </div>

            {isCalculated && (
                <>
                    <TableContainer component={Paper} sx={{marginTop: '20px'}} id="resultTable">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("financeService.grossincome")}</TableCell>
                                    <TableCell>{t("financeService.expense")}</TableCell>
                                    <TableCell>{t("financeService.totaltax")}</TableCell>
                                    <TableCell>{t("financeService.netincomeaftertax")}</TableCell>
                                    <TableCell>{t("financeService.taxtype")}</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{formatCurrency(grossIncome)}</TableCell>
                                    <TableCell>{formatCurrency(expense)}</TableCell>
                                    <TableCell>{formatCurrency(totalTax)}</TableCell>
                                    <TableCell>{formatCurrency(netIncomeAfterTax)}</TableCell>
                                    <TableCell>{taxType === 'kdv' ? t("financeService.vat") : taxType === 'corporate' ? t("financeService.corporate") : t("financeService.income")}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" color="secondary" sx={{marginTop: '10px'}} onClick={handleDownloadPDF}>
                        {t("financeService.downloadpdf")}
                    </Button>
                </>
            )}
            <div style={{height: "auto"}}>
                <div style={{marginTop: 75, marginBottom: 50}}>
                    <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '1%', marginTop: '1%' }}>
                        <InputLabel>Currency</InputLabel>
                        <Select value={currency} onChange={handleCurrencyChange} label="Currency">
                            <MenuItem value="TRY">TRY</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                        </Select>
                    </FormControl>
                    <DataGrid
                        rows={declarations}
                        columns={declarationColumns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 1, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        autoHeight={true}
                        getRowClassName={getRowClassName}
                        disableSelectionOnClick
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "rgba(224, 224, 224, 1)",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                textAlign: "center",
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-cell": {
                                textAlign: "center",
                            },
                            "& .inactive-row": {
                                backgroundColor: "rgba(128, 128, 128, 0.2)",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "inherit",
                                cursor: "default",
                            },
                            "& .MuiDataGrid-row": {
                                pointerEvents: "none",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaxAndDeclarationPage;