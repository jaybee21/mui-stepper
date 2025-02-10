import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';

const StepThree: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactTel, setContactTel] = useState('');

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number:#######. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <TextField
        fullWidth
        label="First Name"
        variant="outlined"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Last Name"
        variant="outlined"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Relationship to Applicant"
        variant="outlined"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Contact Address of Next of Kin"
        variant="outlined"
        value={contactAddress}
        onChange={(e) => setContactAddress(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Contact Tel"
        variant="outlined"
        value={contactTel}
        onChange={(e) => setContactTel(e.target.value)}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default StepThree; 