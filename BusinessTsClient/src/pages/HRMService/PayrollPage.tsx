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
    fetchFindAllPayroll,
    fetchSavePayroll,
    fetchDeletePayroll,
    fetchUpdatePayroll,
    fetchFindByIdPayroll
} from "../../store/feature/hrmSlice.tsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";


const PayrollPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const payrolls = useAppSelector((state) => state.hrmSlice.payrollList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation()
   

    //modal
    const [openAddPayrollModal, setOpenAddPayrollModel] = useState(false);

    const [salaryDate, setSalaryDate] = useState<Dayjs | null>(dayjs());
    const [grossSalary, setGrossSalary] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [netSalary, setNetSalary] = useState(0);
    const [employeeId, setEmployeeId] = useState(0);


    useEffect(() => {
        dispatch(fetchFindAllPayroll({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenPayrollModal = () => {
        setOpenAddPayrollModel(true);
    }


    const handleOpenUpdateModal = async () => {
        setOpenAddPayrollModel(true);
        setIsUpdating(true);

        dispatch(fetchFindByIdPayroll(selectedRowIds[0])).then((data) => {

            setSalaryDate(dayjs(data.payload.data.salaryDate));
            setGrossSalary(data.payload.data.grossSalary);
            setDeductions(data.payload.data.deductions);
            setNetSalary(data.payload.data.netSalary);


        });
    }

    const handleUpdatePayroll = () => {
        dispatch(fetchUpdatePayroll({
            id: selectedRowIds[0],
            employeeId: employeeId,
            salaryDate: salaryDate?.toDate() || new Date(),
            grossSalary: grossSalary,
            deductions: deductions,
            netSalary: netSalary
        })).then(() => {
            setOpenAddPayrollModel(false);
            setIsUpdating(false);
            setSalaryDate(dayjs())
            setGrossSalary(0)
            setDeductions(0)
            setNetSalary(0)

            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.successfullyupdated"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddPayrollModel(false);
            setIsUpdating(false);
            setSalaryDate(dayjs())
            setGrossSalary(0)
            setDeductions(0)
            setNetSalary(0)
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
        });
    };

    const handleDeletePayroll = async () => {
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
                    const selectedEmployee = payrolls.find(
                        (selectedEmployee) => selectedEmployee.id === id
                    );
                    if (!selectedEmployee) continue;

                    const data = await dispatch(fetchDeletePayroll(selectedEmployee.id));

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
        { field: "salaryDate", headerName: t("hrmService.salaryDate"), flex: 1.5, headerAlign: "center" },
        { field: "grossSalary", headerName: t("hrmService.grossSalary"), flex: 1.5, headerAlign: "center" },
        { field: "deductions", headerName: t("hrmService.deductions"), flex: 1.5, headerAlign: "center" },
        { field: "netSalary", headerName: t("hrmService.netSalary"), flex: 1.5, headerAlign: "center" },
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
            <h1>{t("hrmService.payrolls")}</h1>

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={payrolls}
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
                        onClick={handleDeletePayroll}
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
                <Dialog open={openAddPayrollModal} onClose={() => setOpenAddPayrollModel(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.update') : t('hrmService.add_employee')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.salaryDate')}
                            name="SalaryDate"
                            type="date"
                            value={salaryDate ? salaryDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setSalaryDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.grossSalary')}
                            name="grossSalary"
                            value={grossSalary !== undefined ? grossSalary : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setGrossSalary(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.deductions')}
                            name="deductions"
                            value={deductions !== undefined ? deductions : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setDeductions(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.netSalary')}
                            name="netSalary"
                            value={netSalary !== undefined ? netSalary : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setNetSalary(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />








                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddPayrollModel(false);
                            setIsUpdating(false);
                            setSalaryDate(dayjs());
                            setGrossSalary(0);
                            setDeductions(0);
                            setNetSalary(0);
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        {isUpdating && (
                            <Button
                                onClick={() => handleUpdatePayroll()}
                                color="primary"
                                variant="contained"
                                disabled={salaryDate === null || grossSalary === 0 || deductions === 0 || netSalary === 0}
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
export default PayrollPage;
