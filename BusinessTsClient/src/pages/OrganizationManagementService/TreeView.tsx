import React, {useEffect, useState} from 'react';
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
    Select,
    TextField
} from '@mui/material';

import {OrganizationChart, OrganizationChartSelectionChangeEvent} from 'primereact/organizationchart';
import {TreeNode} from 'primereact/treenode';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {
    fetchDeleteEmployee,
    fetchFindAllDepartment,
    fetchGetEmployeeHierarchy,
    fetchSaveSubordinate,
    fetchSaveTopLevelManager
} from '../../store/feature/organizationManagementSlice.tsx';
import {AppDispatch} from '../../store';
import {useDispatch} from 'react-redux';

import {IDepartment} from "../../model/OrganizationManagementService/IDepartment.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import {Delete} from "@mui/icons-material"; // PrimeReact Button bileşenini ekliyoruz

interface CustomTreeNode extends TreeNode {
    type?: string;
    data?: {
        id: number;
        image: string;
        name: string;
        email: string;
        title: string;
        department: string;
    };
    children?: CustomTreeNode[];
}

export default function SelectionDemo() {
    const [selection, setSelection] = useState<CustomTreeNode | null>(null);
    const [data2, setData2] = useState<CustomTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation()
    //MODAL
    const [openAddSubordinateModal, setAddSubordinateModal] = useState(false);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(0);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [identityNo, setIdentityNo] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const handleOpenAddSubordinateModal = () => {
        setAddSubordinateModal(true);
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

    };


    const handleSaveEmployee = async () => {
        setIsSaving(true)
        dispatch(fetchSaveSubordinate({
            name: name,
            surname: surname,
            email: email,
            identityNo: identityNo,
            title: title,
            phoneNo: phoneNo,
            managerId: selectedEmployeeId || 0,
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
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                    fetchDatas();
                } else {

                    setName('')
                    setSurname('')
                    setEmail('')
                    setIdentityNo('')
                    setPhoneNo('')
                    setTitle('')
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                    setIsSaving(false)
                    fetchDatas();
                }
            })
    };

    const handleSaveTopLevelManager = async () => {
        setIsSaving(true)
        dispatch(fetchSaveTopLevelManager({
            name: name,
            surname: surname,
            email: email,
            identityNo: identityNo,
            phoneNo: phoneNo,
            title: title,
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
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                    fetchDatas();
                } else {

                    setName('')
                    setSurname('')
                    setEmail('')
                    setIdentityNo('')
                    setPhoneNo('')
                    setTitle('')
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                    setIsSaving(false)
                    fetchDatas();
                }
            })
    };

    const handleDelete = async () => {
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
                const data = await dispatch(fetchDeleteEmployee(selectedEmployeeId));

                if (data.payload.message !== "Success") {
                    await Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
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
            fetchDatas();
        }

    }

    useEffect(() => {
        fetchDatas();
    }, [dispatch, isSaving, isUpdating, isDeleting]);

    const fetchDatas = () => {
        setLoading(true);
        dispatch(fetchGetEmployeeHierarchy())
            .then((response) => {
                if (response.payload && response.payload.data) {
                    setData2(response.payload.data);
                }
            })
            .finally(() => setLoading(false));
    }

    const nodeTemplate = (node: CustomTreeNode) => (
        <div className="user-card"  style={{position: 'relative'}}>
            {/* Kullanıcı bilgileri */}
            <img alt={node.data?.name} src={`https://robohash.org/${node.data?.name}.png?size=50x50`}
                 className="user-avatar"/>
            <div className="user-info">
                <div style={{marginTop: '10px', marginBottom: '10px', fontWeight: 'bold'}}>{node.data?.name}</div>
                <div style={{marginBottom: '5px', fontWeight: 'normal', fontStyle: 'italic'}}>{node.data?.title}</div>
                <div style={{marginBottom: '5px', fontWeight: 'normal', fontStyle: 'italic'}}>{node.data?.department}</div>
                <div style={{marginBottom: '5px', fontWeight: 'normal', fontStyle: 'italic'}}>{node.data?.email}</div>
            </div>

            {/* Seçili olan düğüme sağ üstte + butonu ekliyoruz */}
            {selection && selection.data?.name === node.data?.name && (
                <>
                    <IconButton
                        color="primary"
                        size="small"
                        style={{position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'white'}}
                        onClick={() => handleOpenAddSubordinateModal()}
                    >
                        <AddIcon/> {/* + işaretini göstermek için Material UI Add ikonu */}
                    </IconButton>

                    {/* Sol üst köşeye silme butonu ekliyoruz */}
                    <IconButton
                        color="primary"
                        size="small"
                        style={{position: 'absolute', top: '-10px', left: '-10px', backgroundColor: 'white'}}
                        onClick={() => handleDelete()}
                    >
                        <Delete/> {/* Çöp kutusu simgesini göstermek için Material UI Delete ikonu */}
                    </IconButton>
                </>
            )}
        </div>
    );

    const handleSelectionChange = (e: OrganizationChartSelectionChangeEvent) => {
        const selectedNode = e.data as CustomTreeNode || null;
        setSelection(selectedNode); // Seçimi güncelliyoruz
        setSelectedEmployeeId(selectedNode?.data?.id || selectedEmployeeId); // Güncel seçimden id alıyoruz
    };

    return (
        <div className="card overflow-x-auto">
            {/* Yükleniyor durumunu ve data2de data var mı yok mu kontrol ediyoruz. Yoksa toplevelmanager oluşturmak için buton koyuldu. */}
            {loading || data2.length === 0 ? (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item>
                        <Button
                            onClick={() => handleOpenAddSubordinateModal()}
                            sx={{marginTop: '15px', textAlign: 'center'}}
                            color="success"
                            variant="contained"
                        >
                            {t('stockService.addtoplevelmanager')}
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                // Veri yüklendikten sonra OrganizationChart bileşenini render ediyoruz
                <OrganizationChart
                    value={data2}
                    selectionMode="single"
                    selection={selection}
                    onSelectionChange={handleSelectionChange}
                    nodeTemplate={nodeTemplate}
                />
            )}

            <Dialog open={openAddSubordinateModal} onClose={() => setAddSubordinateModal(false)} fullWidth
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
                        disabled={isUpdating}
                        onChange={e => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddSubordinateModal(false), setIsUpdating(false)
                    }} color="error" variant="contained">{t('stockService.cancel')}</Button>


                    {data2.length === 0 ?
                        <Button onClick={() => handleSaveTopLevelManager()} color="success" variant="contained"
                                disabled={name === '' || surname === '' || title === '' || email === '' || identityNo === '' || phoneNo === '' || selectedDepartmentId === 0}>{t('stockService.savemanager')}</Button>
                        :

                        <Button onClick={() => handleSaveEmployee()} color="success" variant="contained"
                                disabled={name === '' || surname === '' || email === '' || title === '' || identityNo === '' || phoneNo === '' || selectedDepartmentId === 0}>{t('stockService.save')}</Button>
                    }

                </DialogActions>
            </Dialog>
        </div>
    );
}
