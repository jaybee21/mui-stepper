import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const StepOne: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NB: Complete all sections of the form.
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Year in which you wish to commence your studies</InputLabel>
        <Select defaultValue="">
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Starting Semester</InputLabel>
        <Select defaultValue="">
          <MenuItem value="March-June">March-June</MenuItem>
          <MenuItem value="August-December">August-December</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Programme being applied for</InputLabel>
        <Select defaultValue="">
          <MenuItem value="Program A">Program A</MenuItem>
          <MenuItem value="Program B">Program B</MenuItem>
          <MenuItem value="Program C">Program C</MenuItem>
          {/* Add more programs as needed */}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Satellite Campus</InputLabel>
        <Select defaultValue="">
          <MenuItem value="UK">UK</MenuItem>
          <MenuItem value="Bulawayo">Bulawayo</MenuItem>
          <MenuItem value="Harare">Harare</MenuItem>
          <MenuItem value="Kadoma">Kadoma</MenuItem>
          <MenuItem value="Marondera">Marondera</MenuItem>
          <MenuItem value="Mutare">Mutare</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Preferred Session</InputLabel>
        <Select defaultValue="">
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Day">Day</MenuItem>
          <MenuItem value="Evening">Evening</MenuItem>
          <MenuItem value="Weekend">Weekend</MenuItem>
          <MenuItem value="Block">Block</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>How did you know about WUA?</InputLabel>
        <Select defaultValue="">
          <MenuItem value="LinkedIn">LinkedIn</MenuItem>
          <MenuItem value="Facebook">Facebook</MenuItem>
          <MenuItem value="Google">Google</MenuItem>
          <MenuItem value="Friend">Friend</MenuItem>
          {/* Add more options as needed */}
        </Select>
      </FormControl>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Have you ever been registered with this University before?
      </Typography>
      <RadioGroup row>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        For returning applicants who want to edit their application:
      </Typography>
      <TextField
        fullWidth
        label="Enter Reference Number"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Enter Surname (First 4 Characters only)"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Enter Year of Birth"
        variant="outlined"
        type="number"
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        WUA Banking Details
      </Typography>
      <Typography>
        Women's University in Africa
      </Typography>
      <Typography>
        CBZ Borrowdale Branch
      </Typography>
      <Typography>
        FCA Account No.: 029 21125540040
      </Typography>
      <Typography>
        SWIFT CODE: COBZZWHA
      </Typography>
      <Typography>
        BANK ADDRESS: Cnr Edinburgh & Campbell Rd, Pomona, Borrowdale, Harare, Zimbabwe
      </Typography>
    </Box>
  );
};

export default StepOne; 