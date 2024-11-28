import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar,} from "@mui/x-data-grid";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {
    fetchDeleteWareHouse,
    fetchFindAllWareHouse,
    fetchFindByIdWareHouse,
    fetchSaveWareHouse,
    fetchUpdateWareHouse
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IWareHouse} from "../../../model/StockService/IWareHouse.tsx";


const WareHousePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [wareHouses, setWareHouses] = useState<IWareHouse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL
    const [openAddWareHouseModal, setOpenAddWareHouseModal] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        dispatch(
            fetchFindAllWareHouse({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setWareHouses(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating, isSaving, isDeleting, isUpdating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const handleOpenAddSupplierModal = () => {
        setOpenAddWareHouseModal(true);
    };
    const columns: GridColDef[] = [
        {field: "name", headerName: t("authentication.name"), flex: 1.5, headerAlign: "center"},
        {field: "location", headerName: t("stockService.location"), flex: 1.5, headerAlign: "center"},
    ];

    const handleOpenUpdateModal = async () => {
        setOpenAddWareHouseModal(true);
        setIsUpdating(true)

        dispatch(fetchFindByIdWareHouse(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name)
            setLocation(data.payload.data.location)
        })
    }
    const handleUpdate = async () => {
        dispatch(fetchUpdateWareHouse({id: selectedRowIds[0], name: name, location: location})).then(() => {
            setName('')
            setLocation('')
            setOpenAddWareHouseModal(false);
            Swal.fire({
                title: t("stockService.updated"),
                text: t("stockService.successfullyupdated"),
                icon: "success",
            });
            setIsUpdating(false)
        })
    }

    const handleSaveWarehouse = async () => {
        setIsSaving(true)
        dispatch(fetchSaveWareHouse({
            name: name,
            location: location
        }))
            .then((data) => {
                if (data.payload.message === "Success") {
                    setName('')
                    setLocation('')
                    setOpenAddWareHouseModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                } else {

                    setName('')
                    setLocation('')
                    setOpenAddWareHouseModal(false);
                    Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                    setIsSaving(false)
                }
            })
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await Swal.fire({
            title: t("swal.areyousure"),
            text: t("stockService.deleting"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("stockService.yesdeleteit"),
            cancelButtonText: t("stockService.cancel"),
        });
        for (let id of selectedRowIds) {
            const selectedWarehouse = wareHouses.find(
                (selectedWarehouse) => selectedWarehouse.id === id
            );
            if (!selectedWarehouse) continue;


            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteWareHouse(selectedWarehouse.id));

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
                text: t("stockService.successfullydeleted"),
                icon: "success",
            });
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }


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
                rows={wareHouses}
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
                        onClick={handleOpenAddSupplierModal}
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
                        //startIcon={<DeclineIcon />}
                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
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

                <Dialog open={openAddWareHouseModal} onClose={() => setOpenAddWareHouseModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addwarehouse')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('authentication.name')}
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.location')}
                            name="location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddWareHouseModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={name === '' || location === ''}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveWarehouse()} color="success" variant="contained"
                                    disabled={name === '' || location === ''}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default WareHousePage