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
    fetchFindAllBenefit,
    fetchSaveBenefit,
    fetchDeleteBenefit,
    fetchUpdateBenefit,
    fetchFindByIdBenefit
} from "../../store/feature/hrmSlice.tsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";


const BenefitPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const benefits = useAppSelector((state) => state.hrmSlice.benefitList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation()
   

    //modal
    const [openAddBenefitModal, setOpenAddBenefitModel] = useState(false);

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState('');
    
    const [employeeId, setEmployeeId] = useState(0);


    useEffect(() => {
        dispatch(fetchFindAllBenefit({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenBenefitModal = () => {
        setOpenAddBenefitModel(true);
    }


    const handleOpenUpdateModal = async () => {
        setOpenAddBenefitModel(true);
        setIsUpdating(true);

        dispatch(fetchFindByIdBenefit(selectedRowIds[0])).then((data) => {

            setStartDate(dayjs(data.payload.data.startDate));
            setEndDate(dayjs(data.payload.data.endDate));
            setAmount(data.payload.data.amount);
            setType(data.payload.data.type);
            


        });
    }

    const handleUpdateBenefit = () => {
        dispatch(fetchUpdateBenefit({
            id: selectedRowIds[0],
            employeeId: employeeId,
            type: type,
            amount: amount,
            startDate: startDate?.toDate() || new Date(),
            endDate: endDate?.toDate() || new Date()
           
        })).then(() => {
            setOpenAddBenefitModel(false);
            setIsUpdating(false);
            setStartDate(dayjs())
            setEndDate(dayjs())
            setAmount(0)
            setType('')
            

            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.successfullyupdated"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddBenefitModel(false);
            setIsUpdating(false);
            setStartDate(dayjs())
            setEndDate(dayjs())
            setAmount(0)
            setType('')
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
        });
    };

    const handleDeleteBenefit = async () => {
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
                    const selectedEmployee = benefits.find(
                        (selectedEmployee) => selectedEmployee.id === id
                    );
                    if (!selectedEmployee) continue;

                    const data = await dispatch(fetchDeleteBenefit(selectedEmployee.id));

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
        { field: "startDate", headerName: t("hrmService.startDate"), flex: 1.5, headerAlign: "center" },
        { field: "endDate", headerName: t("hrmService.endDate"), flex: 1.5, headerAlign: "center" },
        { field: "type", headerName: t("hrmService.type"), flex: 1.5, headerAlign: "center" },
        { field: "amount", headerName: t("hrmService.amount"), flex: 1.5, headerAlign: "center" },
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
            <h1>{t("hrmService.benefits")}</h1>

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={benefits}
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
                        onClick={handleDeleteBenefit}
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
                <Dialog open={openAddBenefitModal} onClose={() => setOpenAddBenefitModel(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.update') : t('hrmService.add_employee')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.startDate')}
                            name="startDate"
                            type="date"
                            value={startDate ? startDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setStartDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                         <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.endDate')}
                            name="endDate"
                            type="date"
                            value={endDate ? endDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setEndDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.amount')}
                            name="amount"
                            value={amount !== undefined ? amount : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setAmount(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />
                          <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.type')}
                            name="name"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            required
                            fullWidth
                        />
                       








                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddBenefitModel(false);
                            setIsUpdating(false);
                            setStartDate(dayjs());
                            setEndDate(dayjs());
                            setAmount(0);
                            setType('');
                            
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        {isUpdating && (
                            <Button
                                onClick={() => handleUpdateBenefit()}
                                color="primary"
                                variant="contained"
                                disabled={startDate === null || endDate === null || amount === 0 ||  type === ''}
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
export default BenefitPage;
