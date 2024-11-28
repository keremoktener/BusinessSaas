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
    fetchFindAllEmployee,
    fetchSaveEmployee,
    fetchSavePayroll,
    fetchSaveBenefit,
    fetchSavePerformance,
    fetchDeleteEmployee,
    fetchUpdateEmployee,
    fetchFindByIdEmployee
} from "../../store/feature/hrmSlice.tsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";


const EmployeePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();

    const employees = useAppSelector((state) => state.hrmSlice.employeeList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation()


    const [openAddEmployeeModal, setOpenAddEmployeeModel] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs());
    const [hireDate, setHireDate] = useState<Dayjs | null>(dayjs());
    const [salary, setSalary] = useState(0);

    const [openAddPayrollModal, setOpenAddPayrollModal] = useState(false);
    const [grossSalary, setGrossSalary] = useState<number>(0);
    const [deductions, setDeductions] = useState<number>(0);
    const [netSalary, setNetSalary] = useState<number>(0);
    const [salaryDate, setSalaryDate] = useState<Dayjs | null>(dayjs());

    const [openAddBenefitModal, setOpenAddBenefitModal] = useState(false);
    const [type, setType] = useState('');
    const [amount, setAmount] = useState(0);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

    const [openAddPerformanceModal, setOpenAddPerformanceModal] = useState(false);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

   

    useEffect(() => {
        dispatch(fetchFindAllEmployee({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenEmployeeModal = () => {
        setOpenAddEmployeeModel(true);
    }
    const handleOpenPayrollModal = () => {
        setOpenAddPayrollModal(true);
    };
    const handleOpenBenefitModal = () => {
        setOpenAddBenefitModal(true);
    };
    const handleOpenPerformanceModal = () => {
        setOpenAddPerformanceModal(true);
    };
  

  

    const handleSavePerformance = () => {
        dispatch(fetchSavePerformance({
            employeeId: selectedRowIds[0],
            date: date?.toDate() || new Date(),
            score: score,
            feedback: feedback
        })).then((data) => {
            setOpenAddPerformanceModal(false);
            setScore(0);
            setFeedback('');
            setDate(dayjs());
            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.added_performance"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddPerformanceModal(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.non-added"),
                icon: "error",
                confirmButtonText: t("swal.ok"),
            });
        });
    }

    const handleSaveBenefit = () => {
        dispatch(fetchSaveBenefit({
            employeeId: selectedRowIds[0],
            type: type,
            amount: amount,
            startDate: startDate?.toDate() || new Date(),
            endDate: endDate?.toDate() || new Date()
        })).then((data) => {
            setOpenAddBenefitModal(false);
            setAmount(0);
            setType('');
            setStartDate(dayjs());
            setEndDate(dayjs());
            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.added_benefit"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddBenefitModal(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.non-added"),
                icon: "error",
                confirmButtonText: t("swal.ok"),
            });
        });
    }

    const handleSavePayroll = () => {
        dispatch(fetchSavePayroll({
            employeeId: selectedRowIds[0],
            salaryDate: salaryDate?.toDate() || new Date(),
            grossSalary: grossSalary,
            deductions: deductions,
            netSalary: netSalary
        })).then((data) => {
            setOpenAddPayrollModal(false);
            setGrossSalary(0);
            setDeductions(0);
            setNetSalary(0);
            setSalaryDate(dayjs());
            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.added_payroll"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddPayrollModal(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.non-added"),
                icon: "error",
                confirmButtonText: t("swal.ok"),
            });
        });
    }


    const handleSaveEmployee = () => {
        setIsSaving(true);
        dispatch(fetchSaveEmployee({
            firstName: firstName,
            lastName: lastName,
            position: position,
            department: department,
            email: email,
            phone: phone,
            birthDate: birthDate?.toDate() || new Date(),
            gender: gender,
            hireDate: hireDate?.toDate() || new Date(),
            salary: salary
        })).then((data) => {
            if (data.payload.message === "Success") {
                setFirstName('');
                setLastName('');
                setPosition('');
                setDepartment('');
                setEmail('');
                setPhone('');
                setBirthDate(dayjs());
                setGender('');
                setHireDate(dayjs());
                setSalary(0);
                setOpenAddEmployeeModel(false);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("hrmService.added"),
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("hrmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
            }
            setIsSaving(false);
        }).catch((error) => {
            setOpenAddEmployeeModel(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
            setIsSaving(false);
        });
    }
    const handleOpenUpdateModal = async () => {
        setOpenAddEmployeeModel(true);
        setIsUpdating(true);

        dispatch(fetchFindByIdEmployee(selectedRowIds[0])).then((data) => {
            setFirstName(data.payload.data.firstName);
            setLastName(data.payload.data.lastName);
            setPosition(data.payload.data.position);
            setDepartment(data.payload.data.department);
            setEmail(data.payload.data.email);
            setPhone(data.payload.data.phone);
            setBirthDate(dayjs(data.payload.data.birthDate));
            setGender(data.payload.data.gender);
            setHireDate(dayjs(data.payload.data.hireDate));
            setSalary(data.payload.data.salary);
        });
    }

    const handleUpdateEmployee = () => {
        dispatch(fetchUpdateEmployee({
            id: selectedRowIds[0],
            firstName: firstName,
            lastName: lastName,
            position: position,
            department: department,
            email: email,
            phone: phone,
            birthDate: birthDate?.toDate() || new Date(),
            gender: gender,
            hireDate: hireDate?.toDate() || new Date(),
            salary: salary
        })).then(() => {
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setFirstName('')
            setLastName('')
            setPosition('')
            setDepartment('')
            setEmail('')
            setPhone('')
            setBirthDate(dayjs())
            setGender('')
            setHireDate(dayjs())
            setSalary(0)
            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.successfullyupdated"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setFirstName('')
            setLastName('')
            setPosition('')
            setDepartment('')
            setEmail('')
            setPhone('')
            setBirthDate(dayjs())
            setGender('')
            setHireDate(dayjs())
            setSalary(0)
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
        });
    };

    const handleDeleteEmployee = async () => {
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
                    const selectedEmployee = employees.find(
                        (selectedEmployee) => selectedEmployee.id === id
                    );
                    if (!selectedEmployee) continue;

                    const data = await dispatch(fetchDeleteEmployee(selectedEmployee.id));

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
        { field: "position", headerName: t("hrmService.position"), flex: 1.5, headerAlign: "center" },
        { field: "department", headerName: t("hrmService.department"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: t("hrmService.email"), flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: t("hrmService.phone"), flex: 1.5, headerAlign: "center" },
        { field: "birthDate", headerName: t("hrmService.birthDate"), flex: 1.5, headerAlign: "center" },
        { field: "gender", headerName: t("hrmService.gender"), flex: 1.5, headerAlign: "center" },
        { field: "hireDate", headerName: t("hrmService.hireDate"), flex: 1.5, headerAlign: "center" },
        { field: "salary", headerName: t("hrmService.salary"), flex: 1.5, headerAlign: "center" },
        { field: "status", headerName: t("hrmService.status"), headerAlign: "center", flex: 1 },
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
            <h1>{t("hrmService.employees")}</h1>

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={employees}
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
                <Grid item xs={1.5} >
                    <Button
                        onClick={handleOpenEmployeeModal}
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
                        {t("hrmService.add_employee")}
                    </Button>
                </Grid>
                <Grid item xs={1.5}>
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
                <Grid item xs={1.5}>
                    <Button
                        onClick={handleDeleteEmployee}
                        variant="contained"
                        color="error"
                        disabled={isDeleting || selectedRowIds.length === 0}

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

                <Grid item xs={1.5}>
                    <Button
                        onClick={handleOpenPayrollModal}
                        variant="contained"
                        color="warning"
                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            backgroundColor: '#FFC107',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: '#FFB300',
                            },
                        }}
                    >
                        {t("hrmService.add_payroll")}
                    </Button>
                </Grid>
                <Grid item xs={1.5}>
                    <Button
                        onClick={handleOpenPerformanceModal}
                        variant="contained"
                        color="warning"
                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            backgroundColor: '#FFC107',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: '#FFB300',
                            },
                        }}
                    >
                        {t("hrmService.add_performance")}
                    </Button>
                </Grid>
                <Grid item xs={1.5} >
                    <Button
                        onClick={handleOpenBenefitModal}
                        variant="contained"
                        color="warning"
                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            backgroundColor: '#FFC107',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: '#FFB300',
                            },
                        }}
                    >
                        {t("hrmService.add_benefit")}
                    </Button>
                </Grid>
            


                 
                <Dialog open={openAddEmployeeModal} onClose={() => setOpenAddEmployeeModel(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.update') : t('hrmService.add_employee')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.firstName')}
                            name="name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.lastName')}
                            name="Lastname"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.position')}
                            name="Position"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.department')}
                            name="Department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.email')}
                            name="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.phone')}
                            name="Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.birthDate')}
                            name="BirthDate"
                            type="date"
                            value={birthDate ? birthDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setBirthDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.gender')}
                            name="Gender"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.hireDate')}
                            name="HireDate"
                            type="date"
                            value={hireDate ? hireDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setHireDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.salary')}
                            name="Salary"
                            value={salary !== undefined ? salary : ''}
                            onChange={e => {
                                const value = e.target.value;
                                setSalary(value ? parseInt(value) : 0);
                            }}
                            required
                            fullWidth
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddEmployeeModel(false);
                            setIsUpdating(false);
                            setFirstName('');
                            setLastName('');
                            setPosition('');
                            setDepartment('');
                            setEmail('');
                            setPhone('');
                            setBirthDate(dayjs());
                            setGender('');
                            setHireDate(dayjs());
                            setSalary(0);
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>
                        {isUpdating ?
                            <Button onClick={() => handleUpdateEmployee()} color="primary" variant="contained"
                                disabled={firstName === '' || lastName === '' || position === '' || department === '' || email === '' || phone === '' || birthDate === null || gender === '' || hireDate === null || salary === 0}>{t('hrmService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveEmployee()} color="success" variant="contained"
                                disabled={firstName === '' || lastName === '' || position === '' || department === '' || email === '' || phone === '' ||gender === '' ||  hireDate === null || salary === 0}>{t('hrmService.save')}</Button>}


                    </DialogActions>
                </Dialog>



                <Dialog open={openAddPayrollModal} onClose={() => setOpenAddPayrollModal(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.save') : t('hrmService.add_payroll')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label={t('hrmService.grossSalary')}
                            type="number"
                            value={grossSalary}
                            onChange={(e) => setGrossSalary(parseFloat(e.target.value))}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('hrmService.deductions')}
                            type="number"
                            value={deductions}
                            onChange={(e) => setDeductions(parseFloat(e.target.value))}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('hrmService.netSalary')}
                            type="number"
                            value={netSalary}
                            onChange={(e) => setNetSalary(parseFloat(e.target.value))}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('hrmService.salaryDate')}
                            type="date"
                            value={salaryDate ? salaryDate.format('YYYY-MM-DD') : ''}
                            onChange={(e) => setSalaryDate(dayjs(e.target.value))}
                            fullWidth
                            margin="normal"
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddPayrollModal(false);
                            setIsUpdating(false);
                            setGrossSalary(0);
                            setDeductions(0);
                            setNetSalary(0);
                            setSalaryDate(dayjs());
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        <Button onClick={() => handleSavePayroll()} color="success" variant="contained"
                            disabled={grossSalary === 0 || deductions === 0 || netSalary === 0 || salaryDate === null}>{t('hrmService.save')}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openAddBenefitModal} onClose={() => setOpenAddBenefitModal(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.save') : t('hrmService.add_benefit')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label={t('hrmService.startDate')}
                            type="date"
                            value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                            onChange={(e) => setStartDate(dayjs(e.target.value))}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label={t('hrmService.endDate')}
                            type="date"
                            value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                            onChange={(e) => setEndDate(dayjs(e.target.value))}
                            fullWidth
                            margin="normal"
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
                        <TextField
                            label={t('hrmService.amount')}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            fullWidth
                            margin="normal"
                        />


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddBenefitModal(false);
                            setIsUpdating(false);
                            setStartDate(dayjs());
                            setEndDate(dayjs());
                            setAmount(0);
                            setType('');
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        <Button onClick={() => handleSaveBenefit()} color="success" variant="contained"
                            disabled={startDate === null || endDate === null || amount === 0 || type === ''}>{t('hrmService.save')}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openAddPerformanceModal} onClose={() => setOpenAddPerformanceModal(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.save') : t('hrmService.add_performance')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label={t('hrmService.date')}
                            type="date"
                            value={date ? date.format('YYYY-MM-DD') : ''}
                            onChange={(e) => setDate(dayjs(e.target.value))}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.feedback')}
                            name="name"
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label={t('hrmService.score')}
                            type="number"
                            value={score}
                            onChange={(e) => setScore(parseFloat(e.target.value))}
                            fullWidth
                            margin="normal"
                        />


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddPerformanceModal(false);
                            setIsUpdating(false);
                            setDate(dayjs());
                            setFeedback('');
                            setScore(0);
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>

                        <Button onClick={() => handleSavePerformance()} color="success" variant="contained"
                            disabled={date === null || feedback === '' || score === 0}>{t('hrmService.save')}</Button>
                    </DialogActions>
                </Dialog>

               


            </Grid>
        </div>
    );
}
export default EmployeePage;
