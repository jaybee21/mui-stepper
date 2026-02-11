import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';
import wuaLogo from './wua-logo.png';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Fetch user role from the API using the logged-in user's ID
    const fetchUserRole = async () => {
     
      
      try {
        const userId = sessionStorage.getItem('userId');
        

        if (!userId) {
          console.error('No user ID found in session storage');
          return;
        }

        
        const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/users/id/${userId}`);
        

        if (response.ok) {
          const data = await response.json();
          
          setUserRole(data.role);
        } else { 
          const errorText = await response.text();
        }
      } catch (error) {
        
      }
    };

    fetchUserRole();
  }, []);

  // Log whenever userRole changes
  useEffect(() => {
    
  }, [userRole]);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    ...(userRole === 'admin' ? [
      {
        text: 'User Management',
        icon: <PeopleIcon />,
        path: '/user-management',
      },
    ] : []),
  ];


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E3E6DE',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src={wuaLogo}
          alt="WUA"
          sx={{ width: 34, height: 34, bgcolor: 'white', borderRadius: '50%', p: 0.5 }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ color: '#1B1F1B', fontWeight: 700 }}>
            WUA Portal
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Admin Navigation
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(19, 162, 21, 0.08)',
                borderRight: '4px solid #EEB422',
                '&:hover': {
                  backgroundColor: 'rgba(19, 162, 21, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(19, 162, 21, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#13A215' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: location.pathname === item.path ? '#13A215' : 'inherit' }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 
