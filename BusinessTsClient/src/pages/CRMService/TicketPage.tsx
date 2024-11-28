import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton,
    TextField

} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {
    fetchFindAllTicket,
    fetchUpdateTicket,
    fetchDeleteTicket,
    fetchFindTicketById,
    fetchSaveTicket,
    fetchGetDetailsTicket,
    fetchSaveCustomerTicket, fetchFindAllCustomerForOpportunity
} from "../../store/feature/crmSlice.tsx";
import {useTranslation} from "react-i18next";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {ICrmTicket} from "../../model/ICrmTicket.tsx";
import {ICrmTicketDetail} from "../../model/ICrmTicketDetail.tsx";

const TicketPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    const tickets = useAppSelector((state) => state.crmSlice.ticketList);
    const costumers = useAppSelector((state) => state.crmSlice.customerList);
    const ticketDetail = useAppSelector((state) => state.crmSlice.ticketDetail);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation();


    //modal
    const [openAddTicketModal, setOpenAddTicketModel] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [ticketStatus, setTicketStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs());
    const [closedDate, setClosedDate] = useState<Dayjs | null>(dayjs());

    const [selectedTicket, setSelectedTicket] = useState<ICrmTicket | ICrmTicketDetail>();
    const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
    const [openCustomerListPopup, setOpenCustomerListPopup] = useState(false);
    const [selectedRowIdsCustomer, setSelectedRowIdsCustomer] = useState<number[]>([]);

    useEffect(() => {
        dispatch(fetchFindAllTicket({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);

    };
    const handleRowSelectionCustomer = (newSelectionModel2: GridRowSelectionModel) => {
        setSelectedRowIdsCustomer(newSelectionModel2 as number[]);
        console.log(selectedRowIdsCustomer);
    }

    const handleDeailsClick = () => {
        if (!selectedRowIds[0]) {
            console.error("Geçerli bir ID bulunamadı");
            return;
        }
        dispatch(fetchGetDetailsTicket(selectedRowIds[0])).then((data) => {
            setSelectedTicket(data.payload.data);
            setOpenDetailsPopup(true);
        }).catch((error) => {
            console.error("Hata:", error);
        })
    }

    const handleOpenAddTicketModal = () => {
        setOpenAddTicketModel(true);
    }

    const handleCustomerListClick = () => {
        dispatch(fetchFindAllCustomerForOpportunity({searchText: '', page: 0, size: 1000}));
        setOpenCustomerListPopup(true);
    }


    const handleSaveTicket = () => {
        setIsSaving(true);
        dispatch(fetchSaveTicket({
            subject: subject,
            description: description,
            ticketStatus: ticketStatus,
            priority: priority,
            createdDate: createdDate?.toDate() || new Date(),
            closedDate: closedDate?.toDate() || new Date(),
        })).then((data) => {
            if (data.payload.message === "Ticket saved successfully") {
                setSubject('');
                setDescription('');
                setTicketStatus('');
                setPriority('');
                setCreatedDate(dayjs());
                setClosedDate(dayjs());
                setOpenAddTicketModel(false);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.added_ticket"),
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
            }
            setIsSaving(false);
        }).catch((error) => {
            setOpenAddTicketModel(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
            setIsSaving(false);
        });

    };
    const handleSaveCustomerFromTicket = () => {
        if (selectedRowIdsCustomer.length === 0) return;

        setIsUpdating(true);

        const saveTicketPromises = [];

        for (const id of selectedRowIdsCustomer) {
            const selectedCustomer = costumers.find(
                (selectedCustomer) => selectedCustomer.id === id
            );

            if (!selectedCustomer) continue;

            saveTicketPromises.push(
                dispatch(fetchSaveCustomerTicket({
                    id: selectedRowIds[0],
                    customers: selectedRowIdsCustomer
                }))
            );
        }

        setSelectedRowIdsCustomer([]);

        Promise.all(saveTicketPromises)
            .then((responses)=> {
            let successCount = 0;
            responses.forEach((data) => {
                if (data.payload?.message === "Ticket saved successfully") {
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

            setIsUpdating(false);
        }).catch((error) => {
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
            setIsUpdating(false);
        });
    };


    const handleOpenUpdateModal = async () => {
        setOpenAddTicketModel(true);
        setIsUpdating(true);

        dispatch(fetchFindTicketById(selectedRowIds[0])).then((data) => {
            setSubject(data.payload.data.subject);
            setDescription(data.payload.data.description);
            setTicketStatus(data.payload.data.ticketStatus);
            setPriority(data.payload.data.priority);
            setCreatedDate(dayjs(data.payload.data.createdDate));
            setClosedDate(dayjs(data.payload.data.closedDate));
        })
    }

    const handleUpdateTicket = async () => {
        dispatch(fetchUpdateTicket({
            id: selectedRowIds[0],
            subject: subject,
            description: description,
            ticketStatus: ticketStatus,
            priority: priority,
            createdDate: createdDate?.toDate() || new Date(),
            closedDate: closedDate?.toDate() || new Date()
        })).then(() => {
            setOpenAddTicketModel(false);
            setIsUpdating(false);
            setSubject('');
            setDescription('');
            setTicketStatus('');
            setPriority('');
            setCreatedDate(dayjs());
            setClosedDate(dayjs());
            Swal.fire({
                title: t("swal.success"),
                text: t("crmService.updated_ticket"),
                icon: "success",
            });

        }).catch((error) => {
            setOpenAddTicketModel(false);
            setIsUpdating(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
        })
    };
    const handleDeleteTicket = async () => {
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
                    const selectedTicket = tickets.find(
                        (selectedTicket) => selectedTicket.id === id
                    );
                    if (!selectedTicket) continue;

                    const data = await dispatch(fetchDeleteTicket(selectedTicket.id));

                    if (data.payload.message !== "Ticket deleted successfully") {
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
            localStorage.removeItem("token")
        } finally {
            setIsDeleting(false);
        }
    };

    const handleShowDetails = () => {
        if (!selectedRowIds[0]) {
            console.error("Gecerli Id bulunamadi")
            return;
        }

        dispatch(fetchFindTicketById(selectedRowIds[0])).then((data) => {
            setSelectedTicket(data.payload.data);
            setOpenDetailsPopup(true);
            console.log(data.payload.data)
        }).catch((error) => {
            console.error("Hata:", error);
        });
    };

    const customerColumns: GridColDef[] = [
        { field: "firstName", headerName: t("crmService.firstName"), flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: t("crmService.lastName"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: t("crmService.email"), flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: t("crmService.phone"), flex: 1.5, headerAlign: "center" },
        { field: "address", headerName: t("crmService.address"), flex: 1.5, headerAlign: "center" },

    ]


    const columns: GridColDef[] = [

        {field: "subject", headerName: t("crmService.subject"), flex: 1.5, headerAlign: "center"},
        {field: "priority", headerName: t("crmService.priority"), flex: 1.5, headerAlign: "center"},
        {field: "ticketStatus", headerName: t("crmService.ticket_status"), headerAlign: "center", flex: 1},
        {field: "createdDate", headerName: t("crmService.created_date"), headerAlign: "center", flex: 1},
        {field: "closedDate", headerName: t("crmService.closed_date"), headerAlign: "center", flex: 1},
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

    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <TextField
                    label={t("crmService.search-by-subject")}
                    variant="outlined"
                    onChange={(event) => {
                        setSearchText(event.target.value);
                    }}
                    value={searchText}
                    style={{marginBottom: "1%", marginTop: "1%"}}
                    fullWidth
                    inputProps={{maxLength: 50}}
                />

                <DataGrid
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    rows={tickets}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 1, pageSize: 5},
                        }
                    }}
                    // getRowClassName={(params)=>
                    //     params.row.isExpenditureApproved
                    //         ? "approved-row"
                    //         : "unapproved-row"
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
                        },
                        // "& .approved-row": {
                        //     backgroundColor: "rgba(77, 148, 255,1)",

                        // },
                        // "& .unapproved-row": {
                        //     backgroundColor: "rgba(242, 242, 242,1)",
                        // },

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
                            onClick={handleOpenAddTicketModal}
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
                            {t("crmService.make-ticket")}
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
                            onClick={handleDeleteTicket}
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
                    <Dialog open={openDetailsPopup} onClose={() => setOpenDetailsPopup(false)} fullWidth maxWidth='xs'>
                        <DialogTitle
                            style={{textAlign: "center", fontWeight: "bold", backgroundColor: "rgba(61,155,255,1)"}}>
                            {selectedTicket ? (
                                <div>
                                    <p><strong>{selectedTicket.subject}</strong></p>
                                </div>
                            ) : (
                                <p>{t("crmService.loading")}</p>
                            )}
                        </DialogTitle>
                        <DialogContent>
                            {selectedTicket ? (
                                <div style={{marginLeft: '10px'}}>
                                    <p><strong>{t("crmService.subject")}:</strong> {selectedTicket.subject}</p>
                                    <p><strong>{t("crmService.description")}:</strong> {selectedTicket.description}</p>
                                    <p><strong>{t("crmService.priority")}:</strong> {selectedTicket.priority}</p>
                                    <p><strong>{t("crmService.status")}:</strong> {selectedTicket.status}</p>
                                    <p>
                                        <strong>{t("crmService.created_date")}:</strong> {selectedTicket.createdDate.toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>{t("crmService.closed_date")}:</strong> {selectedTicket.closedDate.toLocaleString()}
                                    </p>
                                    <h2>{t("crmService.customer")}:</h2>
                                    {selectedTicket.customers && selectedTicket.customers.length > 0 ? (
                                        selectedTicket.customers.map((customer: any, index) => (
                                            <div key={index}>
                                                <p>
                                                    <strong>{t("crmService.firstName")} {t("crmService.lastName")} :</strong> {customer.firstName || t("crmService.no-name")} {customer.lastName || t("crmService.no-name")}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>{t("crmService.no-founded-ticket-customer")}</p>
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
                            <Button onClick={() => { handleSaveCustomerFromTicket(); setOpenCustomerListPopup(false); setOpenDetailsPopup(false) }} color="success" variant="contained">
                                {t("crmService.add")}
                            </Button>
                            <Button onClick={() => { setOpenCustomerListPopup(false); setOpenDetailsPopup(false) }} color="error" variant="contained">
                                {t("crmService.cancel")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openAddTicketModal} onClose={() => setOpenAddTicketModel(false)} fullWidth
                            maxWidth='lg'>
                        <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_ticket')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.subject')}
                                name="subject"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.description')}
                                name="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.priority')}
                                name="priority"
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.ticket_status')}
                                name="ticketStatus"
                                value={ticketStatus}
                                onChange={e => setTicketStatus(e.target.value)}
                                required
                                fullWidth
                            />
                            <DatePicker
                                label={t('crmService.created_date')}
                                value={createdDate}
                                onChange={(newDate) => setCreatedDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                            <DatePicker
                                label={t('crmService.closed_date')}
                                value={closedDate}
                                onChange={(newDate) => setClosedDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setSubject('');
                                setDescription('');
                                setTicketStatus('');
                                setPriority('');
                                setCreatedDate(dayjs());
                                setClosedDate(dayjs());
                                setOpenAddTicketModel(false);

                            }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                            {isUpdating?
                                <Button onClick={() => handleUpdateTicket()} color="success" variant="contained"
                                        disabled={subject === '' || description === '' || ticketStatus === '' || priority === '' || createdDate === null || closedDate === null}>{t('crmService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveTicket()} color="success" variant="contained"
                                    disabled={subject === '' || description === '' || ticketStatus === '' || priority === '' || createdDate === null || closedDate === null }>{t('crmService.save')}</Button>}

                        </DialogActions>
                    </Dialog>
                </Grid>


            </div>
        </LocalizationProvider>


    );
}
export default TicketPage;