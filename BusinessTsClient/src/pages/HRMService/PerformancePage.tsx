import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    TextField

} from "@mui/material";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../store/index.tsx";

import {
    fetchFindAllPerformance,
    fetchSavePerformance,
    fetchDeletePerformance,
    fetchUpdatePerformance,
    fetchFindByIdPerformance
} from "../../store/feature/hrmSlice.tsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";


const PerformancePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const performances = useAppSelector((state) => state.hrmSlice.performanceList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation()

    //modal
    const [openAddPerformanceModal, setOpenAddPerformanceModel] = useState(false);

    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [employeeId, setEmployeeId] = useState(0);


    useEffect(() => {
        dispatch(fetchFindAllPerformance({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenPerformanceModal = () => {
        setOpenAddPerformanceModel(true);
    }


    const handleOpenUpdateModal = async () => {
        setOpenAddPerformanceModel(true);
        setIsUpdating(true);

        dispatch(fetchFindByIdPerformance(selectedRowIds[0])).then((data) => {

            
            setDate(dayjs(data.payload.data.salaryDate));
            setScore(data.payload.data.score);
            setFeedback(data.payload.data.feedback);


        });
    }

    const handleUpdatePerformance = () => {
        dispatch(fetchUpdatePerformance({
            id: selectedRowIds[0],
            employeeId: employeeId,
            date: date?.toDate() || new Date(),
            score: score,
            feedback: feedback
        })).then(() => {
            setOpenAddPerformanceModel(false);
            setIsUpdating(false);
            setDate(dayjs())
            setScore(0)
            setFeedback('')
            

            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.successfullyupdated"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddPerformanceModel(false);
            setIsUpdating(false);
            setDate(dayjs())
            setScore(0)
            setFeedback('')
            
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
        });
    };

    const handleDeletePerformance = async () => {
        if (selectedRowIds.length === 0) return;

        setIsDeleting(true);
        try {

            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("hrmService.deleting"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("hrmService.delete"),
                cancelButtonText: t("hrmService.cancel"),
                html: `<input type="checkbox" id="confirm-checkbox" />
                   <label for="confirm-checkbox">${t("hrmService.confirmDelete")}</label>`,
                preConfirm: () => {
                    const popup = Swal.getPopup();
                    if (popup) {
                        const checkbox = popup.querySelector('#confirm-checkbox') as HTMLInputElement;
                        if (checkbox && !checkbox.checked) {
                            Swal.showValidationMessage(t("hrmService.checkboxRequired"));
                            return false;
                        }
                        return true;
                    }
                }
            });

            if (result.isConfirmed) {
                let hasError = false;
                for (const id of selectedRowIds) {
                    const selectedEmployee = performances.find(
                        (selectedEmployee) => selectedEmployee.id === id
                    );
                    if (!selectedEmployee) continue;

                    const data = await dispatch(fetchDeletePerformance(selectedEmployee.id));

                    if (data.payload.message !== "Success") {
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
                        title: t("hrmService.deleted"),
                        text: t("hrmService.successfullydeleted"),
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



    const columns: GridColDef[] = [
        { field: "firstName", headerName: t("hrmService.firstName"), flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: t("hrmService.lastName"), flex: 1.5, headerAlign: "center" },
        { field: "date", headerName: t("hrmService.date"), flex: 1.5, headerAlign: "center" },
        { field: "score", headerName: t("hrmService.score"), flex: 1.5, headerAlign: "center" },
        { field: "feedback", headerName: t("hrmService.feedback"), flex: 1.5, headerAlign: "center" },
      
    ]


    return (
        <div style={{ height: "auto" }}>

            <TextField
                label={t("hrmService.searchbyname")}
                variant="outlined"
                onChange={(event) => {
                    setSearchText(event.target.value);
                }}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <h1>{t("hrmService.performances")}</h1>

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={performances}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
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
                        {t("hrmService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeletePerformance}
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
                        {t("hrmService.delete")}
                    </Button>
                </Grid>
                <Dialog open={openAddPerformanceModal} onClose={() => setOpenAddPerformanceModel(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.update') : t('hrmService.add_employee')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.date')}
                            name="date"
                            type="date"
                            value={date ? date.toISOString().substring(0, 10) : ''}
                            onChange={e => setDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.score')}
                            name="score"
                            value={score !== undefined ? score : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setScore(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />
                           <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.feedback')}
                            name="feedback"
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            required
                            fullWidth
                        />
                       




                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddPerformanceModel(false);
                            setIsUpdating(false);
                            setDate(dayjs());
                            setScore(0)
                            setFeedback('')
                          
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        {isUpdating && (
                            <Button
                                onClick={() => handleUpdatePerformance()}
                                color="primary"
                                variant="contained"
                                disabled={date === null || score === 0 || feedback === ''}
                            >
                                {t('hrmService.update')}
                            </Button>
                        )}
                    </DialogActions>

                </Dialog>

            </Grid>
        </div>
    );
}
export default PerformancePage;
