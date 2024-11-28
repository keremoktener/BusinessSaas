// src/SuppliersPerCountryChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SuppliersPerCountryChartProps {
  suppliersData: { [key: string]: number };
}

const SuppliersPerCountryChart: React.FC<SuppliersPerCountryChartProps> = ({ suppliersData }) => {
  const chartData = Object.entries(suppliersData).map(([country, count]) => ({
    country,
    count,
  }));

  return (
    <BarChart width={500} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="country" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default SuppliersPerCountryChart;
