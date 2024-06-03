import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const SideBarChartDataes = styled.div`
  margin-top: 5px;
  padding: 20px;
  text-align: center;
  line-height: 1.5rem;
  font-size: 18px;
  font-weight: 400;
  color: #333333;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, font-size 0.3s ease;

  cursor: zoom-in;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 20px;
  }
`;
const SideBarChartData = styled.p`
  margin-bottom: 5px;
  border-radius: 5px;
`;

const COLORS = [
  '#73AB84',

  '#79C7C5',

  '#857885',

  '#87A0B2',

  '#A4BEF3',

  '#C0CAAD',
];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  data,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${data[index].subject}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>현재 데이터가 존재하지 않습니다.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="25%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) =>
            renderCustomizedLabel({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
              index,
              data, // 데이터 전달
            })
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="A"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <SideBarChartDataes>
        {data.map((item, index) => (
          <SideBarChartData key={index}>
            {item.subject} : {item.A}건,{' '}
            {(
              (item.A / data.reduce((acc, cur) => acc + cur.A, 0)) *
              100
            ).toFixed(0)}
            %
          </SideBarChartData>
        ))}
      </SideBarChartDataes>
    </ResponsiveContainer>
  );
};

export default Chart;
