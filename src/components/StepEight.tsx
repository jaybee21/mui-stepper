import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface StepEightProps {
  onNext: () => void;
}

const StepEight: React.FC<StepEightProps> = ({ onNext }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(event.target.checked);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: APL254002. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        I declare that I will be bound by the policies and regulations as amended from time to time.
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={isAgreed}
            onChange={handleAgreementChange}
          />
        }
        label="I agree to the terms and conditions"
      />

      <Button
        variant="contained"
        onClick={() => {
          if (isAgreed) {
            // Handle submission logic here
            alert("Application submitted successfully!");
            onNext();
          } else {
            alert("You must agree to the terms and conditions before submitting.");
          }
        }}
        sx={{ mt: 2 }}
        disabled={!isAgreed}
      >
        Submit Application
      </Button>
    </Box>
  );
};

export default StepEight; 