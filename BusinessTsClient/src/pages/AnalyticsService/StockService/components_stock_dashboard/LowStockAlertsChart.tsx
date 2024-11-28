// LowStockAlertsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LowStockItem {
    name: string;
    stockCount: number;
}

interface LowStockAlertsChartProps {
    lowStock: LowStockItem[];
}

const LowStockAlertsChart: React.FC<LowStockAlertsChartProps> = ({ lowStock }) => {
    return (
        <BarChart width={500} height={300} data={lowStock}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="stockCount" fill="#8884d8" />
        </BarChart>
    );
};

export default LowStockAlertsChart;
