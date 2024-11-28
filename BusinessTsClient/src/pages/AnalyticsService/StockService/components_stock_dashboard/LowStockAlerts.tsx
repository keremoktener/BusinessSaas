import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockCount: number;
    minimumStockLevel: number;
}

interface LowStockAlertsProps {
    lowStock: Product[];
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ lowStock }) => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" gutterBottom align="center">
                Low Stock Alerts
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock Count</TableCell>
                        <TableCell>Minimum Stock Level</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lowStock.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.stockCount}</TableCell>
                            <TableCell>{product.minimumStockLevel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LowStockAlerts;
