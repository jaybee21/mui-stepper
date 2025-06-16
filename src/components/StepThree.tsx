import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import paynowLogo from '../assets/paynowlogo.png';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NextOfKinData {
  first_name: string;
  last_name: string;
  relationship: string;
  contact_address: string;
  contact_tel: string;
}

interface StepThreeProps {
  onNext: () => void;
  onBack: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ onNext, onBack }) => {
  const [initialData, setInitialData] = useState<NextOfKinData | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    contactAddress: '',
    contactTel: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Load existing next of kin data
  useEffect(() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
      if (storedData.nextOfKin?.[0]) {
        const nextOfKin = storedData.nextOfKin[0];
        setFormData({
          firstName: nextOfKin.first_name || '',
          lastName: nextOfKin.last_name || '',
          relationship: nextOfKin.relationship || '',
          contactAddress: nextOfKin.contact_address || '',
          contactTel: nextOfKin.contact_tel || '',
        });
        setInitialData(nextOfKin);
      }
    } catch (error) {
      console.error('Error loading next of kin data:', error);
    }
  }, []);

  const hasDataChanged = () => {
    if (!initialData) return true;

    const currentData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      relationship: formData.relationship,
      contact_address: formData.contactAddress,
      contact_tel: formData.contactTel,
    };

    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['firstName', 'lastName', 'relationship', 'contactAddress', 'contactTel'];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Phone validation
    if (formData.contactTel && !/^\+?[\d\s-]{10,}$/.test(formData.contactTel)) {
      newErrors.contactTel = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fill in all required fields correctly');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const referenceNumber = sessionStorage.getItem('applicationReference');
    if (!referenceNumber) {
      setSnackbarMessage('Application reference not found. Please start from step one.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Check if data has changed
    if (!hasDataChanged()) {
      setSnackbarMessage('No changes to next of kin information, proceeding to next step');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onNext();
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/${referenceNumber}/next-of-kin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          relationship: formData.relationship,
          contactAddress: formData.contactAddress,
          contactTel: formData.contactTel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save next of kin details');
      }

      setSnackbarMessage('Next of kin details updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to save next of kin details. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: {sessionStorage.getItem('applicationReference')}. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Next of Kin Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Relationship to Applicant"
            value={formData.relationship}
            onChange={handleChange('relationship')}
            error={!!errors.relationship}
            helperText={errors.relationship}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contact Address"
            value={formData.contactAddress}
            onChange={handleChange('contactAddress')}
            error={!!errors.contactAddress}
            helperText={errors.contactAddress}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contact Tel"
            value={formData.contactTel}
            onChange={handleChange('contactTel')}
            error={!!errors.contactTel}
            helperText={errors.contactTel}
          />
        </Grid>
      </Grid>

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

export default StepThree; 