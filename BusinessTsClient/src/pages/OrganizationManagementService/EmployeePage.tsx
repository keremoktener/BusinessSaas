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
    InputLabel,
    Select,
    Switch,
    TextField
} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";

import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {
    fetchChangeIsAccountGivenStateOfEmployee,
    fetchDeleteEmployee,
    fetchFindAllDepartment,
    fetchFindAllEmployee,
    fetchFindByIdEmployee,
    fetchSaveEmployee,
    fetchUpdateEmployee
} from "../../store/feature/organizationManagementSlice.tsx"
import {IEmployee} from "../../model/OrganizationManagementService/IEmployee.tsx";
import {IDepartment} from "../../model/OrganizationManagementService/IDepartment.tsx";
import MenuItem from "@mui/material/MenuItem";


const EmployeePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const {t} = useTranslation()

    //MODAL
    const [openAddCustomerModal, setOpenAddEmployee] = useState(false);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [modalEmployees, setModalEmployees] = useState<IEmployee[]>([]);
    const [selectedManagerId, setSelectedManagerId] = useState(0);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(0);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [identityNo, setIdentityNo] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        dispatch(
            fetchFindAllEmployee({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setEmployees(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating, isUpdating, isSaving, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOpenEmployeeModal = () => {
        setOpenAddEmployee(true);
        setIsUpdating(false)
        dispatch(
            fetchFindAllDepartment({
                page: 0,
                size: 10000,
                searchText: '',
            })
        ).then(data => {
            setDepartments(data.payload.data);
        })

        handleFetchDataset()
    };

    const handleFetchDataset = () => {
        dispatch(
            fetchFindAllEmployee({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setEmployees(data.payload.data);
        })
    }

    const handleOpenUpdateModal = async () => {
        setOpenAddEmployee(true);
        setIsUpdating(true)

        dispatch(
            fetchFindAllDepartment({
                page: 0,
                size: 10000,
                searchText: '',
            })
        ).then(data => {
            setDepartments(data.payload.data);
        })

        dispatch(
            fetchFindAllEmployee({
                page: 0,
                size: 10000,
                searchText: '',
            })
        ).then(data => {
            setModalEmployees(data.payload.data);
        })

        dispatch(fetchFindByIdEmployee(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name)
            setSurname(data.payload.data.surname)
            setEmail(data.payload.data.email)
            setIdentityNo(data.payload.data.identityNo)
            setPhoneNo(data.payload.data.phoneNo)
            setSelectedDepartmentId(data.payload.data.departmentId)
            setSelectedManagerId(data.payload.data.managerId)
            setTitle(data.payload.data.title)
        })
    }
    const handleUpdate = async () => {
        setIsUpdating(true)
        dispatch(fetchUpdateEmployee({
            id: selectedRowIds[0],
            name: name,
            surname: surname,
            identityNo: identityNo,
            phoneNo: phoneNo,
            title: title,
            email: email,
            managerId: selectedManagerId,
            departmentId: selectedDepartmentId
        })).then((data) => {
            if (data.payload.message === "Success") {
                setName('')
                setSurname('')
                setEmail('')
                setIdentityNo('')
                setPhoneNo('')
                setTitle('')
                setSelectedDepartmentId(0)
                setSelectedManagerId(0)
                setOpenAddEmployee(false);
                Swal.fire({
                    title: t("stockService.updated"),
                    text: t("stockService.successfullyupdated"),
                    icon: "success",
                });
                setIsUpdating(false)
            } else {

                setName('')
                setSurname('')
                setEmail('')
                setIdentityNo('')
                setPhoneNo('')
                setTitle('')
                setSelectedDepartmentId(0)
                setSelectedManagerId(0)
                setOpenAddEmployee(false);
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

    const handleSaveEmployee = async () => {
        setIsSaving(true)
        dispatch(fetchSaveEmployee({
            name: name,
            surname: surname,
            email: email,
            identityNo: identityNo,
            phoneNo: phoneNo,
            title: title,
            managerId: selectedManagerId,
            departmentId: selectedDepartmentId
        }))
            .then((data) => {
                if (data.payload.message === "Success") {
                    setName('')
                    setSurname('')
                    setEmail('')
                    setIdentityNo('')
                    setPhoneNo('')
                    setTitle('')
                    setSelectedDepartmentId(0)
                    setSelectedManagerId(0)
                    setOpenAddEmployee(false);
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
                    setIdentityNo('')
                    setPhoneNo('')
                    setTitle('')
                    setSelectedDepartmentId(0)
                    setSelectedManagerId(0)
                    setOpenAddEmployee(false);
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
            const selectedCustomer = employees.find(
                (selectedCustomer) => selectedCustomer.id === id
            );
            if (!selectedCustomer) continue;
            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteEmployee(selectedCustomer.id));

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

    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const columns: GridColDef[] = [
        {field: "name", headerName: t("authentication.name"), flex: 1, headerAlign: "center"},
        {field: "surname", headerName: t("stockService.surname"), flex: 1, headerAlign: "center"},
        {field: "title", headerName: t("stockService.title"), flex: 1, headerAlign: "center"},
        {field: "departmentName", headerName: t("stockService.departmentname"), flex: 1.5, headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 1.5, headerAlign: "center"},
        {field: "identityNo", headerName: t("stockService.identityno"), flex: 1, headerAlign: "center"},
        {field: "phoneNo", headerName: t("stockService.phoneno"), flex: 1, headerAlign: "center"},
        {field: "managerName", headerName: t("stockService.managername"), flex: 1.2, headerAlign: "center",
            renderCell: (params) => (
                params.value === 'No Manager'
                    ? t('stockService.nomanager')
                    : params.value
            )},
        {
            field: "isAccountGivenToEmployee",
            headerName: t("stockService.isaccountactive"),
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => (
                <Switch
                    checked={params.value}
                    onClick={(event) => event.stopPropagation()}  // Prevents row selection
                    onChange={() => handleSwitchChange(params.value, params.row.id)}
                    color="primary"
                />
            )
        },
    ];

    const handleSwitchChange = async ( value: boolean, id: number) => {

        if (!value) {
            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("stockService.youwillactivateaccount"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("stockService.yes"),
                cancelButtonText: t("stockService.cancel"),
            });

            if (result.isConfirmed) {
                dispatch(fetchChangeIsAccountGivenStateOfEmployee(id)).then((data) => {

                    if (data.payload.message === "Success") {
                        Swal.fire({
                            title: t("swal.success"),
                            text: t("stockService.accountactivatedsuccesfully"),
                            icon: "success",
                        });
                        handleFetchDataset()
                    } else {
                        Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                    }

                })
            }

        } else {
            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("stockService.youwilldeactivateaccount"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("stockService.yes"),
                cancelButtonText: t("stockService.cancel"),
            });

            if (result.isConfirmed) {
                dispatch(fetchChangeIsAccountGivenStateOfEmployee(id)).then((data) => {

                    if (data.payload.message === "Success") {
                        Swal.fire({
                            title: t("swal.success"),
                            text: t("stockService.accountdeactivatedsuccesfully"),
                            icon: "success",
                        });
                        handleFetchDataset()
                    } else {
                        Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                    }

                })
            }
        }

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
                rows={employees}
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
                disableRowSelectionOnClick={true}
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
                        onClick={handleOpenEmployeeModal}
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
                <Dialog open={openAddCustomerModal} onClose={() => setOpenAddEmployee(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addemployee')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectdepartment')}</InputLabel>
                            <Select
                                value={selectedDepartmentId}
                                onChange={event => setSelectedDepartmentId((Number)(event.target.value))}
                                label="Departments"
                            >
                                {Object.values(departments).map(department => (
                                    <MenuItem key={department.id} value={department.id}>
                                        {department.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                            <InputLabel>{t('stockService.pleaseselectmanager')}</InputLabel>
                            <Select
                                value={selectedManagerId}
                                onChange={event => setSelectedManagerId((Number)(event.target.value))}
                                label="Managers"
                                disabled={
                                    selectedManagerId === -1
                                }

                            >
                                {Object.values(modalEmployees).map(manager => (
                                    <MenuItem key={manager.id} value={manager.id}>
                                        {manager.name + " " + manager.surname}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
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
                            label={t('stockService.title')}
                            name="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.identityno')}
                            name="identityNo"
                            value={identityNo}
                            onChange={e => setIdentityNo(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.phoneno')}
                            name="phoneNo"
                            value={phoneNo}
                            onChange={e => setPhoneNo(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label="Email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddEmployee(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={name === '' || surname === '' || email === '' || title === '' || identityNo === '' || phoneNo === '' || selectedManagerId === 0 || selectedDepartmentId === 0}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveEmployee()} color="success" variant="contained"
                                    disabled={name === '' || surname === '' || email === '' || title === '' || identityNo === '' || phoneNo === '' || selectedManagerId === 0 || selectedDepartmentId === 0}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default EmployeePage