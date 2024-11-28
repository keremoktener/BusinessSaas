import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';

interface SuppliersPerCountryProps {
  suppliers: { [country: string]: number };
}

const SuppliersPerCountry: React.FC<SuppliersPerCountryProps> = ({ suppliers }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Suppliers Per Country</Typography>
        <Table>
          <TableBody>
            {Object.entries(suppliers).map(([country, count]) => (
              <TableRow key={country}>
                <TableCell>{country}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SuppliersPerCountry;
