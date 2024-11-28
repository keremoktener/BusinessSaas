import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';

interface SalesPerDayProps {
    salesData: { [key: string]: number };
}

const SalesPerDay: React.FC<SalesPerDayProps> = ({ salesData }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Sales Per Day</Typography>
                <Table>
                    <TableBody>
                        {Object.entries(salesData).map(([date, sales]) => (
                            <TableRow key={date}>
                                <TableCell>{date}</TableCell>
                                <TableCell>{`$${sales}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SalesPerDay;
