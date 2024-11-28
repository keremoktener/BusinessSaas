import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
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
import {AppDispatch, useAppSelector} from "../../../store";
import {
    fetchChangeAutoOrderModeOfProduct,
    fetchDeleteProduct,
    fetchFindAllProduct,
    fetchFindAllProductCategory,
    fetchFindAllSupplier,
    fetchFindAllWareHouse,
    fetchFindByIdProduct,
    fetchSaveProduct,
    fetchUpdateProduct
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import {ISupplier} from "../../../model/StockService/ISupplier.tsx";
import {IWareHouse} from "../../../model/StockService/IWareHouse.tsx";
import {IProductCategory} from "../../../model/StockService/IProductCategory.tsx";


const ProductPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const products = useAppSelector((state) => state.stockSlice.productList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL
    const [openAddProductModal, setOpenAddProductModel] = useState(false);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState(0);
    const [wareHouses, setWareHouses] = useState<IWareHouse[]>([]);
    const [selectedWarehouse, setSelectedWareHouse] = useState(0);
    const [productCategories, setProductCategories] = useState<IProductCategory[]>([]);
    const [selectedProductCategory, setSelectedProductCategory] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stockCount, setStockCount] = useState(0);
    const [minimumStockLevel, setMinimumStockLevel] = useState(0);

    useEffect(() => {
        dispatch(
            fetchFindAllProduct({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        )
    }, [dispatch, searchText, loading, isActivating, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };


    const handleOpenAddProductModal = () => {
        setOpenAddProductModel(true);
        dispatch(fetchFindAllSupplier({searchText: '', page: 0, size: 1000})).then((res) => {
            setSuppliers(res.payload.data);
        })
        dispatch(fetchFindAllWareHouse({searchText: '', page: 0, size: 1000})).then((res) => {
            setWareHouses(res.payload.data);
        })
        dispatch(fetchFindAllProductCategory({searchText: '', page: 0, size: 1000})).then((res) => {
            setProductCategories(res.payload.data);
        })
    };

    const handleSaveProduct = async () => {
        setLoading(true);
        dispatch(fetchSaveProduct({
            productCategoryId: selectedProductCategory as any,
            supplierId: selectedSupplier as any,
            wareHouseId: selectedWarehouse as any,
            name,
            description,
            price,
            stockCount,
            minimumStockLevel
        })).then(() => {
            setName('');
            setDescription('');
            setPrice(0);
            setStockCount(0);
            setMinimumStockLevel(0);
            setSelectedProductCategory(0);
            setSelectedSupplier(0);
            setSelectedWareHouse(0);
            setLoading(false);
            setOpenAddProductModel(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("stockService.productsuccesfullyadded"),
                icon: "success",
            });
        })

        setOpenAddProductModel(false)
    }

    const handleOpenUpdateModal = async () => {
        setOpenAddProductModel(true);
        setIsUpdating(true)
        dispatch(fetchFindAllSupplier({searchText: '', page: 0, size: 100})).then((res) => {
            setSuppliers(res.payload.data);
        })
        dispatch(fetchFindAllWareHouse({searchText: '', page: 0, size: 100})).then((res) => {
            setWareHouses(res.payload.data);
        })
        dispatch(fetchFindAllProductCategory({searchText: '', page: 0, size: 100})).then((res) => {
            setProductCategories(res.payload.data);
        })
        dispatch(fetchFindByIdProduct(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name);
            setDescription(data.payload.data.description);
            setPrice(data.payload.data.price);
            setStockCount(data.payload.data.stockCount);
            setMinimumStockLevel(data.payload.data.minimumStockLevel);
            setSelectedProductCategory(data.payload.data.productCategoryId);
            setSelectedSupplier(data.payload.data.supplierId);
            setSelectedWareHouse(data.payload.data.wareHouseId);
        })


    }

    const handleUpdate = () => {
        dispatch(fetchUpdateProduct({
            id: selectedRowIds[0],
            productCategoryId: selectedProductCategory as any,
            supplierId: selectedSupplier as any,
            wareHouseId: selectedWarehouse as any,
            name,
            description,
            price,
            stockCount,
            minimumStockLevel
        })).then(() => {
            setName('');
            setDescription('');
            setPrice(0);
            setStockCount(0);
            setMinimumStockLevel(0);
            setSelectedProductCategory(0);
            setSelectedSupplier(0);
            setSelectedWareHouse(0);

            setIsUpdating(false)
            setOpenAddProductModel(false);
            Swal.fire({
                title: t("stockService.updated"),
                text: t("stockService.productsuccesfullyupdated"),
                icon: "success",
            });
        })


    }

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await Swal.fire({
            title: t("swal.areyousure"),
            text: t("stockService.deleteproduct"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("stockService.yesdeleteit"),
            cancelButtonText: t("stockService.cancel"),
        });
        for (let id of selectedRowIds) {
            const selectedProduct = products.find(
                (selectedProduct) => selectedProduct.id === id
            );
            if (!selectedProduct) continue;

            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteProduct(selectedProduct.id));

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
                text: t("stockService.productdeleted"),
                icon: "success",
            });
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }

    const columns: GridColDef[] = [
        {field: "name", headerName: t("authentication.name"), flex: 1.5, headerAlign: "center"},
        {field: "supplierName", headerName: t("stockService.suppliername"), flex: 1.5, headerAlign: "center"},
        {field: "wareHouseName", headerName: t("stockService.warehouse"), flex: 1.5, headerAlign: "center"},
        {field: "productCategoryName", headerName: t("stockService.productcategory"), flex: 1, headerAlign: "center"},
        {field: "description", headerName: t("stockService.description"), flex: 1.5, headerAlign: "center"},
        {
            field: "price", headerName: t("stockService.price"), flex: 1, headerAlign: "center",
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

        {field: "stockCount", headerName: t("stockService.stockcount"), flex: 0.75, headerAlign: "center"},
        {field: "minimumStockLevel", headerName: t("stockService.minstockcount"), headerAlign: "center", flex: 0.75},
        {
            field: "isAutoOrderEnabled",
            headerName: t("stockService.autoorder"),
            headerAlign: "center",
            flex: 1,
            renderCell: (params) => {
                const value = params.value;
                if (value === true) {
                    return t("stockService.open");
                } else {
                    return t("stockService.close");
                }
            }
        }
    ];

    const handleChangeAutoOrderMode = async () => {
        for (let id of selectedRowIds) {
            const selectedProduct = products.find(
                (selectedProduct) => selectedProduct.id === id
            );
            if (!selectedProduct) continue;

            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("swal.changeorderstatus"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("swal.yeschangeit"),
                    cancelButtonText: t("stockService.cancel"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchChangeAutoOrderModeOfProduct(selectedProduct.id));

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
                            title: t("swal.changed"),
                            text: t("swal.productautoordermodechanged"),
                            icon: "success",
                        });
                        await dispatch(fetchFindAllProduct({
                            page: 0,
                            size: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setLoading(false);
    };
    return (
        <div style={{height: "auto"}}>
            <TextField
                label={t("stockService.searchbyname")}
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
                rows={products}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                getRowClassName={(params) =>
                    params.row.minimumStockLevel < params.row.stockCount
                        ? "approved-row"
                        : "unapproved-row"
                }
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
                        color="info"
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
                        {t("stockService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDelete}
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
                        {t("stockService.delete")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleChangeAutoOrderMode}
                        variant="contained"
                        color="warning"
                        disabled={loading || selectedRowIds.length === 0}
                        //startIcon={<DeclineIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("stockService.changeautoordermode")}
                    </Button>
                </Grid>


                <Dialog open={openAddProductModal} onClose={() => setOpenAddProductModel(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addproduct')}</DialogTitle>
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
                                        {supplier.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectwarehouse')}</InputLabel>
                            <Select
                                value={selectedWarehouse}
                                onChange={event => setSelectedWareHouse((Number)(event.target.value))}
                                label="Ware Houses"
                            >
                                {Object.values(wareHouses).map(warehouse => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectcategory')}</InputLabel>
                            <Select
                                value={selectedProductCategory}
                                onChange={event => setSelectedProductCategory((Number)(event.target.value))}
                                label="Product Categories"
                            >
                                {Object.values(productCategories).map(productCategory => (
                                    <MenuItem key={productCategory.id} value={productCategory.id}>
                                        {productCategory.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.productname')}
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.description')}
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.price')}
                            name="price"
                            value={price}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (value > 0 || e.target.value === '') {
                                    setPrice(value);
                                }
                            }}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.stockcount')}
                            name="stockCount"
                            value={stockCount}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (value > 0 || e.target.value === '') {
                                    setStockCount(value);
                                }
                            }}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.minstocklevel')}
                            name="minStockLevel"
                            value={minimumStockLevel}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (value > 0 || e.target.value === '') {
                                    setMinimumStockLevel(value);
                                }
                            }}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddProductModel(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={selectedSupplier === null || selectedWarehouse === null || selectedProductCategory === null || name === '' || description === '' || price === 0 || stockCount === 0 || minimumStockLevel === 0}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveProduct()} color="success" variant="contained"
                                    disabled={selectedSupplier === null || selectedWarehouse === null || selectedProductCategory === null || name === '' || description === '' || price === 0 || stockCount === 0 || minimumStockLevel === 0}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default ProductPage