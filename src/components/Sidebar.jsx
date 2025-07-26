// src/components/Sidebar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton,
  Divider,
  ListItemIcon
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Quizzes', path: '/quizzes' },
    { label: 'Create Quiz', path: '/create' },
    { label: 'Global Settings', path: '/settings' },
    { label: 'Questions', path: '/questions' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#083344',
          color: 'white',
        },
      }}
    >
      <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
        QUIZZY
      </Typography>
      <List>
        {menu.map((item) => (
          <ListItem disablePadding key={item.path}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': { backgroundColor: '#0e7490', color: 'white' },
                '&:hover': { backgroundColor: '#155e75' },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: '#155e75', my: 2 }} />
     <ListItemButton
  onClick={handleLogout}
  sx={{ color: 'white', '&:hover': { backgroundColor: '#991b1b' } }}
>
  <ListItemIcon sx={{ color: 'white' }}>
    <LogoutOutlinedIcon />
  </ListItemIcon>
  <ListItemText primary="Logout" />
</ListItemButton>
    </Drawer>
  );
};

export default Sidebar;
