import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
} from '@mui/material';

const StepFour: React.FC = () => {
  const [hasDisability, setHasDisability] = useState('no');
  const [disabilities, setDisabilities] = useState({
    blindness: false,
    cerebralPalsy: false,
    deafness: false,
    speechImpairment: false,
    other: false,
  });
  const [otherDescription, setOtherDescription] = useState('');
  const [extraAdaptations, setExtraAdaptations] = useState('');

  const handleDisabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasDisability(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisabilities({
      ...disabilities,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: APL254002. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Do you have any disabilities?
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup row value={hasDisability} onChange={handleDisabilityChange}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {hasDisability === 'yes' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please specify your disabilities:
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabilities.blindness}
                  onChange={handleCheckboxChange}
                  name="blindness"
                />
              }
              label="Blindness"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabilities.cerebralPalsy}
                  onChange={handleCheckboxChange}
                  name="cerebralPalsy"
                />
              }
              label="Cerebral Palsy"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabilities.deafness}
                  onChange={handleCheckboxChange}
                  name="deafness"
                />
              }
              label="Deafness"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabilities.speechImpairment}
                  onChange={handleCheckboxChange}
                  name="speechImpairment"
                />
              }
              label="Speech Impairment"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabilities.other}
                  onChange={handleCheckboxChange}
                  name="other"
                />
              }
              label="Other"
            />
          </FormGroup>

          {disabilities.other && (
            <TextField
              fullWidth
              label="Please specify"
              variant="outlined"
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Extra educational and environmental adaptations required?
          </Typography>
          <TextField
            fullWidth
            label="Describe adaptations"
            variant="outlined"
            value={extraAdaptations}
            onChange={(e) => setExtraAdaptations(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default StepFour; 