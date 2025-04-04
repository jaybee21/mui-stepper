import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormGroup,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Experience {
  organisationName: string;
  position: string;
  startDate: string;
  endDate: string;
  duties: string;
}

// Add interface for stored experience data
interface StoredExperience {
  organisation_name: string;
  position: string;
  start_date: string;
  end_date: string;
  duties: string;
}

interface StepSixProps {
  onNext: () => void;
  onBack: () => void;
}

const StepSix: React.FC<StepSixProps> = ({ onNext, onBack }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duties, setDuties] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Load existing work experience from session storage
  useEffect(() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
      if (storedData.workExperience && storedData.workExperience.length > 0) {
        const formattedExperiences = storedData.workExperience.map((exp: any) => ({
          organisationName: exp.organisation_name || '',
          position: exp.position || '',
          startDate: exp.start_date ? exp.start_date.split('T')[0] : '',
          endDate: exp.end_date ? exp.end_date.split('T')[0] : '',
          duties: exp.duties || ''
        }));
        setExperiences(formattedExperiences);
      }
    } catch (error) {
      console.error('Error loading work experience data:', error);
    }
  }, []);

  const handleAddExperience = () => {
    if (organization && position && startDate && endDate && duties) {
      setExperiences([...experiences, { 
        organisationName: organization, 
        position, 
        startDate, 
        endDate, 
        duties 
      }]);
      // Clear form
      setOrganization('');
      setPosition('');
      setStartDate('');
      setEndDate('');
      setDuties('');
    }
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleSubmit = async () => {
    const referenceNumber = sessionStorage.getItem('applicationReference');
    if (!referenceNumber) {
      setSnackbarMessage('Application reference not found. Please start from step one.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Get existing experiences from session storage
    const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
    const existingExperiences: StoredExperience[] = storedData.workExperience || [];

    // Filter out only the new experiences that weren't in the existing data
    const newExperiences = experiences.filter(newExp => {
      // Check if this experience already exists in stored data
      return !existingExperiences.some((existingExp: StoredExperience) => 
        existingExp.organisation_name === newExp.organisationName &&
        existingExp.position === newExp.position &&
        existingExp.start_date.split('T')[0] === newExp.startDate &&
        existingExp.end_date.split('T')[0] === newExp.endDate &&
        existingExp.duties === newExp.duties
      );
    });

    // If no new experiences were added, just proceed to next step
    if (newExperiences.length === 0) {
      setSnackbarMessage('Proceeding with existing work experience');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onNext();
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:3000/dev/api/v1/applications/${referenceNumber}/work-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workExperience: newExperiences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save work experience');
      }

      setSnackbarMessage('New work experience saved successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Wait for snackbar to show before proceeding
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to save work experience. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Display existing work experience from session storage
  const ExistingWorkExperience = () => {
    const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
    
    return (
      <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(19, 162, 21, 0.05)', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#13A215' }}>
          Existing Work Experience
        </Typography>
        
        {storedData.workExperience && storedData.workExperience.length > 0 ? (
          storedData.workExperience.map((exp: any, index: number) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Typography><strong>Organisation:</strong> {exp.organisation_name}</Typography>
              <Typography><strong>Position:</strong> {exp.position}</Typography>
              <Typography><strong>Start Date:</strong> {new Date(exp.start_date).toLocaleDateString()}</Typography>
              <Typography><strong>End Date:</strong> {new Date(exp.end_date).toLocaleDateString()}</Typography>
              <Typography><strong>Duties:</strong> {exp.duties}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No previous work experience found.</Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: {sessionStorage.getItem('applicationReference')}. Keep it safe.
      </Typography>

      <ExistingWorkExperience />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Work Experience (Optional)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        If you have work experience, you can add it below. This section is optional.
      </Typography>

      <TextField
        fullWidth
        label="Name of Organisation"
        variant="outlined"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Position"
        variant="outlined"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Start Date"
        variant="outlined"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="End Date"
        variant="outlined"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="Duties"
        variant="outlined"
        multiline
        rows={4}
        value={duties}
        onChange={(e) => setDuties(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button 
        variant="contained" 
        onClick={handleAddExperience}
        disabled={!(organization && position && startDate && endDate && duties)}
        sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
          },
        }}
      >
        Add Experience
      </Button>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Added Experiences:
      </Typography>
      {experiences.map((exp, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="body2"><strong>Organisation:</strong> {exp.organisationName}</Typography>
          <Typography variant="body2"><strong>Position:</strong> {exp.position}</Typography>
          <Typography variant="body2"><strong>Start Date:</strong> {exp.startDate}</Typography>
          <Typography variant="body2"><strong>End Date:</strong> {exp.endDate}</Typography>
          <Typography variant="body2"><strong>Duties:</strong> {exp.duties}</Typography>
          <IconButton onClick={() => handleRemoveExperience(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

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

export default StepSix; 