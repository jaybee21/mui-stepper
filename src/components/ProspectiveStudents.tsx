import React, { FC } from 'react';
import { Box, Typography, Card } from '@mui/material';

interface ProspectiveStudentsProps {
  totalProspective: number;
}

const ProspectiveStudents: FC<ProspectiveStudentsProps> = ({ totalProspective }) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Prospective Students
      </Typography>
      <Card sx={{ p: 3 }}>
        <Typography variant="body1">
          This section displays all prospective students who have completed the application process.
          Total: {totalProspective} students
        </Typography>
        <Box sx={{ mt: 3, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Table of prospective students would be displayed here...
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ProspectiveStudents; 