import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

interface TotalSalesChartProps {
    totalSales: number;
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ totalSales }) => {
    const data = [
        { name: 'Total Sales', value: totalSales },
        { name: 'Remaining', value: 10000000 - totalSales },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                cx={300}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default TotalSalesChart;
