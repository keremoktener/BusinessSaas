import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar,} from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    Select,
    TextField
} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {
    fetchDeleteOrder,
    fetchFindAllBuyOrder,
    fetchFindAllProduct,
    fetchFindAllSupplier,
    fetchFindByIdOrder,
    fetchSaveBuyOrder,
    fetchUpdateBuyOrder,
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IProduct} from "../../../model/StockService/IProduct.tsx";
import {ISupplier} from "../../../model/StockService/ISupplier.tsx";
import MenuItem from "@mui/material/MenuItem";
import {IOrder} from "../../../model/StockService/IOrder.tsx";


const BuyOrderPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [buyOrders, setBuyOrders] = useState<IOrder[]>({} as IOrder[]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL
    const [openAddBuyOrderModal, setOpenAddBuyOrderModal] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState(0);
    const [wareHouses, setWareHouses] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [quantity, setQuantity] = useState(0);


    useEffect(() => {
        dispatch(
            fetchFindAllBuyOrder({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setBuyOrders(data.payload.data);
        })
    }, [dispatch, searchText, isDeleting, isActivating, isUpdating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };


    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const handleOpenAddProductModal = () => {
        setOpenAddBuyOrderModal(true);
        dispatch(fetchFindAllSupplier({searchText: '', page: 0, size: 1000})).then((res) => {
            setSuppliers(res.payload.data);
        })
        dispatch(fetchFindAllProduct({searchText: '', page: 0, size: 1000})).then((res) => {
            setProducts(res.payload.data);
        })
    };

    const handleSaveBuyOrder = async () => {
        setIsDeleting(true);
        dispatch(fetchSaveBuyOrder({
            productId: selectedProduct as any,
            quantity: quantity,
            supplierId: selectedSupplier as any
        })).then(() => {

            setSelectedSupplier(0);
            setSelectedProduct(0);
            setIsDeleting(false);
            setOpenAddBuyOrderModal(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("stockService.buyordersuccessfullyadded"),
                icon: "success",
            });
        })

        setOpenAddBuyOrderModal(false)
    }

    const handleOpenUpdateModal = async () => {
        setOpenAddBuyOrderModal(true);
        setIsUpdating(true)
        dispatch(fetchFindAllSupplier({searchText: '', page: 0, size: 1000})).then((res) => {
            setSuppliers(res.payload.data);
        })
        dispatch(fetchFindAllProduct({searchText: '', page: 0, size: 1000})).then((res) => {
            setProducts(res.payload.data);
        })
        dispatch(fetchFindByIdOrder(selectedRowIds[0])).then((data) => {
            setQuantity(data.payload.data.quantity);
            setSelectedSupplier(data.payload.data.supplierId);
            setSelectedProduct(data.payload.data.productId);
        })


    }

    const handleUpdate = async () => {
        dispatch(fetchUpdateBuyOrder({
            id: selectedRowIds[0],
            productId: selectedProduct as any,
            quantity: quantity,
            supplierId: selectedSupplier as any
        })).then(() => {
            setSelectedSupplier(0);
            setSelectedProduct(0);
            setQuantity(0);
            setIsUpdating(false)
            setOpenAddBuyOrderModal(false);
            Swal.fire({
                title: t("stockService.updated"),
                text: t("stockService.successfullyupdated"),
                icon: "success",
            });
        })
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await Swal.fire({
            title: t("swal.areyousure"),
            text: t("stockService.deleteorder"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("stockService.yesdeleteit"),
            cancelButtonText: t("stockService.cancel"),
        });
        for (let id of selectedRowIds) {
            const selectedBuyOrder = buyOrders.find(
                (selectedBuyOrder) => selectedBuyOrder.id === id
            );
            if (!selectedBuyOrder) continue;


            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteOrder(selectedBuyOrder.id));
                    if (data.payload.message !== "Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        setSelectedRowIds([]);
                        setIsDeleting(false);
                        return;
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        if (result.isConfirmed) {
            await Swal.fire({
                title: t("stockService.deleted"),
                text: t("stockService.orderdeleted"),
                icon: "success",
            });
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "Id", flex: 0.5, headerAlign: "center"},
        {field: "supplierName", headerName: t("stockService.suppliername"), flex: 1.5, headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 1.75, headerAlign: "center"},
        {field: "productName", headerName: t("stockService.productName"), flex: 1.5, headerAlign: "center"},
        {
            field: "unitPrice", headerName: t("stockService.unitprice"), flex: 1, headerAlign: "center",
            renderCell: (params) => {
                // Check if the value is valid
                const value = params.value;
                if (typeof value === 'number' && !isNaN(value)) {
                    // Format the number as currency
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(value);
                }
                return '$0.00'; // Return default value if not a valid number
            },
        },
        {field: "quantity", headerName: t("stockService.quantity"), flex: 1, headerAlign: "center"},
        {
            field: "total", headerName: t("stockService.total"), flex: 1, headerAlign: "center",
            renderCell: (params) => {
                // Check if the value is valid
                const value = params.value;
                if (typeof value === 'number' && !isNaN(value)) {
                    // Format the number as currency
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(value);
                }
                return '$0.00'; // Return default value if not a valid number
            },
        },
        {
            field: "createdAt",
            headerName: t("stockService.createdat"),
            headerAlign: "center",
            flex: 1.5,
            renderCell: (params) => {
                const value = params.value;
                if (value) {
                    const date = new Date(value);
                    return `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`;
                }
                return '-'; // Return default value if date is not available
            },
        },
        {
            field: "status",
            headerName: t("stockService.status"),
            headerAlign: "center",
            flex: 1,
            renderCell: (params) => {
                const value = params.value;
                if (value === 'ACTIVE') {
                    return t("stockService.active");
                }
                if (value === 'APPROVED') {
                    return t("stockService.approved");
                }
                if (value === 'ARRIVED') {
                    return t("stockService.arrived");
                }
            }
        },
    ];


    return (
        <div style={{height: "auto"}}>
            {/*//TODO I WILL CHANGE THIS SEARCH METHOD LATER*/}
            <TextField
                label={t("stockService.searchbyproductname")}
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "1%", marginTop: "1%"}}
                fullWidth
                inputProps={{maxLength: 50}}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,

                }}
                rows={buyOrders}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                // getRowClassName={(params) =>
                //     params.row.isExpenditureApproved
                //         ? "approved-row" // Eğer onaylandıysa, yeşil arka plan
                //         : "unapproved-row" // Onaylanmadıysa, kırmızı arka plan
                // }
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
                    }/*,
                    "& .approved-row": {
                        backgroundColor: "#e0f2e9", // Onaylananlar için yeşil arka plan
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0", // Onaylanmayanlar için kırmızı arka plan
                    },*/

                }}
                rowSelectionModel={selectedRowIds}
                disableRowSelectionOnClick={true}
                localeText={{
                    toolbarColumns: t("dataGrid.toolbarColumns"),
                    toolbarColumnsLabel: t("dataGrid.toolbarColumnsLabel"),
                    toolbarFilters: t("dataGrid.toolbarFilters"),
                    toolbarFiltersLabel: t("dataGrid.toolbarFiltersLabel"),
                    toolbarDensity: t("dataGrid.toolbarDensity"),
                    toolbarDensityLabel: t("dataGrid.toolbarDensityLabel"),
                    toolbarDensityStandard: t("dataGrid.toolbarDensityStandard"),
                    toolbarDensityComfortable: t("dataGrid.toolbarDensityComfortable"),
                    columnsManagementSearchTitle: t("dataGrid.columnsManagementSearchTitle"),
                    columnsManagementShowHideAllText: t("dataGrid.columnsManagementShowHideAllText"),
                    toolbarDensityCompact: t("dataGrid.toolbarDensityCompact"),
                    toolbarExport: t("dataGrid.toolbarExport"),
                    toolbarExportLabel: t("dataGrid.toolbarExportLabel"),
                    toolbarExportCSV: t("dataGrid.toolbarExportCSV"),
                    toolbarExportPrint: t("dataGrid.toolbarExportPrint"),
                    noRowsLabel: t("dataGrid.noRowsLabel"),
                    noResultsOverlayLabel: t("dataGrid.noResultsOverlayLabel"),
                    footerRowSelected: (count) =>
                        count !== 1
                            ? `${count.toLocaleString()} ${t("dataGrid.footerRowSelected")}`
                            : `${count.toLocaleString()} ${t("dataGrid.footerRowSelected")}`,
                    footerTotalRows: t("dataGrid.footerTotalRows"),
                    columnMenuLabel: t("dataGrid.columnMenuLabel"),
                    columnMenuShowColumns: t("dataGrid.columnMenuShowColumns"),
                    columnMenuFilter: t("dataGrid.columnMenuFilter"),
                    columnMenuHideColumn: t("dataGrid.columnMenuHideColumn"),
                    columnMenuUnsort: t("dataGrid.columnMenuUnsort"),
                    columnMenuSortAsc: t("dataGrid.columnMenuSortAsc"),
                    columnMenuSortDesc: t("dataGrid.columnMenuSortDesc"),
                    MuiTablePagination: {
                        labelRowsPerPage: t("dataGrid.labelRowsPerPage")
                    }
                }}
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
                        onClick={handleOpenAddProductModal}
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
                        {t("stockService.add")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateModal}
                        variant="contained"
                        color="primary"
                        disabled={
                            selectedRowIds.length > 1 ||
                            selectedRowIds.length === 0 ||
                            buyOrders.find(order => order.id === selectedRowIds[0])?.status !== "ACTIVE"
                        }

                        //startIcon={<CancelIcon/>}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("stockService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={isDeleting || selectedRowIds.length === 0 || buyOrders.find(order => order.id === selectedRowIds[0])?.status !== "ACTIVE"}
                        //startIcon={<DeclineIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("stockService.delete")}
                    </Button>
                </Grid>

                <Dialog open={openAddBuyOrderModal} onClose={() => setOpenAddBuyOrderModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addbuyorder')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectsupplier')}</InputLabel>
                            <Select
                                value={selectedSupplier}
                                onChange={event => setSelectedSupplier((Number)(event.target.value))}
                                label="Suppliers"
                            >
                                {Object.values(suppliers).map(supplier => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                        {supplier.name + ' ' + supplier.surname + ' - ' + supplier.email}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectproduct')}</InputLabel>
                            <Select
                                value={selectedProduct}
                                onChange={event => setSelectedProduct((Number)(event.target.value))}
                                label="Products"
                            >
                                {Object.values(products).map(product => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.quantity')}
                            name="quantity"
                            value={quantity}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (value > 0 || e.target.value === '') {
                                    setQuantity(value);
                                }
                            }}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddBuyOrderModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={selectedProduct === 0 || selectedSupplier === 0 || quantity === 0}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveBuyOrder()} color="success" variant="contained"
                                    disabled={selectedProduct === 0 || selectedSupplier === 0 || quantity === 0}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default BuyOrderPage