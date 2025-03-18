import React, { FC } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

// Move the sample data to a separate file later
const waitingAcceptanceData = [
  {
    id: 1,
    applicationNumber: 'APP-2023-001',
    status: 'Pending Review',
    updatedOn: '2023-06-15',
    submittedOn: '2023-06-10',
  },
  // ... rest of the data
];

interface WaitingAcceptanceProps {
  totalWaiting: number;
}

const WaitingAcceptance: FC<WaitingAcceptanceProps> = ({ totalWaiting }) => {
  const handleViewDetails = (applicationId: number) => {
    console.log(`View details for application ${applicationId}`);
    alert(`Viewing details for application ${applicationId}`);
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return 'warning';
      case 'Documents Verification':
        return 'info';
      case 'Interview Scheduled':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Applicants Waiting for Acceptance
      </Typography>
      
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          This section displays all applicants who have submitted their applications and are waiting for acceptance.
          Total: {totalWaiting} applicants
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }} aria-label="waiting acceptance table">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Application Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status / Remarks</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Updated On</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted On</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {waitingAcceptanceData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(19, 162, 21, 0.04)' } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.applicationNumber}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusChipColor(row.status) as "warning" | "info" | "success" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.updatedOn}</TableCell>
                  <TableCell>{row.submittedOn}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(row.id)}
                      sx={{ 
                        color: '#13A215', 
                        borderColor: '#13A215',
                        '&:hover': {
                          borderColor: '#13A215',
                          backgroundColor: 'rgba(19, 162, 21, 0.04)',
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default WaitingAcceptance; 