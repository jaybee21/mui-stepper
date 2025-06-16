import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import paynowLogo from '../assets/paynowlogo.png';

interface StepEightProps {
  onNext: () => void;
}

const StepEight: React.FC<StepEightProps> = ({ onNext }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(event.target.checked);
  };

  const handleSubmit = () => {
    if (isAgreed) {
      // Clear session storage items
      sessionStorage.removeItem('applicationData');
      sessionStorage.removeItem('applicationReference');
      
      alert("Application submitted successfully!");
      onNext();
    } else {
      alert("You must agree to the terms and conditions before submitting.");
    }
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

      {/* PayNow Section */}
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#13A215' }}>
          Click below to make your payment via PayNow
        </Typography>
        <Box 
          component="a"
          href="https://www.topup.co.zw/pay-bill/womens-university"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-block',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(19, 162, 21, 0.4)',
              },
              '70%': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 0 10px rgba(19, 162, 21, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(19, 162, 21, 0)',
              },
            },
            '&:hover': {
              transform: 'scale(1.1)',
              '& img': {
                borderColor: '#1DBDD0',
              },
            },
          }}
        >
          <img 
            src={paynowLogo}
            alt="PayNow Payment" 
            style={{ 
              maxWidth: '200px',
              height: 'auto',
              border: '2px solid #13A215',
              borderRadius: '8px',
              padding: '8px',
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Click the PayNow logo above to proceed with your payment
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        disabled={!isAgreed}
      >
        Submit Application
      </Button>
    </Box>
  );
};

export default StepEight; 