import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useTranslation} from "react-i18next";




export interface LatestProductsProps {
  products?: Product[];
}


  
  export interface Product {
    id: string;
    productName: string;
    price: number;

  }
  
  export interface LatestProductsProps {
    products?: Product[];
  }

export function LatestProducts({ products = [] }: LatestProductsProps): React.JSX.Element {
    const {t} = useTranslation()
    return (
        <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
          <CardHeader title={t('dashboard.latest') + " " + t('dashboard.products')}  />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('dashboard.product')}</TableCell>
                  <TableCell>{t('dashboard.product')} {t('dashboard.name')}</TableCell>
                  <TableCell>{t('dashboard.price')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  
    
                  return (
                    <TableRow hover key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              size="small"
              variant="text"
            >
               {t('dashboard.viewall')}
            </Button>
          </CardActions>
        </Card>
      );
    }