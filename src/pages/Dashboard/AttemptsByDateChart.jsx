
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Typography } from 'antd';

const AttemptsByDateChart = ({ responses }) => {
  const hasData = responses && Object.keys(responses)?.length > 0;

  if (!hasData) {
    return (
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        📭 No attempt data available.
      </Typography.Text>
    );
  }
  const chartData = Object.entries(responses || {})?.map(([date, count]) => ({
    date,
    attempts: count,
  }));

  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Typography.Title
        level={5}
        style={{
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        📅 Attempts Over Time
      </Typography.Title>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip
            contentStyle={{ fontSize: '12px' }}
            labelStyle={{ fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="attempts"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttemptsByDateChart;
