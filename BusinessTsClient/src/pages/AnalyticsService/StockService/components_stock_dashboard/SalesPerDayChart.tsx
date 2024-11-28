// SalesPerDayChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SalesData {
    date: string;
    value: number;
}

interface SalesPerDayChartProps {
    salesData: Record<string, number>;
}

const SalesPerDayChart: React.FC<SalesPerDayChartProps> = ({ salesData }) => {
    const data: SalesData[] = Object.entries(salesData).map(([date, value]) => ({
        date,
        value,
    }));

    return (
        <BarChart width={500} height={300} data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
    );
};

export default SalesPerDayChart;
