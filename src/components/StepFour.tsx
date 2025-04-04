import React, { useState, useEffect } from 'react';
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
  Button,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface StepFourProps {
  onNext: () => void;
  onBack: () => void;
}

interface DisabilityData {
  hasDisability: string;
  blindness: boolean;
  cerebralPalsy: boolean;
  deafness: boolean;
  speechImpairment: boolean;
  other: string;
  extraAdaptations: string;
}

const StepFour: React.FC<StepFourProps> = ({ onNext, onBack }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [initialData, setInitialData] = useState<DisabilityData | null>(null);

  // Load existing disability data
  useEffect(() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
      if (storedData.disabilities) {
        const disabilityData = storedData.disabilities;
        setHasDisability(disabilityData.hasDisability.toLowerCase());
        setDisabilities({
          blindness: disabilityData.blindness || false,
          cerebralPalsy: disabilityData.cerebralPalsy || false,
          deafness: disabilityData.deafness || false,
          speechImpairment: disabilityData.speechImpairment || false,
          other: !!disabilityData.other,
        });
        setOtherDescription(disabilityData.other || '');
        setExtraAdaptations(disabilityData.extraAdaptations || '');
        setInitialData(disabilityData);
      }
    } catch (error) {
      console.error('Error loading disability data:', error);
    }
  }, []);

  const handleDisabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasDisability(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisabilities({
      ...disabilities,
      [event.target.name]: event.target.checked,
    });
  };

  const hasDataChanged = () => {
    if (!initialData) return true;

    const currentData = {
      hasDisability: hasDisability === 'yes' ? "Yes" : "No",
      blindness: disabilities.blindness,
      cerebralPalsy: disabilities.cerebralPalsy,
      deafness: disabilities.deafness,
      speechImpairment: disabilities.speechImpairment,
      other: disabilities.other ? otherDescription : "",
      extraAdaptations: extraAdaptations
    };

    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  };

  const handleSubmit = async () => {
    const referenceNumber = sessionStorage.getItem('applicationReference');
    if (!referenceNumber) {
      setSnackbarMessage('Application reference not found. Please start from step one.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Check if data has changed
    if (!hasDataChanged()) {
      setSnackbarMessage('No changes to disability information, proceeding to next step');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onNext();
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);
      
      const disabilityData = {
        hasDisability: hasDisability === 'yes' ? "Yes" : "No",
        blindness: disabilities.blindness,
        cerebralPalsy: disabilities.cerebralPalsy,
        deafness: disabilities.deafness,
        speechImpairment: disabilities.speechImpairment,
        other: disabilities.other ? otherDescription : "",
        extraAdaptations: extraAdaptations
      };

      const response = await fetch(`http://localhost:3000/dev/api/v1/applications/${referenceNumber}/disabilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disabilityData),
      });

      if (!response.ok) {
        throw new Error('Failed to save disability information');
      }

      setSnackbarMessage('Disability information updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to save disability information. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: {sessionStorage.getItem('applicationReference')}. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
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

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ 
            color: '#13A215',
            borderColor: '#13A215',
            '&:hover': {
              borderColor: '#0B8A0D',
              backgroundColor: 'rgba(19, 162, 21, 0.04)',
            },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Next'}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepFour; 