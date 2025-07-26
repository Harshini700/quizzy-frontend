import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Row, Col, Card, Statistic, Typography, Spin, Space, Table, Avatar, Dropdown, Menu
} from 'antd';
import {
  ClockCircleOutlined, CheckCircleOutlined, LineChartOutlined, PieChartOutlined,
  UserOutlined, LogoutOutlined
} from '@ant-design/icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ScorePieChart = ({ pass, fail }) => {
  const data = [
    { name: 'Pass', value: pass },
    { name: 'Fail', value: fail }
  ];
  const COLORS = ['#00C49F', '#FF4D4F'];
  return (
    <PieChart width={200} height={160}>
      <Pie data={data} cx="50%" cy="50%" outerRadius={60} label dataKey="value">
        {data.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
      </Pie>
      <Legend />
    </PieChart>
  );
};

const AttemptsByDateChart = ({ data }) => (
  data.length === 0
    ? <Typography.Text>No attempt data</Typography.Text>
    : <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1890ff" />
        </LineChart>
      </ResponsiveContainer>
);

const TopScorersTable = ({ data }) => (
  <>
    <Typography.Title level={5}>🏆 Top Scorers</Typography.Title>
    <Table
      columns={[
        { title: '#', render: (_, __, i) => i + 1 },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phone' },
        { title: 'Score', dataIndex: 'score' },
      ]}
      dataSource={data}
      pagination={false}
      rowKey={(r, idx) => r.email + idx}
    />
  </>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('quizUser') || '{}');
  const firstName = user?.name?.split(' ')[0] || 'User';

  const fetchUserSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/summary/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Summary fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSummary();
  }, []);

  const formatTime = sec => `${Math.floor(sec / 60)}m ${sec % 60}s`;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  if (loading) return <Spin tip="Loading..." style={{ marginTop: 100 }} />;

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }} size="large">
      <Row justify="space-between" align="middle">
        <Typography.Title level={4}>
          👋 Hello, Quizzers
        </Typography.Title>
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }} />
        </Dropdown>
      </Row>

      <Typography.Title level={3}>📊 Quiz Dashboard</Typography.Title>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Avg Score" value={`${data.averageScore.toFixed(2)}%`} prefix={<LineChartOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Attempts" value={data.totalAttempts} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Avg Time" value={formatTime(data.averageTimeSpent)} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col span={6}>
          <Card>
            <Typography.Title level={5}><PieChartOutlined /> Pass vs Fail</Typography.Title>
            <ScorePieChart pass={data.passCount} fail={data.failCount} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}><Card title="📈 Attempts Over Time"><AttemptsByDateChart data={data.responseByDate} /></Card></Col>
        <Col span={12}><Card title="👥 First 10 Participants">
          <Table
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'Email', dataIndex: 'email' },
              { title: 'Phone', dataIndex: 'phone' },
            ]}
            dataSource={data.participants}
            pagination={false}
            rowKey={(r, i) => r.email + i}
          />
        </Card></Col>
      </Row>

      <Card title="📝 Created Quizzes">
        <Typography.Text>Total: {data.quizSummary.count}</Typography.Text><br />
        <Typography.Paragraph>Titles: {data.quizSummary.titles.join(', ') || 'N/A'}</Typography.Paragraph>
      </Card>
    </Space>
  );
};

export default Dashboard;
