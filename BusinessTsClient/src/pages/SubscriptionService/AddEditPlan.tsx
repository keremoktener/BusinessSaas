import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel,
    SelectChangeEvent,
    Checkbox
} from '@mui/material';
import { AppDispatch, RootState } from '../../store';
import { fetchFindAllPlans, fetchAddPlan, fetchUpdatePlan } from '../../store/feature/subscriptionSlice';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { IPlanTranslation } from '../../model/IPlanTranslation';
import { IPlan } from '../../model/IPlan';
import { fetchRoleList } from '../../store/feature/roleSlice';

const Subscription: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const plans = useSelector((state: RootState) => state.subscription.planList);
    const roleList = useSelector((state: RootState) => state.roleSlice.roleList);
    const language = useSelector((state: RootState) => state.pageSettings.language);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<IPlan>({
        id: 0,
        price: 0,
        roles: [],
        translations: [], // Initialize as an empty array
    });

    const [planDetails, setPlanDetails] = useState({
        price: '',
        roles: [] as string[],
        planTranslations: [] as IPlanTranslation[],
    });

    useEffect(() => {
        dispatch(fetchFindAllPlans());
        dispatch(fetchRoleList());
    }, [dispatch, language]);

    const handleAddPlanOpen = () => {
        setPlanDetails({
            price: '',
            roles: [],
            planTranslations: [{ language, name: '', description: '' }],
        });
        setOpenAddDialog(true);
    };

    const handlePlanDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleTranslationChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const { name, value } = event.target;
        const newTranslations = [...planDetails.planTranslations];
        newTranslations[index] = { ...newTranslations[index], [name]: value };
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            planTranslations: newTranslations,
        }));
    };

    const handleLanguageChange = (event: SelectChangeEvent<String>, index: number) => {
        const { value } = event.target;
        const newTranslations = [...planDetails.planTranslations];
        newTranslations[index] = { ...newTranslations[index], language: value };
        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            planTranslations: newTranslations,
        }));
    };

    const handleRolesChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        setPlanDetails((prevDetails) => ({
            ...prevDetails,
            roles: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleAddTranslation = () => {
        // Prevent adding a new translation with an already existing language
        const existingLanguages = planDetails.planTranslations.map((t) => t.language);
        if (!existingLanguages.includes('')) {
            setPlanDetails((prevDetails) => ({
                ...prevDetails,
                planTranslations: [
                    ...prevDetails.planTranslations,
                    { language: '', name: '', description: '' },
                ],
            }));
        }
    };

    const handleAddPlan = () => {
        const { price, roles, planTranslations } = planDetails;
        dispatch(
            fetchAddPlan({
                price: parseFloat(price),
                roles,
                planTranslations: planTranslations.map((translation) => ({
                    name: translation.name,
                    description: translation.description,
                    language: translation.language,
                })),
            })
        )
            .then(() => {
                dispatch(fetchFindAllPlans());
                setOpenAddDialog(false);
            })
            .catch((error) => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    const handleEditPlanOpen = (plan: IPlan) => {
        // Clone the selected plan with the default values
        const formattedPlan = {
            ...plan,
            price: plan.price, // Keep price as a number
            translations: plan.translations.map((translation: IPlanTranslation) => ({
                id: translation.id,
                language: translation.language,
                name: translation.name || '', // Fallback to empty string
                description: translation.description || '', // Fallback to empty string
            })),
        };

        setSelectedPlan(formattedPlan);
        setOpenEditDialog(true);
    };


    const handleUpdatePlan = () => {
        if (!selectedPlan) return;

        dispatch(fetchUpdatePlan({
            ...selectedPlan,
            price: parseFloat(selectedPlan.price as unknown as string), // Ensure price is a number
            planTranslations: selectedPlan.translations.map((translation: IPlanTranslation) => ({
                id: translation.id,
                language: translation.language,
                name: translation.name,
                description: translation.description,
            }))
        }))
            .then(() => {
                dispatch(fetchFindAllPlans());
                setOpenEditDialog(false);
            })
            .catch((error) => {
                Swal.fire('Error', error.message, 'error');
            });
    };

    const handleTranslationChangeEdit = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = event.target;
        const newTranslations = [...selectedPlan?.translations];
        newTranslations[index] = { ...newTranslations[index], [name]: value };
        setSelectedPlan((prevDetails) => ({
            ...prevDetails,
            translations: newTranslations,
        }));
    };

    const handleLanguageName = (name: String) => {
        if(name === "tr")
            return t('subscription.turkish');
        else if(name === "en")
            return t('subscription.english');
        else
            return name
    }
    return (
        <div>
            <Grid container spacing={3} padding={3}>
                {plans.map((plan) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={plan.id}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                    >
                        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {plan.translations.find((translation) => translation.language === language)?.name || 'Unknown'}
                                </Typography>
                                <Typography variant="h6" component="div">
                                    {plan.translations.find((translation) => translation.language === language)?.description || 'Unknown'}
                                </Typography>
                                <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                                    ${plan.price}/{t('subscription.monthly')}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handleEditPlanOpen(plan)}>{t('subscription.edit')}</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 3,
                            width: '100%',
                            backgroundColor: '#f5f5f5',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                        onClick={handleAddPlanOpen}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <AddIcon sx={{ fontSize: '5rem', color: 'primary.main' }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Plan Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>{t('Add New Plan')}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="price"
                        label={t('subscription.price')}
                        fullWidth
                        value={planDetails.price}
                        onChange={handlePlanDetailsChange}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('subscription.roles')}</InputLabel>
                        <Select
                            multiple
                            value={planDetails.roles}
                            onChange={handleRolesChange}
                            renderValue={(selected: string[]) => selected.join(', ')}
                        >
                            {roleList.map((role) => (
                                <MenuItem key={role.roleId} value={role.roleName}>
                                    <Checkbox checked={planDetails.roles.indexOf(role.roleName) > -1} />
                                    {role.roleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {planDetails.planTranslations.map((translation, index) => (
                        <div key={index}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>{t('subscription.language')}</InputLabel>
                                <Select
                                    value={translation.language}
                                    onChange={(event) => handleLanguageChange(event, index)}
                                >
                                    <MenuItem value="en">{t('subscription.english')}</MenuItem>
                                    <MenuItem value="tr">{t('subscription.turkish')}</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                margin="dense"
                                name="name"
                                label={t('subscription.name')}
                                fullWidth
                                value={translation.name}
                                onChange={(event) => handleTranslationChange(event, index)}  // Corrected here
                            />

                            <TextField
                                margin="dense"
                                name="description"
                                label={t('subscription.description')}
                                fullWidth
                                value={translation.description}
                                onChange={(event) => handleTranslationChange(event, index)}  // Corrected here
                            />

                        </div>
                    ))}

                    <Button onClick={handleAddTranslation} variant="outlined" sx={{ marginTop: 2 }}>
                        {t('subscription.addTranslation')}
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>{t('subscription.cancel')}</Button>
                    <Button onClick={handleAddPlan}>{t('subscription.save')}</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Plan Dialog */}
            {selectedPlan && (
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>{t('subscription.editPlan')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label={t('subscription.price')}
                            type='number'
                            fullWidth
                            value={selectedPlan.price}
                            onChange={(e) => setSelectedPlan({ ...selectedPlan, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                        />
                        <FormControl margin="dense" fullWidth>
                            <InputLabel>{t('subscription.roles')}</InputLabel>
                            <Select
                                multiple
                                value={selectedPlan.roles}
                                onChange={(e) => setSelectedPlan({ ...selectedPlan, roles: e.target.value as string[] })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {roleList.map((role) => (
                                    <MenuItem key={role.roleId} value={role.roleName}>
                                        <Checkbox checked={selectedPlan.roles.includes(role.roleName)} />
                                        {role.roleName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedPlan.translations.map((translation, index) => (
                            <div key={translation.id}>
                                <Typography variant="subtitle1">{t('subscription.language')}: {handleLanguageName(translation.language)}</Typography>
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label={t('subscription.name')}
                                    fullWidth
                                    value={translation.name}
                                    onChange={(e) => handleTranslationChangeEdit(e, index)}
                                />
                                <TextField
                                    margin="dense"
                                    name="description"
                                    label={t('subscription.description')}
                                    fullWidth
                                    value={translation.description}
                                    onChange={(e) => handleTranslationChangeEdit(e, index)}
                                />

                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>{t('subscription.cancel')}</Button>
                        <Button onClick={handleUpdatePlan}>{t('subscription.update')}</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default Subscription;
