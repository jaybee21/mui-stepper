import { FC } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import logo from './wua-logo.png';

const Header: FC = () => {
  return (
    <AppBar position="static" sx={{ 
      background: '#13A215',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo}
            alt="Women's University of Africa Logo" 
            style={{ 
              height: '60px', 
              marginRight: '20px',
              backgroundColor: 'white',
              padding: '5px',
              borderRadius: '5px'
            }} 
          />
          <Box>
            <Typography variant="h5" component="h1" sx={{ 
              fontWeight: 600,
              color: 'white',
              '@media (max-width: 600px)': {
                fontSize: '1.2rem',
              },
            }}>
              Women's University of Africa
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              opacity: 0.9,
              color: '#EEB422',
              '@media (max-width: 600px)': {
                fontSize: '0.9rem',
              },
            }}>
              Online Application Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 