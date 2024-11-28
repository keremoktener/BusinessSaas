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
    IconButton,
    InputLabel,
    Menu,
    Select,
    TextField
} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";

import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import {
    bugStatus,
    fetchBugReportFeedback,
    fetchDeleteBugReport,
    fetchFindAllBugReport,
    fetchFindByIdBugReport, fetchReopenBugCase,
    fetchUpdateStatus
} from "../../store/feature/utilitySlice.tsx";
import {IBugReportResponse} from "../../model/UtilityService/IBugReportResponse.tsx";
import {Autorenew, BugReport, Delete, Feedback, MoreVert} from "@mui/icons-material";


const BugReportPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const {t} = useTranslation()

    //MODAL
    const [openBugStatusModal, setOpenBugStatusModal] = useState(false);
    const [bugReports, setBugReports] = useState<IBugReportResponse[]>([]);
    const [selectedBugStatus, setSelectedBugStatus] = useState('');

    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    //MODAL
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [feedback, setFeecback] = useState('');


    useEffect(() => {
        dispatch(
            fetchFindAllBugReport({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setBugReports(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating, isUpdating, isSaving, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };



    const handleOpenFeedbackModal = () => {
        setOpenFeedbackModal(true);
        setIsUpdating(false)
    };

    const handleFetchDataset = () => {
        dispatch(
            fetchFindAllBugReport({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setBugReports(data.payload.data);
        })
    }


    const handleUpdate = async () => {
        setIsUpdating(true)
        dispatch(fetchUpdateStatus({
            id: selectedRowIds[0],
            bugStatus: selectedBugStatus
        })).then((data) => {
            if (data.payload.message === "Success") {
                setSelectedBugStatus('')
                setOpenBugStatusModal(false);
                Swal.fire({
                    title: t("stockService.updated"),
                    text: t("stockService.successfullyupdated"),
                    icon: "success",
                });
                setIsUpdating(false)
            } else {
                setSelectedBugStatus('')
                setOpenBugStatusModal(false);
                Swal.fire({
                    title: t("swal.error"),
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
                setIsUpdating(false)
            }
        })

    }

    const handleSendFeedback = async () => {
        setIsUpdating(true)
        dispatch(fetchBugReportFeedback({
            id: selectedRowIds[0],
            feedback: feedback
        })).then((data) => {
            if (data.payload.message === "Success") {
                setFeecback('')
                setOpenFeedbackModal(false);
                Swal.fire({
                    title: t("stockService.updated"),
                    text: t("utility.successfullyupdatedandsendmail"),
                    icon: "success",
                });
                setIsUpdating(false)
            } else {
                setFeecback('')
                setOpenFeedbackModal(false);
                Swal.fire({
                    title: t("swal.error"),
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
                setIsUpdating(false)
            }
        })

    }

    const columns: GridColDef[] = [
        {field: "email", headerName: "Email", flex: 1, headerAlign: "center"},
        {field: "subject", headerName: t("utility.subject"), flex: 1, headerAlign: "center"},
        {field: "description", headerName: t("stockService.description"), flex: 1.5, headerAlign: "center"},
        {field: "adminFeedback", headerName: t("utility.adminfeedback"), flex: 1.5, headerAlign: "center"},
        {
            field: "resolvedAt", headerName: t("utility.resolvedat"), flex: 0.75, headerAlign: "center",
            renderCell: (params) => {
                const value = params.value;
                if (value) {
                    const date = new Date(value);
                    return `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`;
                }
                return '-'; // Return default value if date is not available
            }
        },
        {
            field: "bugStatus", headerName: t("utility.bugstatus"), flex: 0.5, headerAlign: "center",
            renderCell: (params) => {
                const value = params.value;
                if (value === "OPEN") {
                    return t("utility.OPEN");
                }
                if (value === "IN_PROGRESS") {
                    return t("utility.IN_PROGRESS");
                }
                if (value === "RESOLVED") {
                    return t("utility.RESOLVED");
                }
                if (value === "REJECTED") {
                    return t("utility.REJECTED");
                }
                if (value === "CLOSED") {
                    return t("utility.CLOSED");
                }

            }
        },
        {
            field: "version",
            headerName: t("utility.version"),
            flex: 0.5,
            headerAlign: "center",

        },
        {
            field: "actions",
            headerName: t("utility.actions"),
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) => <ActionsCell {...params} />,
        },

    ];
    // ActionsCell bileşeni
    const ActionsCell = (params: any) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleOpenBugStatusModal = () => {
            setOpenBugStatusModal(true);
            setIsUpdating(false)
            dispatch(fetchFindByIdBugReport(params.row.id)).then(data => {
                setSelectedBugStatus(data.payload.data.bugStatus)
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
            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteBugReport(params.row.id));

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

        const handleReopenCase = async () => {
            setIsDeleting(true);
            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("utility.youarereopeningcase"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("utility.confirm"),
                cancelButtonText: t("stockService.cancel"),
            });
            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchReopenBugCase(params.row.id));

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

            if (result.isConfirmed) {
                await Swal.fire({
                    title: t("stockService.updated"),
                    text: t("utility.succesfullyupdated"),
                    icon: "success",
                });
            }
            setSelectedRowIds([]);
            setIsDeleting(false);
        }

        return (
            <>
                <IconButton onClick={handleClick}>
                    <MoreVert/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {
                        handleOpenFeedbackModal();
                        setSelectedRowIds([params.row.id])
                    }}>
                        <Feedback sx={{marginRight: 1}}/> {t("utility.sendfeedback")}
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleOpenBugStatusModal();
                        setSelectedRowIds([params.row.id])
                    }}>
                        <BugReport sx={{marginRight: 1}}/> {t("utility.updatebugreport")}
                    </MenuItem>
                    <MenuItem onClick={handleReopenCase}>
                        <Autorenew sx={{marginRight: 1}}/> {t("utility.reopencase")}
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <Delete sx={{marginRight: 1}}/> {t("stockService.delete")}
                    </MenuItem>
                </Menu>

            </>
        );
    };

    const getStatusLabel = (value: string) => {
        switch (value) {
            case 'OPEN':
                return t("utility.OPEN");
            case 'IN_PROGRESS':
                return t("utility.IN_PROGRESS");
            case 'RESOLVED':
                return t("utility.RESOLVED");
            case 'REJECTED':
                return t("utility.REJECTED");
            case 'CLOSED':
                return t("utility.CLOSED");
            default:
                return value; // Varsayılan değer (çevrilmemiş hali)
        }
    };

    return (
        <div style={{height: "auto"}}>
            <TextField
                label={t("utility.searchbydescription")}
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
                rows={bugReports}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                getRowClassName={(params) => {
                    if (params.row.bugStatus === 'OPEN') {
                        return "approved-row";
                    } else if (params.row.bugStatus === 'REJECTED' || params.row.bugStatus === 'CLOSED') {
                        return "unapproved-row";
                    }
                    return "";
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick={true}
                onRowSelectionModelChange={handleRowSelection}
                isRowSelectable={() => false}
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
                        backgroundColor: "#e0f2e9", // Onaylananlar için yeşil arka plan
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0", // Onaylanmayanlar için kırmızı arka plan
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
                <Dialog open={openBugStatusModal} onClose={() => setOpenBugStatusModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{t('utility.updatebugreport')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('utility.bugstatus')}</InputLabel>
                            <Select
                                value={selectedBugStatus}
                                onChange={event => setSelectedBugStatus((event.target.value))}
                                label="BugReports"
                            >
                                {Object.values(bugStatus).map(bug => (
                                    <MenuItem key={bug} value={bug}>
                                        {getStatusLabel(bug)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenBugStatusModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                disabled={selectedBugStatus === ''}>{t('stockService.save')}</Button>

                    </DialogActions>
                </Dialog>


                <Dialog open={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{t('utility.sendfeedback')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.description')}
                            name="description"
                            value={feedback}
                            onChange={e => setFeecback(e.target.value)}
                            required
                            fullWidth
                            multiline
                            rows={10}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenFeedbackModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        <Button onClick={() => handleSendFeedback()} color="success" variant="contained"
                                disabled={feedback === ''}>{t('stockService.save')}</Button>

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default BugReportPage