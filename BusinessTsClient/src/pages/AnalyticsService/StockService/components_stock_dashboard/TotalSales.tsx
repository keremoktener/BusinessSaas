import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface TotalSalesProps {
    totalSales: number;
}

const TotalSales: React.FC<TotalSalesProps> = ({ totalSales }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Total Sales</Typography>
                <Typography variant="h4">{totalSales ? `$${totalSales}` : 'No Data'}</Typography>
            </CardContent>
        </Card>
    );
};

export default TotalSales;
