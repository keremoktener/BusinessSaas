import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar,} from "@mui/x-data-grid";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {
    fetchDeleteSupplier,
    fetchFindAllSupplier,
    fetchFindByIdSupplier,
    fetchSaveSupplier,
    fetchUpdateSupplier
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {ISupplier} from "../../../model/StockService/ISupplier.tsx";


const SupplierPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()
    //MODAL
    const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(
            fetchFindAllSupplier({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setSuppliers(data.payload.data);
        })
    }, [dispatch, searchText, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOpenAddSupplierModal = () => {
        setOpenAddSupplierModal(true);
        setIsUpdating(false)
    };

    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const handleOpenUpdateModal = async () => {
        setOpenAddSupplierModal(true);
        setIsUpdating(true)

        dispatch(fetchFindByIdSupplier(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name)
            setSurname(data.payload.data.surname)
            setEmail(data.payload.data.email)
            setContactInfo(data.payload.data.contactInfo)
            setAddress(data.payload.data.address)
            setNotes(data.payload.data.notes)
        })
    }
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
            const selectedSupplier = suppliers.find(
                (selectedSupplier) => selectedSupplier.id === id
            );
            if (!selectedSupplier) continue;


            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteSupplier(selectedSupplier.id));

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

    const handleUpdate = async () => {
        dispatch(fetchUpdateSupplier({
            id: selectedRowIds[0],
            name: name,
            surname: surname,
            contactInfo: contactInfo,
            address: address,
            notes: notes
        })).then(() => {
            setName('')
            setSurname('')
            setEmail('')
            setContactInfo('')
            setAddress('')
            setNotes('')
            setIsUpdating(false)
            setOpenAddSupplierModal(false);
            Swal.fire({
                title: t("stockService.updated"),
                text: t("stockService.successfullyupdated"),
                icon: "success",
            });
        })
    }

    const handleSaveSupplier = async () => {
        setIsSaving(true)
        dispatch(fetchSaveSupplier({
            name: name,
            surname: surname,
            email: email,
            contactInfo: contactInfo,
            address: address,
            notes: notes,
        }))
            .then((data) => {
                if (data.payload.message === "Success") {
                    setName('')
                    setSurname('')
                    setEmail('')
                    setContactInfo('')
                    setAddress('')
                    setNotes('')
                    setOpenAddSupplierModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                } else {

                    setName('')
                    setSurname('')
                    setEmail('')
                    setContactInfo('')
                    setAddress('')
                    setNotes('')
                    setOpenAddSupplierModal(false);
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
    const columns: GridColDef[] = [
        {field: "name", headerName: t("authentication.name"), flex: 1, headerAlign: "center"},
        {field: "surname", headerName: t("authentication.surname"), flex: 1, headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 1.5, headerAlign: "center"},
        {field: "contactInfo", headerName: t("stockService.contactinfo"), flex: 1.5, headerAlign: "center"},
        {field: "address", headerName: t("stockService.address"), flex: 2, headerAlign: "center"},
        {field: "notes", headerName: t("stockService.notes"), flex: 2, headerAlign: "center"},
    ];


    return (
        <div style={{height: "auto"}}>
            {/*//TODO I WILL CHANGE THIS SEARCH METHOD LATER*/}
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
                rows={suppliers}
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

                <Dialog open={openAddSupplierModal} onClose={() => setOpenAddSupplierModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addsupplier')}</DialogTitle>
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
                            label={t('authentication.surname')}
                            name="surname"
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label="Email"
                            name="email"
                            disabled={isUpdating}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.contactinfo')}
                            name="contactInfo"
                            value={contactInfo}
                            onChange={e => setContactInfo(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.address')}
                            name="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.notes')}
                            name="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddSupplierModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={name === '' || surname === '' || contactInfo === '' || address === '' || notes === ''}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveSupplier()} color="success" variant="contained"
                                    disabled={name === '' || surname === '' || email === '' || contactInfo === '' || address === '' || notes === ''}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default SupplierPage