import React, { FC } from 'react';
import { Box, Typography, Card } from '@mui/material';

interface WaitingPinProps {
  totalWaitingPin: number;
}

const WaitingPin: FC<WaitingPinProps> = ({ totalWaitingPin }) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Applicants Waiting for PIN
      </Typography>
      <Card sx={{ p: 3 }}>
        <Typography variant="body1">
          This section displays all applicants who have been accepted but are waiting for their PIN.
          Total: {totalWaitingPin} applicants
        </Typography>
        <Box sx={{ mt: 3, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Table of applicants would be displayed here...
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default WaitingPin; 