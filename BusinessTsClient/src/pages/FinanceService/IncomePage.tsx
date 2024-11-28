import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useTranslation} from "react-i18next";
import {GridColDef, DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {
    fetchDeleteIncome,
    fetchFindAllIncomes,
    fetchFindIncomeByDate,
    fetchFindIncomeById,
    fetchSaveIncome,
    fetchUpdateIncome
} from "../../store/feature/financeSlice";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {IIncome} from "../../model/IIncome.tsx";
import {fetchFindAllProduct} from "../../store/feature/stockSlice.tsx";
import axios from "axios";

const IncomePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const [incomeList, setIncomeList] = useState<IIncome[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [source, setSource] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [incomeDate, setIncomeDate] = useState<Date>(new Date());
    const [openSaveIncomeModal, setOpenSaveIncomeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});



    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {field: 'source', headerName: 'Source', flex: 1.5, headerAlign: "center"},
        {
            field: 'amount',
            headerName: t("financeService.amounttl"),
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
                        {formatCurrency(params.row.amount)}
                    </div>
                );
            },
        },
        {field: 'incomeDate', headerName: 'Income Date', flex: 1.5, headerAlign: "center"},
    ];

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

    useEffect(() => {
        dispatch(
            fetchFindAllIncomes({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setIncomeList(data.payload.data)
        });
    }, [dispatch, searchText]);

    const fetchIncomeData = () => {
        dispatch(
            fetchFindAllIncomes({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setIncomeList(data.payload.data)
        });
    };

    const handleOpenSaveIncomeModal = () => {
        setOpenSaveIncomeModal(true);
    }

    const handleOpenUpdateIncomeModal = () => {
        const selectedId = selectedRowIds[0];
        setOpenSaveIncomeModal(true);
        setIsUpdating(true);
        dispatch(fetchFindIncomeById(selectedId)).then(data => {
            setSource(data.payload.data.source);
            setAmount(data.payload.data.amount);
            setIncomeDate(new Date(data.payload.data.incomeDate));
        });
    }

    const handleSaveIncome = () => {
        setLoading(true);
        dispatch(fetchSaveIncome({source, amount, incomeDate})).then(() => {
            setSource('');
            setAmount(0);
            setIncomeDate(new Date());
            setLoading(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("financeService.incomesuccesfullyadded"),
                icon: "success",
            });
            fetchIncomeData();
        });
        setOpenSaveIncomeModal(false);
    }

    const handleUpdateIncome = () => {
        setLoading(true);
        dispatch(fetchUpdateIncome({
            id: selectedRowIds[0],
            source,
            amount,
            incomeDate
        })).then(() => {
            setSource('');
            setAmount(0);
            setIncomeDate(new Date());
            setLoading(false);
            Swal.fire({
                title: t("financeService.updated"),
                text: t("financeService.incomesuccesfullyupdated"),
                icon: "success",
            });
            fetchIncomeData();
        });
        setOpenSaveIncomeModal(false);
    }

    const handleDeleteIncome = async () => {
        for (let id of selectedRowIds) {
            const selectedIncome = incomeList.find(
                (selectedIncome) => selectedIncome.id === id
            );
            if (!selectedIncome) continue;

            setIsDeleting(true);

            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("financeService.deleteproduct"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("financeService.yesdeleteit"),
                    cancelButtonText: t("financeService.cancel"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteIncome(selectedIncome.id));

                    if (data.payload.message !== "Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: t("financeService.deleted"),
                            text: t("financeService.budgetdeleted"),
                            icon: "success",
                        });
                        await dispatch(fetchFindAllProduct({
                            page: 0,
                            size: 100,
                            searchText: searchText,
                        }));
                        fetchIncomeData();
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }

    const handleSearch = () => {
        if (startDate && endDate) {
            dispatch(fetchFindIncomeByDate({
                startDate,
                endDate
            }));
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

                <Button variant="contained" onClick={handleSearch}>
                    {t('Search')}
                </Button>
            </div>
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
                rows={incomeList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                autoHeight={true}
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
                    "& .approved-row": {
                        backgroundColor: "#e0f2e9",
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0",
                    },

                }}
                rowSelectionModel={selectedRowIds}
            />
            <Grid container spacing={2} sx={{
                flexGrow: 1,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                marginTop: '2%',
                marginBottom: '2%'
            }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenSaveIncomeModal}
                        variant="contained"
                        color="success"
                        //startIcon={<ApproveIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("financeService.add")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateIncomeModal}
                        variant="contained"
                        color="warning"
                        disabled={loading || selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        //startIcon={<DeclineIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("financeService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeleteIncome}
                        variant="contained"
                        color="error"
                        disabled={isDeleting || selectedRowIds.length === 0}
                        //startIcon={<CancelIcon/>}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("financeService.delete")}
                    </Button>
                </Grid>
                <Dialog open={openSaveIncomeModal} onClose={() => setOpenSaveIncomeModal(false)} fullWidth
                        maxWidth={'sm'}>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.source')}
                            name="source"
                            value={source}
                            onChange={e => setSource(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.amount')}
                            name="amount"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            required
                            fullWidth
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={t('financeService.incomedate')}
                                value={dayjs(incomeDate)}
                                onChange={(newValue) => setIncomeDate(newValue ? newValue.toDate() : new Date())}
                                sx={{marginTop: '15px', width: '100%'}}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenSaveIncomeModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('financeService.cancel')}</Button>
                        {
                            isUpdating ?
                                <Button onClick={() => handleUpdateIncome()} color="success" variant="contained"
                                        disabled={source === '' || amount === 0 || incomeDate === null}>{t('financeService.update')}</Button>
                                :
                                <Button onClick={() => handleSaveIncome()} color="success" variant="contained"
                                        disabled={source === '' || amount === 0 || incomeDate === null}>{t('financeService.save')}</Button>
                        }
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
};

export default IncomePage;