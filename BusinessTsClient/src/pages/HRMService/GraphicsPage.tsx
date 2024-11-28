import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';


import { fetchDepartmentAverageScores, fetchNumberOfEmployeeMen, fetchNumberOfEmployeesInDepartments, fetchNumberOfEmployeeWomen, fetchUpcomingBirthdays } from '../../store/feature/hrmSlice';
import { AppDispatch, RootState } from '../../store';

import { UpcomingBirthDates } from '../../components/core/components_dashboard/UpcomingBirthDates';


function GraphicsPage() {
    const { t } = useTranslation();
    const dispatch: AppDispatch = useDispatch();


    const numberOfMen = useSelector((state: RootState) => state.hrmSlice.numberOfMen);
    const numberOfWomen = useSelector((state: RootState) => state.hrmSlice.numberOfWomen);
    const departmentEmployeeCount = useSelector((state: RootState) => state.hrmSlice.departmentEmployeeCount);
    const [birthDates, setBirthDates] = useState<BirthDateResponseDTO[]>([]);
    const [departmentScores, setDepartmentScores] = useState<DepartmentScoreResponseDTO[]>([]);


    interface BirthDateResponseDTO {

        firstName: string;
        lastName: string;
        birthDate: string;


    }
    interface DepartmentScoreResponseDTO {
        department: string;
        averageScore: number;


    }

    const fetchDepartmentScores = async () => {
        try {
            const response = await dispatch(fetchDepartmentAverageScores());
            if (fetchDepartmentAverageScores.fulfilled.match(response)) {
                setDepartmentScores(response.payload);
            } else {
                console.error('Error fetching department average scores:', response.error);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };
    const pieChartData = Object.entries(departmentEmployeeCount).map(([department, count], index) => ({
        id: index,
        value: count,
        label: department,
    }));
    const fetchData = async () => {

        try {
            const response = await dispatch(fetchUpcomingBirthdays());
            if (fetchUpcomingBirthdays.fulfilled.match(response)) {
                setBirthDates(response.payload);
            } else {
                console.error('Error fetching upcoming birthdays:', response.error);

            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };





    useEffect(() => {
        dispatch(fetchNumberOfEmployeeMen());
        dispatch(fetchNumberOfEmployeeWomen());
        dispatch(fetchNumberOfEmployeesInDepartments());
        fetchDepartmentScores();
        fetchData();
    }, [dispatch]);

    const xLabels = departmentScores.map(score => score.department);
    const uData = departmentScores.map(score => score.averageScore);
    



    return (
        <>
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}></Box>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >

                <Grid

                    size={{ sm: 12, md: 6 }}
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    sx={{ mt: 5 }}
                >
                    <Typography variant="h4" component="div" gutterBottom>
                        {t("hrmService.distribution_of_men_and_woman")}
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: numberOfMen, label: t("hrmService.man") },
                                    { id: 1, value: numberOfWomen, label: t("hrmService.woman") },
                                ],
                            },
                        ]}
                        width={400}
                        height={250}
                    />
                </Grid>
                <Grid
                    size={{ sm: 12, md: 6 }}
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    sx={{ mt: 5 }}
                >
                    <Typography variant="h4" component="div" gutterBottom>
                        {t("hrmService.department_distribution")}
                    </Typography>
                    <PieChart
                        series={[{ data: pieChartData }]}
                        width={400}
                        height={250}
                    />
                </Grid>
                
                <Grid
                    size={{ sm: 12, md: 6 }}
                    sx={{
                        mt: 15,
                        
                        border: '1px solid', 
                        borderColor: 'grey.400', 
                        borderRadius: '8px', 
                        padding: '16px', 
                        backgroundColor: 'white', 
                    }}
                >
                    <Typography variant="h5" component="div" gutterBottom>
                        {t("hrmService.department_score")}
                    </Typography>
                    <BarChart
                        width={900}
                        height={400}
                        series={[{ data: uData, id: 'uvId' }]}
                        xAxis={[{ data: xLabels, scaleType: 'band' }]}
                        
                    />
                </Grid>
                <Grid size={{ sm: 12, md: 6 }} sx={{ mt: 15 }}>
                    <UpcomingBirthDates birthDates={birthDates} />
                </Grid>




            </Grid>
            <Box />
        </>
    );
}

export default GraphicsPage;
