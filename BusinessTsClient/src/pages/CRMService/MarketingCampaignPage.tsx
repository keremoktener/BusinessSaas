import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField
} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {
    fetchDeleteMarketingCampaign,
    fetchFindAllMarketingCampaign,
    fetchFindMarketingCampaignById,
    fetchSaveMarketingCampaign,
    fetchUpdateMarketingCampaign
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import dayjs, {Dayjs} from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {ICrmMarketingCampaign} from "../../model/ICrmMarketingCampaign.tsx";

const MarketingCampaignPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const marketingCampaigns = useAppSelector((state) => state.crmSlice.marketingCampaignList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [openAddMarketingCampaignModal, setOpenAddMarketingCampaignModal] = useState(false);
    const {t} = useTranslation();

    const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
    const [selectedMarketingCampaign, setSelectedMarketingCampaign] = useState<ICrmMarketingCampaign | null>(null);


    //modal
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [budget, setBudget] = useState<number>(0);


    useEffect(() => {
        dispatch(fetchFindAllMarketingCampaign({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenMarketingCampaignModal = () => {
        setOpenAddMarketingCampaignModal(true);
    }
    const handleSaveMarketingCampaign = () => {
        setIsSaving(true);
        dispatch(fetchSaveMarketingCampaign({
            name: name,
            description: description,
            startDate: startDate?.toDate() || new Date(),
            endDate: endDate?.toDate() || new Date(),
            budget: budget
        })).then((data) => {
            if (data.payload.message === "Marketing campaign saved successfully") {
                setName('');
                setDescription('');
                setStartDate(dayjs());
                setEndDate(dayjs());
                setBudget(0);
                setOpenAddMarketingCampaignModal(false);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.successfullyadded"),
                    icon: "success",
                });
                setIsSaving(false);
            }
        });
    }
    const handleOpenUpdateModal = async () => {
        setOpenAddMarketingCampaignModal(true);
        setIsUpdating(true);

        dispatch(fetchFindMarketingCampaignById(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name);
            setDescription(data.payload.data.description);
            setStartDate(dayjs(data.payload.data.startDate));
            setEndDate(dayjs(data.payload.data.endDate));
            setBudget(data.payload.data.budget);
        })
    }
    const handleUpdateMarketingCampaign = async () => {
        dispatch(fetchUpdateMarketingCampaign({
            id: selectedRowIds[0],
            name: name,
            description: description,
            startDate: startDate?.toDate() || new Date(),
            endDate: endDate?.toDate() || new Date(),
            budget: budget
        })).then(() => {
            setOpenAddMarketingCampaignModal(false);
            setIsUpdating(false);
            setName('');
            setDescription('');
            setStartDate(dayjs());
            setEndDate(dayjs());
            setBudget(0);
            Swal.fire({
                title: t("swal.success"),
                text: t("crmService.successfullyupdated"),
                icon: "success",
            });
            setIsUpdating(false);
        }).catch((error) => {
            setOpenAddMarketingCampaignModal(false);
            setIsUpdating(false);
            setName('');
            setDescription('');
            setStartDate(dayjs());
            setEndDate(dayjs());
            setBudget(0);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
        });
    };
    const handleDeleteMarketingCampaign = async () => {
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
                    const selectedMarketingCampaign = marketingCampaigns.find(
                        (selectedMarketingCampaign) => selectedMarketingCampaign.id === id
                    );
                    if (!selectedMarketingCampaign) continue;

                    const data = await dispatch(fetchDeleteMarketingCampaign(selectedMarketingCampaign.id));


                    if (data.payload.message !== "Marketing campaign deleted successfully") {
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

    const handleShowDetails = () => {
        if (!selectedRowIds[0]) {
            console.error("Geçerli bir ID bulunamadı");
            return;
        }

        dispatch(fetchFindMarketingCampaignById(selectedRowIds[0])).then((data) => {
            setSelectedMarketingCampaign(data.payload.data);
            setOpenDetailsPopup(true);
        }).catch((error) => {
            console.error("Hata:", error);
        });
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <TextField
                    label={t("crmService.searchbyname")}
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
                    rows={marketingCampaigns}
                    columns={[
                        {field: "name", headerName: t("crmService.name"), flex: 1.5, headerAlign: "center"},
                        {field: "startDate", headerName: t("crmService.startDate"), flex: 1.5, headerAlign: "center"},
                        {field: "endDate", headerName: t("crmService.endDate"), flex: 1.5, headerAlign: "center"},
                        {field: "budget", headerName: t("crmService.budget"), flex: 1.5, headerAlign: "center"},
                        {
                            field: "details",
                            headerName: t("crmService.details"),
                            flex: 1.5,
                            headerAlign: "center",
                            renderCell: (params) => (
                                <IconButton
                                    aria-label="show-details"
                                    onClick={() => handleShowDetails()}
                                >
                                    <VisibilityIcon/>
                                </IconButton>
                            ),
                        },
                    ]}
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
                            onClick={handleOpenMarketingCampaignModal}
                            variant="contained"
                            color="success"
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {t("crmService.add")}
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
                            onClick={handleDeleteMarketingCampaign}
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
                    <Dialog open={openDetailsPopup} onClose={() => setOpenDetailsPopup(false)} fullWidth maxWidth='xs'>
                        <DialogTitle
                            style={{textAlign: "center", fontWeight: "bold", backgroundColor: "rgba(61,155,255,1)"}}>
                            {selectedMarketingCampaign ? (
                                <div>
                                    <p><strong>{selectedMarketingCampaign.name}</strong></p>
                                </div>
                            ) : (
                                <p>{t("crmService.loading")}</p>
                            )}
                        </DialogTitle>

                        <DialogContent>
                            {selectedMarketingCampaign ? (
                                <div>
                                    <p>{t("crmService.name")}: {selectedMarketingCampaign.name}</p>
                                    <p>{t("crmService.description")}: {selectedMarketingCampaign.description}</p>
                                    <p>{t("crmService.startDate")}: {selectedMarketingCampaign.startDate.toLocaleString()}</p>
                                    <p>{t("crmService.endDate")}: {selectedMarketingCampaign.endDate.toLocaleString()}</p>
                                    <p>{t("crmService.budget")}: {selectedMarketingCampaign.budget}</p>
                                    <p>{t("crmService.status")}: {selectedMarketingCampaign.status}</p>

                                </div>
                            ) : (
                                <p>{t("crmService.loading")}</p>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetailsPopup(false)} color="primary" variant="contained">
                                {t("crmService.close")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openAddMarketingCampaignModal} onClose={() => setOpenAddMarketingCampaignModal(false)}
                            fullWidth maxWidth='sm'>
                        <DialogTitle>{t('crmService.add_marketing_campaign')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.name')}
                                name="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.description')}
                                name="Description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                fullWidth
                            />
                            <DatePicker
                                label={t('crmService.startDate')}
                                value={startDate}
                                onChange={(newDate) => setStartDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                            <DatePicker
                                label={t('crmService.endDate')}
                                value={endDate}
                                onChange={(newDate) => setEndDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.budget')}
                                name="budget"
                                value={budget}
                                onChange={e => setBudget(parseInt(e.target.value))}
                                required
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setOpenAddMarketingCampaignModal(false);
                                setIsUpdating(false);
                                setName('');
                                setDescription('');
                                setStartDate(dayjs());
                                setEndDate(dayjs());
                                setBudget(0);
                            }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                            {isUpdating ?
                                <Button onClick={handleUpdateMarketingCampaign} color="primary" variant="contained"
                                        disabled={name === '' || description === '' || startDate === null || endDate === null || budget === 0}>{t('crmService.update')}</Button>
                                :
                                <Button onClick={handleSaveMarketingCampaign} color="success" variant="contained"
                                        disabled={name === '' || description === '' || startDate === null || endDate === null || budget === 0}>{t('crmService.save')}</Button>}
                        </DialogActions>
                    </Dialog>
                </Grid>
            </div>
        </LocalizationProvider>
    );
}
export default MarketingCampaignPage;
