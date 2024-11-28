import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import TotalSales from './components_stock_dashboard/TotalSales';
import SalesPerDay from './components_stock_dashboard/SalesPerDay';
import LowStockAlerts from './components_stock_dashboard/LowStockAlerts';
import SuppliersPerCountry from './components_stock_dashboard/SuppliersPerCountry';
import TotalSalesChart from './components_stock_dashboard/TotalSalesChart';
import SalesPerDayChart from './components_stock_dashboard/SalesPerDayChart';
import LowStockAlertsChart from './components_stock_dashboard/LowStockAlertsChart';
import SuppliersPerCountryChart from './components_stock_dashboard/SuppliersPerCountryChart';
import axios from 'axios';

const StockDashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [salesPerDay, setSalesPerDay] = useState({});
    const [lowStock, setLowStock] = useState([]);
    const [suppliers, setSuppliers] = useState<{ [country: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [totalSalesResponse, salesPerDayResponse, lowStockResponse, suppliersResponse] = await Promise.all([
                    axios.get('http://localhost:9094/dev/v1/analytics/stocks/get-total-sales'),
                    axios.get('http://localhost:9094/dev/v1/analytics/stocks/sales-per-day'),
                    axios.post('http://localhost:9094/dev/v1/analytics/stocks/low-stock'),
                    axios.post('http://localhost:9094/dev/v1/analytics/stocks/num-of-suppliers-per-country')
                ]);

                setTotalSales(totalSalesResponse.data.data);
                setSalesPerDay(salesPerDayResponse.data.data);
                setLowStock(lowStockResponse.data.data);
                setSuppliers(suppliersResponse.data.data);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleDownload = async (url: string, filename: string) => {
      try {
          const response = await axios.get(url, {
              responseType: 'blob',
          });
          const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = urlBlob;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Error downloading file:", error);
      }
  };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Stock Service Analytics</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <TotalSales totalSales={totalSales} />
                        </Grid>
                        <Grid item xs={6}>
                            <TotalSalesChart totalSales={totalSales} />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            variant="outlined"
                            onClick={() => handleDownload('http://localhost:9094/dev/v1/analytics/stocks/export-total-sales', 'TotalSales.xlsx')}
                          >
                            Download Report
                          </Button>
                      </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <SalesPerDay salesData={salesPerDay} />
                        </Grid>
                        <Grid item xs={6}>
                            <SalesPerDayChart salesData={salesPerDay} />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            variant="outlined"
                            onClick={() => handleDownload('http://localhost:9094/dev/v1/analytics/stocks/export-sales-per-day', 'Sales-per-day.xlsx')}
                          >
                            Download Report
                          </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <LowStockAlerts lowStock={lowStock} />
                        </Grid>
                        <Grid item xs={6}>
                            <LowStockAlertsChart lowStock={lowStock} />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            variant="outlined"
                            onClick={() => handleDownload('http://localhost:9094/dev/v1/analytics/stocks/export-low-stock-alerts', 'lowStock.xlsx')}
                          >
                            Download Report
                          </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <SuppliersPerCountry suppliers={suppliers} />
                        </Grid>
                        <Grid item xs={6}>
                            <SuppliersPerCountryChart suppliersData={suppliers} />
                        </Grid>
                        <Grid item xs={1}>
                         <Button
                            variant="outlined"
                            onClick={() => handleDownload('http://localhost:9094/dev/v1/analytics/stocks/export-suppliers-per-country', 'SuppliersPerCountry.xlsx')}
                         >
                            Download Report
                         </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StockDashboard;
