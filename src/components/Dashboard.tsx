import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Admin Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage your application and access various features.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Go to User Management
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
        Go to Settings
      </Button>
    </Box>
  );
};

export default Dashboard; 