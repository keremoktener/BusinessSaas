import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    InputLabel,
    Slider,
    SliderValueLabel,
    TextField,
    Toolbar,
    IconButton,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    SelectChangeEvent

} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../store";
import {
    fetchFindAllOpportunity,
    fetchSaveOpportunity,
    fetchUpdateOpportunity,
    fetchFindOpportunityById,
    fetchDeleteOpportunity,
    fetchGetDetailsOpportunity,
    fetchFindAllCustomerForOpportunity,
    fetchSaveCustomerOpportunity
} from "../../store/feature/crmSlice.tsx";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { ICrmOpportunity } from "../../model/ICrmOpportunity.tsx";
import { ICrmOpportunityDetail } from "../../model/ICrmOpportunityDetail.tsx";


const OpportunityPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const opportunities = useAppSelector((state) => state.crmSlice.opportunityList);
    const opportunityDetail = useAppSelector((state) => state.crmSlice.opportunityDetail);
    const costumers = useAppSelector((state) => state.crmSlice.customerList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation();

    // modal
    const [openAddOpportunityModal, setOpenAddOpportunityModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);
    const [stage, setStage] = useState('');
    const [probability, setProbability] = useState(0.0);
    const [status, setStatus] = useState('');
    const [customerList, setCustomerList] = useState([]); //y

    const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<ICrmOpportunity | ICrmOpportunityDetail>();

    const [openCustomerListPopup, setOpenCustomerListPopup] = useState(false);


    const [selectedRowIdsCustomer, setSelectedRowIdsCustomer] = useState<number[]>([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]); //y
    const [customersToRemove, setCustomersToRemove] = useState<number[]>([]); //y








    useEffect(() => {
        dispatch(fetchFindAllOpportunity({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isActivating, isSaving, isUpdating, isDeleting]);

    useEffect(() => {
        dispatch(fetchFindAllCustomerForOpportunity({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }
    const handleRowSelectionCustomer = (newSelectionModel2: GridRowSelectionModel) => {
        setSelectedRowIdsCustomer(newSelectionModel2 as number[]);
    }

    const handleDetailsClick = () => {
        if (!selectedRowIds[0]) {
            console.error("Geçerli bir ID bulunamadı");
            return;
        }

        dispatch(fetchGetDetailsOpportunity(selectedRowIds[0]))
            .then((data) => {
                setSelectedOpportunity(data.payload.data);
                setOpenDetailsPopup(true);
            })
            .catch((error) => {
                console.error("Hata:", error);
            });
    };



    // const handleCloseDetailsPopup = () => {
    //     setOpenDetailsPopup(false);
    //     setSelectedOpportunity(null);
    // };

    const handleOpenOpportunityModal = () => {
        setOpenAddOpportunityModal(true);
    }


    const handleCustomerListClick = () => {
        dispatch(fetchFindAllCustomerForOpportunity({ searchText: '', page: 0, size: 1000 }));
        setOpenCustomerListPopup(true);
    }

    const handleSaveOpportunity = () => {
        setIsSaving(true);  // Kaydetme işlemi başladığında isSaving true yapılır
        dispatch(fetchSaveOpportunity({
            name: name,
            description: description,
            value: value,
            stage: stage,
            probability: probability
        })).then((data) => {
            if (data.payload.message === "Opportunity saved successfully") {

                setName('');
                setDescription('');
                setValue(0);
                setStage('');
                setProbability(0.0);
                setOpenAddOpportunityModal(false);


                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.added_opportunity"),
                    icon: "success",
                }).then(() => {
                    setIsSaving(false);
                });
            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                }).then(() => {
                    setIsSaving(false);
                });
            }
        }).catch((error) => {

            setOpenAddOpportunityModal(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            }).then(() => {
                setIsSaving(false);
            });
        });
    };


    const handleSaveCustomerFromOpportunity = () => {
        if (selectedRowIdsCustomer.length === 0) {
            Swal.fire({
                title: t("swal.warning"),
                text: t("crmService.select-customer"),
                icon: "warning",
            });
            return;
        }

        setIsUpdating(true);

        const saveOpportunityPromises = [];

        for (const id of selectedRowIdsCustomer) {
            const selectedCustomer = costumers.find((customer) => customer.id === id);

            if (!selectedCustomer) continue;


            saveOpportunityPromises.push(
                dispatch(fetchSaveCustomerOpportunity({
                    id: selectedRowIds[0],
                    customers: [id]
                }))
            );
        }

        Promise.all(saveOpportunityPromises)
            .then((responses) => {
                let successCount = 0;
                responses.forEach((data) => {
                    if (data.payload?.message === "Opportunity saved successfully") {
                        successCount++;
                    }
                });

                if (successCount === selectedRowIdsCustomer.length) {
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.added"),
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: t("swal.error"),
                        text: t("crmService.non-added"),
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                }
            })
            .catch((error) => {
                console.error("Error saving opportunity:", error);
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.error-occurred"),
                    icon: "error",
                });
            })
            .finally(() => {
                setSelectedRowIdsCustomer([]);
                setIsUpdating(false);
            });
    };


    const handleOpenUpdateModal = async () => {
        setOpenAddOpportunityModal(true);
        setIsUpdating(true);

        dispatch(fetchFindOpportunityById(selectedRowIds[0]))
            .then((result: any) => {
                const opportunity = result.payload.data;
                setName(opportunity.name);
                setDescription(opportunity.description);
                setValue(opportunity.value);
                setStage(opportunity.stage);
                setProbability(opportunity.probability);
                setCustomerList(opportunity.customers);
                setSelectedCustomerIds(opportunity.customers.map((customer) => customer.id));
            })
            .catch((error) => {
                console.error('Error fetching opportunity details:', error);
            });
    };

    const handleCustomerChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];

        setSelectedCustomerIds(value);

        const newCustomersToRemove = customerList
            .filter(customer => !value.includes(customer.id))
            .map(customer => customer.id);

        setCustomersToRemove(newCustomersToRemove);
    };

    const handleUpdateOpportunity = async () => {
        dispatch(fetchUpdateOpportunity({
            id: selectedRowIds[0],
            name: name,
            description: description,
            value: value,
            stage: stage,
            probability: probability,
            customers: selectedCustomerIds, 
            customersToRemove: customersToRemove, 
        }))
            .then(() => {
                setName('');
                setDescription('');
                setValue(0);
                setStage('');
                setProbability(0.0);
                setOpenAddOpportunityModal(false);
                setIsUpdating(false);

                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.updated_opportunity"),
                    icon: "success",
                });
            })
            .catch((error) => {
                setOpenAddOpportunityModal(false);
                setIsUpdating(false);
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.error-occurred"),
                    icon: "error",
                });
            });
    };



    const handleDeleteOpportunity = async () => {
        if (selectedRowIds.length === 0) return;

        setIsDeleting(true);
        try {

            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("crmService.deleting"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("crmService.delete"),
                cancelButtonText: t("crmService.cancel"),
                html: `<input type="checkbox" id="confirm-checkbox" />
                   <label for="confirm-checkbox">${t("crmService.confirmDelete")}</label>`,
                preConfirm: () => {
                    const popup = Swal.getPopup();
                    if (popup) {
                        const checkbox = popup.querySelector('#confirm-checkbox') as HTMLInputElement;
                        if (checkbox && !checkbox.checked) {
                            Swal.showValidationMessage(t("crmService.checkboxRequired"));
                            return false;
                        }
                        return true;
                    }
                }
            });

            if (result.isConfirmed) {
                let hasError = false;
                for (const id of selectedRowIds) {
                    const selectedOpportunity = opportunities.find(
                        (selectedOpportunity) => selectedOpportunity.id === id
                    );
                    if (!selectedOpportunity) continue;

                    const data = await dispatch(fetchDeleteOpportunity(selectedOpportunity.id));

                    if (data.payload.message !== "Opportunity deleted successfully") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        hasError = true;
                        break;
                    }
                }

                if (!hasError) {
                    await Swal.fire({
                        title: t("crmService.deleted"),
                        text: t("crmService.successfullydeleted"),
                        icon: "success",
                    });

                    setSelectedRowIds([]);
                }
            }
        } catch (error) {
            localStorage.removeItem("token");
        } finally {
            setIsDeleting(false);
        }
    };





    const customerColumns: GridColDef[] = [
        { field: "firstName", headerName: t("crmService.firstName"), flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: t("crmService.lastName"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: t("crmService.email"), flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: t("crmService.phone"), flex: 1.5, headerAlign: "center" },
        { field: "address", headerName: t("crmService.address"), flex: 1.5, headerAlign: "center" },

    ]


    const columns: GridColDef[] = [

        { field: "name", headerName: t("crmService.name"), flex: 1.5, headerAlign: "center" },
        { field: "value", headerName: t("crmService.value"), flex: 1.5, headerAlign: "center" },
        { field: "stage", headerName: t("crmService.stage"), flex: 1.5, headerAlign: "center" },
        { field: "probability", headerName: t("crmService.probability"), flex: 1.5, headerAlign: "center" },
        {
            field: "details", headerName: t("crmService.details"), flex: 1.5, headerAlign: "center", renderCell: (params) => (
                <IconButton onClick={handleDetailsClick}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ]

    return (
        <div style={{ height: "auto" }}>

            <TextField
                label={t("crmService.searchbyname")}
                variant="outlined"
                onChange={(event) => {
                    setSearchText(event.target.value);
                }}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />

            <DataGrid
                rows={opportunities}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    }
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
                        onClick={handleOpenOpportunityModal}
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
                        {t("crmService.make-opportunity")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateModal}
                        variant="contained"
                        color="primary"

                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("crmService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeleteOpportunity}
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
                        {t("crmService.delete")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleCustomerListClick}
                        variant="contained"
                        color="primary"

                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("crmService.add_customer")}
                    </Button>
                </Grid>
                <Dialog open={openCustomerListPopup} onClose={() => setOpenCustomerListPopup(false)} fullWidth maxWidth='sm'>
                    <DialogTitle style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "rgba(61,155,255,1)" }} >{t("crmService.customer_list")}</DialogTitle>
                    <DialogContent>
                        <DataGrid
                            rows={costumers}
                            columns={customerColumns}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={handleRowSelectionCustomer}
                            autoHeight
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { handleSaveCustomerFromOpportunity(); setOpenCustomerListPopup(false); setOpenDetailsPopup(false) }} color="success" variant="contained">
                            {t("crmService.add")}
                        </Button>
                        <Button onClick={() => { setOpenCustomerListPopup(false); setOpenDetailsPopup(false) }} color="error" variant="contained">
                            {t("crmService.cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDetailsPopup} onClose={() => setOpenDetailsPopup(false)} fullWidth maxWidth='sm'>
                    <DialogTitle style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "rgba(61,155,255,1)" }} >
                        {t("crmService.details")}
                    </DialogTitle>
                    <DialogContent>
                        {selectedOpportunity ? (
                            <div>
                                <h2>{t("crmService.opportunity_details")}</h2>
                                <p><strong>{t("crmService.name")}:</strong> {selectedOpportunity.name}</p>
                                <p><strong>{t("crmService.description")}:</strong> {selectedOpportunity.description}</p>
                                <p><strong>{t("crmService.value")}:</strong> {selectedOpportunity.value}</p>
                                <p><strong>{t("crmService.stage")}:</strong> {selectedOpportunity.stage}</p>
                                <p><strong>{t("crmService.probability")}:</strong> {selectedOpportunity.probability !== undefined ? selectedOpportunity.probability.toString() : "N/A"}</p>
                                <h2>{t("crmService.customer")}:</h2>
                                {selectedOpportunity.customers && selectedOpportunity.customers.length > 0 ? (
                                    selectedOpportunity.customers.map((customer: any, index) => (
                                        <div key={index}>
                                            <p>
                                                <strong>{t("crmService.firstName")} {t("crmService.lastName")} :</strong> {customer.firstName || t("crmService.no-name")} {customer.lastName || t("crmService.no-name")}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p>{t("crmService.no-founded-customer")}</p>
                                )}
                            </div>
                        ) : (
                            <p>{t("crmService.loading")}</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetailsPopup(false)} color="primary" variant="contained">
                            {t("crmService.cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openAddOpportunityModal} onClose={() => setOpenAddOpportunityModal(false)} fullWidth
                    maxWidth='lg'>
                    <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_opportunity')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('crmService.name')}
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('crmService.description')}
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('crmService.value')}
                            name="value"
                            value={value}
                            onChange={e => setValue(parseInt(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('crmService.stage')}
                            name="stage"
                            value={stage}
                            onChange={e => setStage(e.target?.value)}
                            required
                            fullWidth
                        />
                        <Grid item xs={12}>
                            <InputLabel sx={{ marginTop: '15px' }}>{t('crmService.probability')}</InputLabel>
                            <Slider
                                name="probability"
                                value={probability}
                                onChange={(e, newValue) => {
                                    if (typeof newValue === 'number') {
                                        setProbability(newValue);
                                    }
                                }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={100}
                            />
                        </Grid>
                        {/* y */}
                        {isUpdating && (
                            <Grid item xs={12}>
                                <InputLabel sx={{ marginTop: '15px' }}>{t('crmService.customer')}</InputLabel>
                                <InputLabel sx={{ marginTop: '15px' }}>{t('crmService.unchecked-customer')}</InputLabel>
                                <Select
                                    sx={{ marginTop: '15px', width: '100%' }}
                                    multiple
                                    value={selectedCustomerIds}
                                    onChange={handleCustomerChange}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected.length === 0) return t('crmService.select-customer'); 
                                        return selected
                                            .map((id) => {
                                                const customer = customerList.find((customer) => customer.id === id);
                                                return customer ? `${customer.firstName} ${customer.lastName}` : '';
                                            })
                                            .join(', ');
                                    }}
                                >
                                    {customerList.map((customer) => (
                                        <MenuItem key={customer.id} value={customer.id}>
                                            <Checkbox checked={selectedCustomerIds.includes(customer.id)} />
                                            <ListItemText primary={`${customer.firstName} ${customer.lastName}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        )}


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddOpportunityModal(false);
                            setIsUpdating(false);
                            setName('');
                            setDescription('');
                            setValue(0);
                            setStage('');
                            setProbability(0);
                        }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                        {isUpdating ?
                            <Button onClick={() => handleUpdateOpportunity()} color="success" variant="contained"
                                disabled={name === '' || description === '' || value === 0 || stage === '' || probability === 0}>{t('crmService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveOpportunity()} color="success" variant="contained"
                                disabled={name === '' || description === '' || value === 0 || stage === '' || probability === 0}>{t('crmService.save')}</Button>}


                    </DialogActions>
                </Dialog>
            </Grid>


        </div >
    );

}
export default OpportunityPage;
