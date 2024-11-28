import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid, MenuItem, TableContainer, Paper, FormControl, InputLabel, Select
} from '@mui/material';
import { AppDispatch, useAppSelector } from "../../store";
import {
    fetchDeleteBudget,
    fetchFindAllBudget,
    fetchFindByIdBudget,
    fetchGetBudgetByDepartmentName,
    fetchGetBudgetCategories,
    fetchGetDepartmentList,
    fetchSaveBudget,
    fetchUpdateBudget
} from "../../store/feature/financeSlice.tsx";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { IBudgetCategory } from "../../model/IBudgetCategory.tsx";
import { IBudgetMergedByDepartment } from "../../model/IBudgetMergedByDepartment.tsx";
import { IBudgetByDepartment } from "../../model/IBudgetByDepartment.tsx";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import axios from 'axios';

const BudgetPage: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [budgetList, setBudgetList] = useState<IBudgetMergedByDepartment[]>([]);
    const [budgetListByDepartmentId, setBudgetListByDepartmentId] = useState<IBudgetByDepartment[]>([]);
    const budgets = useAppSelector((state) => state.financeSlice.budgetList);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { t } = useTranslation();
    const [openSaveBudgetModal, setOpenSaveBudgetModal] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
    const [departmentId, setDepartmentId] = useState<number>(0);
    const [subAmount, setSubAmount] = useState(0);
    const [budgetCategory, setBudgetCategory] = useState('');
    const [budgetCategories, setBudgetCategories] = useState<IBudgetCategory[]>([]);
    const [description, setDescription] = useState('');
    const [selectedDetailRowId, setSelectedDetailRowId] = useState<number | null>(null);
    const [currency, setCurrency] = useState('TRY');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY');
            setExchangeRates(response.data.rates);
        };
        fetchExchangeRates();
    }, []);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleDetailRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedDetailRowId(newSelectionModel.length > 0 ? newSelectionModel[0] as number : null);
    };

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

    const columns: GridColDef[] = [
        { field: 'departmentName', headerName: t("financeService.department"), flex: 1.5, headerAlign: "center" },
        {
            field: 'totalAmount',
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
                        {formatCurrency(params.row.totalAmount)}
                    </div>
                );
            },
        },
        {
            field: 'spentAmount',
            headerName: t("financeService.spentAmount"),
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                const isExceeding = params.row.spentAmount > params.row.totalAmount;
                return (
                    <div style={{
                        backgroundColor: isExceeding ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)',
                        color: isExceeding ? 'red' : 'green',
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {formatCurrency(params.row.spentAmount)}
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        dispatch(fetchGetDepartmentList()).then(data => {
            setDepartments(data.payload.data);
        });
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            fetchFindAllBudget({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setBudgetList(data.payload.data);
        });
    }, [dispatch, searchText]);

    const fetchBudgetData = () => {
        dispatch(fetchFindAllBudget({
            searchText: searchText,
            page: 0,
            size: 100
        })).then((data) => {
            setBudgetList(data.payload.data);
        });
    };

    const handleOpenSaveBudgetModal = () => {
        setOpenSaveBudgetModal(true);
        setIsUpdating(false);
        dispatch(fetchGetBudgetCategories()).then(data => {
            setBudgetCategories(data.payload.data);
        });
        dispatch(fetchGetDepartmentList()).then(data => {
            setDepartments(data.payload.data);
        });
    };

    const handleOpenUpdateBudgetModalFromDetails = async () => {
        if (!selectedDetailRowId) return;
        setOpenDetailsModal(false);
        setOpenSaveBudgetModal(true);
        setIsUpdating(true);
        dispatch(fetchGetBudgetCategories()).then(data => {
            setBudgetCategories(data.payload.data);
        });
        dispatch(fetchFindByIdBudget(selectedDetailRowId)).then(data => {
            setDepartment(data.payload.data.department);
            setSubAmount(data.payload.data.amount);
            setDescription(data.payload.data.description);
        });
    };

    const handleOpenUpdateBudgetModal = async () => {
        const selectedId = selectedRowIds[0];
        setOpenSaveBudgetModal(true);
        setIsUpdating(true);
        dispatch(fetchGetBudgetCategories()).then(data => {
            setBudgetCategories(data.payload.data);
        });
        dispatch(fetchFindByIdBudget(selectedId)).then(data => {
            setDepartment(data.payload.data.department);
            setSubAmount(data.payload.data.amount);
        });
    };

    const handleFetchDetails = async () => {
        setSelectedDetailRowId(null);
        const selectedId = selectedRowIds[0];
        const selectedDepartmentName = budgetList.find(budget => budget.id === selectedId)?.departmentName;
        if (selectedDepartmentName) {
            const data = await dispatch(fetchGetBudgetByDepartmentName(selectedDepartmentName));
            setBudgetListByDepartmentId(data.payload.data);
            setOpenDetailsModal(true);
        }
    };

    const handleSaveBudget = () => {
        setLoading(true);
        dispatch(fetchSaveBudget({ departmentId, subAmount, budgetCategory, description })).then(() => {
            setDepartment('');
            setSubAmount(0);
            setDescription('');
            setLoading(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("financeService.budgetsuccesfullyadded"),
                icon: "success",
            });
            fetchBudgetData();
        });
        setOpenSaveBudgetModal(false);
    };

    const handleUpdateBudget = () => {
        dispatch(fetchUpdateBudget(
            {
                id: selectedDetailRowId!,
                departmentId,
                subAmount,
                budgetCategory,
                description
            })
        ).then(() => {
            setSubAmount(0);
            setDescription('');
            setIsUpdating(false);
            setOpenSaveBudgetModal(false);
            Swal.fire({
                title: t("financeService.updated"),
                text: t("financeService.budgetsuccesfullyupdated"),
                icon: "success",
            });
            fetchBudgetData();
        });
        setSelectedDetailRowId(null);
    };

    const handleDeleteBudget = async () => {
        setOpenDetailsModal(false);
        if (!selectedDetailRowId) return;

        const selectedBudget = budgetListByDepartmentId.find(
            (selectedBudget) => selectedBudget.id === selectedDetailRowId
        );
        if (!selectedBudget) return;

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
                const data = await dispatch(fetchDeleteBudget(selectedBudget.id));

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
                    fetchBudgetData();
                }
            }
        } catch (error) {
            localStorage.removeItem("token");
        }
        setSelectedDetailRowId(null);
    };

    return (
        <div style={{ height: "auto" }}>
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
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={budgetList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
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
                        onClick={handleOpenSaveBudgetModal}
                        variant="contained"
                        color="success"
                        disabled={selectedRowIds.length != 0}
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
                        onClick={handleFetchDetails}
                        variant="contained"
                        color="secondary"
                        disabled={loading || selectedRowIds.length != 1}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("financeService.details")}
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={openSaveBudgetModal} onClose={() => setOpenSaveBudgetModal(false)}>
                <DialogTitle>
                    {isUpdating ? t("financeService.updatebudget") : t("financeService.savebudget")}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                //label={t("financeService.department")}
                                variant="outlined"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(Number(e.target.value))}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                value={budgetCategory}
                                fullWidth
                                onChange={(e) => setBudgetCategory(e.target.value)}
                                labelId={t("financeService.category")}
                            >
                                {Object.values(budgetCategories).map(category => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.budgetCategory}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.amount")}
                                variant="outlined"
                                type="number"
                                value={subAmount}
                                onChange={(e) => setSubAmount(Number(e.target.value))}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.description")}
                                variant="outlined"
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSaveBudgetModal(false)}>{t("financeService.cancel")}</Button>
                    <Button onClick={isUpdating ? handleUpdateBudget : handleSaveBudget}>
                        {isUpdating ? t("financeService.update") : t("financeService.save")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t("financeService.budgetdetails")}</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("financeService.category")}</TableCell>
                                    <TableCell>{t("financeService.amounttl")}</TableCell>
                                    <TableCell>{t("financeService.description")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {budgetListByDepartmentId.map((budget) => (
                                    <TableRow
                                        key={budget.id}
                                        selected={selectedDetailRowId === budget.id}
                                        onClick={() => handleDetailRowSelection([budget.id])}
                                    >
                                        <TableCell>{budget.budgetCategory}</TableCell>
                                        <TableCell>{formatCurrency(budget.subAmount)}</TableCell>
                                        <TableCell>{budget.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOpenUpdateBudgetModalFromDetails} disabled={!selectedDetailRowId}>
                        {t("financeService.update")}
                    </Button>
                    <Button onClick={handleDeleteBudget} disabled={!selectedDetailRowId}>
                        {t("financeService.delete")}
                    </Button>
                    <Button onClick={() => setOpenDetailsModal(false)} color="primary">
                        {t("financeService.cancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BudgetPage;