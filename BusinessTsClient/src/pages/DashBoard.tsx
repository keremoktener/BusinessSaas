import React from 'react';
import StatCard, { StatCardProps } from '../components/core/components_dashboard/StatCard';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { LatestProducts } from '../components/core/components_dashboard/LatestProducts';
import { Sales } from '../components/core/components_dashboard/Sales';

function DashBoard() {
  const { t } = useTranslation();
  const data: StatCardProps[] = [
    {
      title: t('dashboard.numberofemployees'),
      value: '976',
      interval: `${t('dashboard.last')} 30 ${t('dashboard.days')}`,
      trend: 'up',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: t('dashboard.dailyincome'),
      value: '32500',
      interval: `${t('dashboard.last')} 30 ${t('dashboard.days')}`,
      trend: 'up',
      data: [
        10, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 444,
      ],
    },
    {
      title: t('dashboard.dailyexpense'),
      value: '20000',
      interval: `${t('dashboard.last')} 30 ${t('dashboard.days')}`,
      trend: 'down',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: t('dashboard.products'),
      value: '22',
      interval: `${t('dashboard.last')} 30 ${t('dashboard.days')}`,
      trend: 'neutral',
      data: [
        3, 4, 4, 5, 5, 5, 5, 5, 6, 8, 9, 6, 12, 13, 14, 14,
        14, 13, 17, 15, 11, 13, 19, 22, 33, 11, 33, 22, 33, 22,
      ],
    },
  ];

  // Sample data for the Sales component
  const salesData = [
    {
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 65, 80, 90]
    }
  ];

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}></Box>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ sm: 12, md: 6 }}>
          <Sales chartSeries={salesData} />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <LatestProducts
            products={[
              
              
              { id: '005', productName: 'Product 5', price: 25.1 },
              { id: '004', productName: 'Product 4', price: 10.99 },
              { id: '003', productName: 'Product 3', price: 96.43 },
              { id: '002', productName: 'Product 2', price: 77.17 },
              { id: '001', productName: 'Product 1', price: 29.26 },
            ]}
          />
        </Grid>
      </Grid>
      <Box />
    </>
  );
}

export default DashBoard;
