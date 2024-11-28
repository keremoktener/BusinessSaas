import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {useTranslation} from "react-i18next";
import {GridColDef, DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {
    fetchDeleteExpense,
    fetchFindAllExpense,
    fetchFindByIdExpense,
    fetchFindExpenseByDate,
    fetchGetAllExpenseCategories, fetchGetDepartmentList,
    fetchSaveExpense,
    fetchUpdateExpense,
} from "../../store/feature/financeSlice";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {IIncome} from "../../model/IIncome";
import {IExpenseCategory} from "../../model/IExpenseCategory";
import axios from "axios";

const ExpensePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const expenses = useAppSelector((state) => state.financeSlice.expenseList);
    const [expenseList, setExpenseList] = useState<IIncome[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [expenseDate, setExpenseDate] = useState<Date>(new Date());
    const [openSaveExpenseModal, setOpenSaveExpenseModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [expenseCategories, setExpenseCategories] = useState<IExpenseCategory[]>([]);
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
    const [departmentId, setDepartmentId] = useState<number>(0);
    const [currency, setCurrency] = useState('TRY');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {
            field: "amount",
            headerName: t("financeService.amounttl"),
            flex: 1.5,
            headerAlign: "center",
            type: "number",
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
        {field: "description", headerName: t("financeService.description"), flex: 1.5, headerAlign: "center"},
        {field: "expenseDate", headerName: t("financeService.date"), flex: 1.5, headerAlign: "center"},
        {field: "departmentName", headerName: t("financeService.department"), flex: 1.5, headerAlign: "center"},
        {field: "expenseCategory", headerName: t("financeService.category"), flex: 1.5, headerAlign: "center"},
    ];

    useEffect(() => {
        dispatch(
            fetchFindAllExpense({
                searchText: searchText,
                page: 0,
                size: 100,
            })
        );
    }, [dispatch, searchText]);

    useEffect(() => {
        dispatch(fetchGetDepartmentList()).then(data => {
            setDepartments(data.payload.data);
        });
    }, [dispatch]);

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

    const fetchExpenseData = () => {
        dispatch(
            fetchFindAllExpense({
                searchText: searchText,
                page: 0,
                size: 100,
            })
        );
    };


    const handleOpenSaveExpenseModal = () => {
        setOpenSaveExpenseModal(true);
        dispatch(fetchGetAllExpenseCategories()).then((data) => {
            setExpenseCategories(data.payload.data);
        });
    };

    const handleOpenUpdateExpenseModal = () => {
        const selectedId = selectedRowIds[0];
        if (selectedId) {
            setOpenSaveExpenseModal(true);
            setIsUpdating(true);
            dispatch(fetchGetAllExpenseCategories()).then((data) => {
                setExpenseCategories(data.payload.data);
            });
            dispatch(fetchFindByIdExpense(selectedId)).then((data) => {
                setExpenseCategory(data.payload.data.expenseCategory);
                setExpenseDate(new Date(data.payload.data.expenseDate));
                setAmount(data.payload.data.amount);
                setDescription(data.payload.data.description);
            });
        }
    };

    const handleSaveExpense = () => {
        setLoading(true);
        dispatch(fetchSaveExpense({departmentId, expenseCategory, expenseDate, amount, description})).then(() => {
            setAmount(0);
            setExpenseDate(new Date());
            setDescription("");
            setLoading(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("financeService.expensesuccesfullyadded"),
                icon: "success",
            });
            fetchExpenseData();
        });
        setOpenSaveExpenseModal(false);
    };

    const handleUpdateExpense = () => {
        setLoading(true);
        const selectedId = selectedRowIds[0];
        console.log("selectedId", selectedId);

        dispatch(fetchUpdateExpense({
            id: selectedId,
            expenseDate,
            amount,
            description,
            expenseCategory,
        })).then(() => {
            setAmount(0);
            setExpenseDate(new Date());
            setDescription("");
            setLoading(false);
            Swal.fire({
                title: t("financeService.updated"),
                text: t("financeService.expensesuccesfullyupdated"),
                icon: "success",
            });
            fetchExpenseData();
        });
        setOpenSaveExpenseModal(false);
    };

    const handleDeleteExpense = async () => {
        for (let id of selectedRowIds) {
            const selectedExpense = expenses.find(
                (selectedExpense) => selectedExpense.id === id
            );
            if (!selectedExpense) continue;

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
                    const data = await dispatch(fetchDeleteExpense(selectedExpense.id));

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
                        fetchExpenseData();
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
    };

    const handleSearch = () => {
        if (startDate && endDate) {
            dispatch(fetchFindExpenseByDate({
                startDate,
                endDate,
            }));
        }
    };

    return (
        <div style={{height: "auto"}}>
            <div style={{display: "flex", gap: "10px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        sx={{width: "100%"}}
                        onChange={(newValue) =>
                            setStartDate(newValue ? newValue.toDate() : null)
                        }
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        sx={{width: "100%"}}
                        onChange={(newValue) =>
                            setEndDate(newValue ? newValue.toDate() : null)
                        }
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleSearch}>
                    {t("Search")}
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
                rows={expenses}
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
                        variant="contained"
                        color="success"
                        onClick={handleOpenSaveExpenseModal}
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
                        variant="contained"
                        color="warning"
                        onClick={handleOpenUpdateExpenseModal}
                        disabled={selectedRowIds.length != 1 || loading}
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
                        variant="contained"
                        color="error"
                        onClick={handleDeleteExpense}
                        disabled={isDeleting || selectedRowIds.length === 0}
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
                <Dialog open={openSaveExpenseModal} onClose={() => setOpenSaveExpenseModal(false)}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label={t("financeService.department")}
                                    variant="outlined"
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    required
                                >
                                    <option value="">{t("financeService.department")}</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="expense-category-label">{t("financeService.category")}</InputLabel>
                                    <Select
                                        value={expenseCategory}
                                        onChange={(e) => setExpenseCategory(e.target.value)}
                                        labelId={t("financeService.description")}
                                    >
                                        {Object.values(expenseCategories).map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.expenseCategory}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={t("financeService.amount")}
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={t("financeService.description")}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label={t("financeService.expensedate")}
                                        value={dayjs(expenseDate)}
                                        onChange={(newValue) => setExpenseDate(newValue?.toDate() || new Date())}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenSaveExpenseModal(false)}>{t("financeService.cancel")}</Button>
                        <Button onClick={isUpdating ? handleUpdateExpense : handleSaveExpense}>
                            {isUpdating ? t("financeService.update") : t("financeService.save")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
};

export default ExpensePage;