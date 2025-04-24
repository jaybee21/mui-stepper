import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Grid,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface PersonalDetails {
  title: string;
  first_names: string;
  surname: string;
  marital_status: string;
  maiden_name?: string;
  national_id: string;
  passport_number: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  citizenship: string;
  nationality: string;
  residential_address: string;
  postal_address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNext, onBack }) => {
  const [initialData, setInitialData] = useState<PersonalDetails | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    firstNames: '',
    surname: '',
    maritalStatus: '',
    maidenName: '',
    nationalId: '',
    passportNumber: '',
    dateOfBirth: null as Date | null,
    placeOfBirth: '',
    gender: '',
    citizenship: '',
    nationality: '',
    residentialAddress: '',
    postalAddress: '',
    city: '',
    country: '',
    phone: '',
    email: '',
  });

  // Load existing personal details
  useEffect(() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
      if (storedData.personalDetails) {
        const personalDetails = storedData.personalDetails;
        setFormData({
          title: personalDetails.title || '',
          firstNames: personalDetails.first_names || '',
          surname: personalDetails.surname || '',
          maritalStatus: personalDetails.marital_status || '',
          maidenName: personalDetails.maiden_name || '',
          nationalId: personalDetails.national_id || '',
          passportNumber: personalDetails.passport_number || '',
          dateOfBirth: personalDetails.date_of_birth ? new Date(personalDetails.date_of_birth) : null,
          placeOfBirth: personalDetails.place_of_birth || '',
          gender: personalDetails.gender || '',
          citizenship: personalDetails.citizenship || '',
          nationality: personalDetails.nationality || '',
          residentialAddress: personalDetails.residential_address || '',
          postalAddress: personalDetails.postal_address || '',
          city: personalDetails.city || '',
          country: personalDetails.country || '',
          phone: personalDetails.phone || '',
          email: personalDetails.email || '',
        });
        setInitialData(personalDetails);
      }
    } catch (error) {
      console.error('Error loading personal details:', error);
    }
  }, []);

  const hasDataChanged = () => {
    if (!initialData) return true;

    const currentData = {
      title: formData.title,
      first_names: formData.firstNames,
      surname: formData.surname,
      marital_status: formData.maritalStatus,
      maiden_name: formData.maidenName,
      national_id: formData.nationalId,
      passport_number: formData.passportNumber,
      date_of_birth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null,
      place_of_birth: formData.placeOfBirth,
      gender: formData.gender,
      citizenship: formData.citizenship,
      nationality: formData.nationality,
      residential_address: formData.residentialAddress,
      postal_address: formData.postalAddress,
      city: formData.city,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    };

    // Compare the current data with initial data
    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'title', 'firstNames', 'surname', 'maritalStatus', 'nationalId',
      'dateOfBirth', 'placeOfBirth', 'gender', 'citizenship',
      'nationality', 'residentialAddress', 'postalAddress', 'city', 'country',
      'phone', 'email'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      setSnackbarMessage('No changes to personal information, proceeding to next step');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onNext();
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/dev/api/v1/applications/${referenceNumber}/personal-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save personal details');
      }

      setSnackbarMessage('Personal details updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to save personal details. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | SelectChangeEvent<string>
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

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: ''
      }));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Personal Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.title}>
            <InputLabel>Title</InputLabel>
            <Select
              value={formData.title}
              onChange={handleChange('title')}
              label="Title"
            >
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
              <MenuItem value="Prof">Prof</MenuItem>
            </Select>
            {errors.title && (
              <Typography color="error" variant="caption">
                {errors.title}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Names"
            value={formData.firstNames}
            onChange={handleChange('firstNames')}
            error={!!errors.firstNames}
            helperText={errors.firstNames}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Surname"
            value={formData.surname}
            onChange={handleChange('surname')}
            error={!!errors.surname}
            helperText={errors.surname}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.maritalStatus}>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={formData.maritalStatus}
              onChange={handleChange('maritalStatus')}
              label="Marital Status"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
            {errors.maritalStatus && (
              <Typography color="error" variant="caption">
                {errors.maritalStatus}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maiden Name (Optional)"
            value={formData.maidenName}
            onChange={handleChange('maidenName')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="National ID"
            value={formData.nationalId}
            onChange={handleChange('nationalId')}
            error={!!errors.nationalId}
            helperText={errors.nationalId}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Passport Number"
            value={formData.passportNumber}
            onChange={handleChange('passportNumber')}
            error={!!errors.passportNumber}
            helperText={errors.passportNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Place of Birth"
            value={formData.placeOfBirth}
            onChange={handleChange('placeOfBirth')}
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={handleChange('gender')}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.gender && (
              <Typography color="error" variant="caption">
                {errors.gender}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Citizenship"
            value={formData.citizenship}
            onChange={handleChange('citizenship')}
            error={!!errors.citizenship}
            helperText={errors.citizenship}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nationality"
            value={formData.nationality}
            onChange={handleChange('nationality')}
            error={!!errors.nationality}
            helperText={errors.nationality}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Residential Address"
            value={formData.residentialAddress}
            onChange={handleChange('residentialAddress')}
            error={!!errors.residentialAddress}
            helperText={errors.residentialAddress}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Postal Address"
            value={formData.postalAddress}
            onChange={handleChange('postalAddress')}
            error={!!errors.postalAddress}
            helperText={errors.postalAddress}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={handleChange('country')}
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            type="email"
          />
        </Grid>
      </Grid>

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

export default StepTwo; 