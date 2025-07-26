import React from 'react';
import { Table, Typography } from 'antd';

const TopScorersTable = ({ data }) => {
  const columns = [
    { title: '#', render: (_, __, i) => i + 1 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Score', dataIndex: 'score' },
  ];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Typography.Title level={5}>🏆 Highest Scores</Typography.Title>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="email"
        pagination={false}
        scroll={{ x: 'max-content' }}
        size="middle"
        bordered
      />
    </div>
  );
};

export default TopScorersTable;
