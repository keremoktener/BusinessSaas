import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {useTranslation} from "react-i18next";
import {IInvoice} from "../../model/IInvoice.tsx";
import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import {fetchFindAllBudget, fetchFindAllInvoice} from "../../store/feature/financeSlice.tsx";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import axios from "axios";

const InvoicePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);
    const invoices = useAppSelector((state) => state.financeSlice.invoiceList);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currency, setCurrency] = useState('TRY');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {field: 'buyerTcNo', headerName: 'T.C No', flex: 1.5, headerAlign: "center"},
        {field: 'buyerEmail', headerName: 'Email', flex: 1.5, headerAlign: "center"},
        {field: 'buyerPhone', headerName: t("financeService.phone"), flex: 1.5, headerAlign: "center"},
        {field: 'productId', headerName: t("financeService.productId"), flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'productName', headerName: t("financeService.productName"), flex: 1.5, headerAlign: "center"},
        {field: 'quantity', headerName: t("financeService.quantity"), flex: 1.5, headerAlign: "center", type: 'number'},
        {
            field: 'unitPrice',
            headerName: t("financeService.price"),
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
                        {formatCurrency(params.row.unitPrice)}
                    </div>
                );
            },
        },
        {
            field: 'totalAmount',
            headerName: t("financeService.totalAmount"),
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
        {field: 'invoiceDate', headerName: t("financeService.date"), flex: 1.5, headerAlign: "center"},
    ];

    useEffect(() => {
        dispatch(
            fetchFindAllInvoice({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setInvoiceList(data.payload.data);
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

    const fetchInvoiceData = () => {
        dispatch(fetchFindAllInvoice({
            searchText: searchText,
            page: 0,
            size: 100
        })).then((data) => {
            setInvoiceList(data.payload.data);
        });
    };

    return (
        <div style={{height: "auto"}}>
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
                rows={invoiceList}
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
                }}
                rowSelectionModel={selectedRowIds}
            />
        </div>
    )
};

export default InvoicePage;