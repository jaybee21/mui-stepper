import React, { FC } from 'react';
import { Box, Typography, Card } from '@mui/material';

interface WithPinProps {
  totalWithPin: number;
}

const WithPin: FC<WithPinProps> = ({ totalWithPin }) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Applicants with PIN
      </Typography>
      <Card sx={{ p: 3 }}>
        <Typography variant="body1">
          This section displays all applicants who have received their PIN.
          Total: {totalWithPin} applicants
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

export default WithPin; 