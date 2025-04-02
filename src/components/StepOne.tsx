import React, { useState } from 'react';
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
  Button,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NewApplicationResponse {
  message: string;
  referenceNumber: string;
}

interface StepOneProps {
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [program, setProgram] = useState('');
  const [programType, setProgramType] = useState('');
  const [campus, setCampus] = useState('');
  const [session, setSession] = useState('');
  const [source, setSource] = useState('');
  const [registered, setRegistered] = useState('');
  
  // For resuming application
  const [referenceNumber, setReferenceNumber] = useState('');
  const [surname, setSurname] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResumingApplication, setIsResumingApplication] = useState(false);

  const validateNewApplication = () => {
    if (!year || !semester || !program || !campus || !session || !source || !registered || !programType) {
      setError('Please fill in all required fields for new application');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const validateResumeApplication = () => {
    if (!referenceNumber) {
      setError('Please enter your reference number');
      setOpenSnackbar(true);
      return false;
    }
    if (!surname) {
      setError('Please enter the first 4 characters of your surname');
      setOpenSnackbar(true);
      return false;
    }
    if (!yearOfBirth) {
      setError('Please enter your year of birth');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleNewApplication = async () => {
    setIsResumingApplication(false);
    if (!validateNewApplication()) return;

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/dev/api/v1/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startingSemester: semester,
          programme: program,
          satelliteCampus: campus,
          preferredSession: session,
          wuaDiscoveryMethod: source,
          previousRegistration: registered,
          yearOfCommencement: parseInt(year),
          programType: programType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const data: NewApplicationResponse = await response.json();
      sessionStorage.setItem('applicationReference', data.referenceNumber);
      setSuccess(`Application created successfully! Reference Number: ${data.referenceNumber}`);
      setOpenSnackbar(true);
      
      // Navigate to next step after showing success message
      setTimeout(() => {
        onNext();
      }, 2000);
      
    } catch (err) {
      setError('Failed to create application. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeApplication = async () => {
    if (!validateResumeApplication()) return;

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/dev/api/v1/applications/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNumber,
          surname,
          yearOfBirth: parseInt(yearOfBirth),
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store reference number in session storage
        sessionStorage.setItem('applicationReference', referenceNumber);
        setSuccess('Application found! Redirecting to continue your application...');
        setOpenSnackbar(true);
        
        // Navigate to next step after showing success message
        setTimeout(() => {
          onNext();
        }, 2000);
      } else {
        setError('Application not found. Please check your details and try again.');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError('Application not found. Please check your details and try again.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Function to check if the form can proceed to next step
  const canProceedToNextStep = () => {
    return isSubmitted && sessionStorage.getItem('applicationReference');
  };

  // Function to handle next button click
  const handleNext = () => {
    if (!canProceedToNextStep()) {
      setError('Please submit a new application or resume an existing one before proceeding.');
      setOpenSnackbar(true);
      return;
    }
    onNext();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NB: Complete all sections of the form.
      </Typography>

      {/* New Application Form */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Year in which you wish to commence your studies</em>
            </MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Starting Semester</em>
            </MenuItem>
            <MenuItem value="March-June">March-June</MenuItem>
            <MenuItem value="August-December">August-December</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Programme</em>
            </MenuItem>
            <MenuItem value="KBCB">BACHELOR OF COMMERCE HONOURS DEGREE  IN BANKING AND FINANCE</MenuItem>
            <MenuItem value="KBCA">BACHELOR OF COMMERCE HONOURS DEGREE IN ACCOUNTING</MenuItem>
            <MenuItem value="KBCM">BACHELOR OF COMMERCE HONOURS DEGREE IN MARKETING</MenuItem>
            <MenuItem value="KBPE">BACHELOR OF EDUCATION (PRIMARY)</MenuItem>
            <MenuItem value="KPECD">BACHELOR OF EDUCATION DEGREE (HONOURS) IN EARLY CHILDHOOD DEVELOPMENT (PRE-SERVICE)</MenuItem>
            <MenuItem value="KECD">BACHELOR OF EDUCATION HONOURS IN EARLY CHILDHOOD DEVELOPMENT</MenuItem>
            <MenuItem value="BHSM">BACHELOR OF HEALTH SERVICES  MANAGEMENT HONOURS DEGREE</MenuItem>
            <MenuItem value="CM">BACHELOR OF SCIENCE HONOURS DEGREE IN  MIDWIFERY</MenuItem>
            <MenuItem value="KBAS">BACHELOR OF SCIENCE HONOURS DEGREE IN ACCOUNTING SCIENCE</MenuItem>
            <MenuItem value="HABM">BACHELOR OF SCIENCE HONOURS DEGREE IN AGRIBUSINESS MANAGEMENT</MenuItem>
            <MenuItem value="KABM">BACHELOR OF SCIENCE HONOURS DEGREE IN AGRIBUSINESS MANAGEMENT</MenuItem>
            <MenuItem value="KHAG">BACHELOR OF SCIENCE HONOURS DEGREE IN AGRICULTURE</MenuItem>
            <MenuItem value="HAS">BACHELOR OF SCIENCE HONOURS DEGREE IN ANIMAL SCIENCE</MenuItem>
            <MenuItem value="KAS">BACHELOR OF SCIENCE HONOURS DEGREE IN ANIMAL SCIENCE</MenuItem>
            <MenuItem value="KBBIDA">BACHELOR OF SCIENCE HONOURS DEGREE IN BUSINESS INTELLIGENCE AND DATA ANALYTICS</MenuItem>
            <MenuItem value="KCD">BACHELOR OF SCIENCE HONOURS DEGREE IN COMMUNITY DEVELOPMENT</MenuItem>
            <MenuItem value="KCS">BACHELOR OF SCIENCE HONOURS DEGREE IN COMPUTER SCIENCE</MenuItem>
            <MenuItem value="KBEM">BACHELOR OF SCIENCE HONOURS DEGREE IN ENVIRONMENTAL MANAGEMENT</MenuItem>
            <MenuItem value="KWGS">BACHELOR OF SCIENCE HONOURS DEGREE IN GENDER STUDIES</MenuItem>
            <MenuItem value="HAH">BACHELOR OF SCIENCE HONOURS DEGREE IN HORTICULTURE</MenuItem>
            <MenuItem value="KHRM">BACHELOR OF SCIENCE HONOURS DEGREE IN HUMAN CAPITAL MANAGEMENT</MenuItem>
            <MenuItem value="KIS">BACHELOR OF SCIENCE HONOURS DEGREE IN INFORMATION SYSTEMS</MenuItem>
            <MenuItem value="BIEM">BACHELOR OF SCIENCE HONOURS DEGREE IN INTEGRATED ENVIRONMENTAL MANAGEMENT</MenuItem>
            <MenuItem value="KBMSDT">BACHELOR OF SCIENCE HONOURS DEGREE IN MEAT SCIENCE AND DAIRY TECHNOLOGY</MenuItem>
            <MenuItem value="PC">BACHELOR OF SCIENCE HONOURS DEGREE IN PALLIATIVE CARE</MenuItem>
            <MenuItem value="KPS">BACHELOR OF SCIENCE HONOURS DEGREE IN PSYCHOLOGY</MenuItem>
            <MenuItem value="KBSW">BACHELOR OF SCIENCE HONOURS DEGREE IN SOCIAL WORK</MenuItem>
            <MenuItem value="KSS">BACHELOR OF SCIENCE HONOURS DEGREE IN SOCIOLOGY</MenuItem>
            <MenuItem value="KPSM">BACHELOR OF SCIENCE HONOURS DEGREE IN SUPPLY CHAIN MANAGEMENT</MenuItem>
            <MenuItem value="KBTL">BACHELOR OF SCIENCE HONOURS DEGREE IN TRANSPORT AND LOGISTICS</MenuItem>
            <MenuItem value="KBMB">BACHELOR OF SCIENCE HONOURS IN BANKING AND FINANCE</MenuItem>
            <MenuItem value="BEMC">BACHELOR OF SCIENCE HONOURS IN EMERGENCY MEDICAL CARE</MenuItem>
            <MenuItem value="KBM">BACHELOR SCIENCE HONOURS DEGREE IN HORTICULTURE</MenuItem>
            <MenuItem value="CECD">CERTIFICATE IN EARLY CHILDHOOD DEVELPMENT</MenuItem>
            <MenuItem value="CSW">CERTIFICATE IN SOCIAL WORK</MenuItem>
            <MenuItem value="DAM">DIPLOMA IN AGRIBUSINESS MANAGEMENT</MenuItem>
            <MenuItem value="DM">DIPLOMA IN BUSINESS MANAGEMENT</MenuItem>
            <MenuItem value="DCCP">DIPLOMA IN CHILD CARE AND PROTECTION</MenuItem>
            <MenuItem value="DECD">DIPLOMA IN EDUCATION (EARLY CHILDHOOD DEVELOPMENT)</MenuItem>
            <MenuItem value="DEMC">DIPLOMA IN EMERGENCY MEDICAL CARE</MenuItem>
            <MenuItem value="DEM">DIPLOMA IN ENVIROMENTAL MANAGEMENT</MenuItem>
            <MenuItem value="DPP">DIPLOMA IN PROJECT PLANNING AND MANAGEMENT</MenuItem>
            <MenuItem value="KDSW">DIPLOMA IN SOCIAL WORK</MenuItem>
            <MenuItem value="DPHIL">DOCTOR OF PHILOSOPHY DEGREE</MenuItem>
            <MenuItem value="EDM">EXECUTIVE DIPLOMA IN MANAGEMENT</MenuItem>
            <MenuItem value="KMSC">MASTER OF ARTS DEGREE IN STRATEGIC COMMUNICATION</MenuItem>
            <MenuItem value="KMECD">MASTER OF EDUCATION DEGREE IN EARLY CHILDHOOD DEVELOPMENT</MenuItem>
            <MenuItem value="MPHIL">MASTER OF PHILOSOPHY</MenuItem>
            <MenuItem value="KMSCM">MASTER OF SCIENCE DEGRE IN SUPPLY CHAIN MANAGEMENT</MenuItem>
            <MenuItem value="MAS">MASTER OF SCIENCE DEGREE IN ACCOUNTANCY</MenuItem>
            <MenuItem value="KMCSSP">MASTER OF SCIENCE DEGREE IN CHILD SENSITIVE SOCIAL POLICIES</MenuItem>
            <MenuItem value="KMDS">MASTER OF SCIENCE DEGREE IN DEVELOPMENT STUDIES</MenuItem>
            <MenuItem value="KMDLM">MASTER OF SCIENCE DEGREE IN DISASTER RISK AND LIVELIHOODS STUDIES</MenuItem>
            <MenuItem value="KMLP">MASTER OF SCIENCE DEGREE IN LIVESTOCK PRODUCTION</MenuItem>
            <MenuItem value="KMLMT">MASTER OF SCIENCE DEGREE IN LIVESTOCK SCIENCE AND MEAT TECHNOLOGY</MenuItem>
            <MenuItem value="KMSG">MASTER OF SCIENCE DEGREE IN SOCIOLOGY </MenuItem>
            <MenuItem value="KMSHRM">MASTER OF SCIENCE DEGREE IN STRATEGIC HUMAN RESOURCE MANAGEMENT</MenuItem>
            <MenuItem value="KMSM">MASTER OF SCIENCE DEGREE IN STRATEGIC MARKETING </MenuItem>
            <MenuItem value="KMAF">MASTER OF SCIENCE IN ACCOUNTING AND FINANCE</MenuItem>
            <MenuItem value="KMGS">MASTER OF SCIENCE IN GENDER STUDIES</MenuItem>
            <MenuItem value="KMBA">MASTERS DEGREE IN BUSINESS ADMINISTRATION</MenuItem>
            <MenuItem value="KMPA">MASTERS DEGREE IN PUBLIC ADMINISTRATION</MenuItem>
            <MenuItem value="KMASMD">MASTERS IN AGRIBUSINESS SYSTEMS MANAGEMENT AND DEVELOPMENT</MenuItem>
            <MenuItem value="CSSP">POST GRADUATE DIPLOMA IN CHILD SENSITIVE SOCIAL POLICIES</MenuItem>
            <MenuItem value="KPDSW">POST GRADUATE DIPLOMA IN SOCIAL WORK</MenuItem>
            <MenuItem value="PDEMC">POSTGRADUATE DIPLOMA IN EMERGENCY MEDICAL CARE</MenuItem>
            <MenuItem value="PDPC">POSTGRADUATE DIPLOMA IN PALLIATIVE CARE</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={programType}
            onChange={(e) => setProgramType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Program Type</em>
            </MenuItem>
            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
            <MenuItem value="Certificate">Certificate</MenuItem>
            <MenuItem value="Diploma">Diploma</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Satellite Campus</em>
            </MenuItem>
            <MenuItem value="UK">UK</MenuItem>
            <MenuItem value="Bulawayo">Bulawayo</MenuItem>
            <MenuItem value="Harare">Harare</MenuItem>
            <MenuItem value="Kadoma">Kadoma</MenuItem>
            <MenuItem value="Marondera">Marondera</MenuItem>
            <MenuItem value="Mutare">Mutare</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Preferred Session</em>
            </MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Weekend">Weekend</MenuItem>
            <MenuItem value="Block">Block</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          <InputLabel shrink></InputLabel>
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>How did you know about WUA?</em>
            </MenuItem>
            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
            <MenuItem value="Facebook">Facebook</MenuItem>
            <MenuItem value="Google">Google</MenuItem>
            <MenuItem value="Youtube">Youtube</MenuItem>
            <MenuItem value="Television">Television</MenuItem>
            <MenuItem value="Newspaper">Newspaper</MenuItem>
            <MenuItem value="Friend">Friend</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Have you ever been registered with this University before?
        </Typography>
        <RadioGroup 
          row 
          value={registered} 
          onChange={(e) => setRegistered(e.target.value)}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>

        <Button
          variant="contained"
          onClick={handleNewApplication}
          disabled={isLoading}
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit Application'}
        </Button>
      </Box>

      {/* Resume Application Form */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        For returning applicants who want to edit their application:
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Enter Reference Number"
          variant="outlined"
          sx={{ mb: 2 }}
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          InputLabelProps={{ style: { color: '#000' } }}
          error={!!error && !referenceNumber}
          helperText={!!error && !referenceNumber ? 'Reference number is required' : ''}
        />
        <TextField
          fullWidth
          label="Enter Surname (First 4 Characters only)"
          variant="outlined"
          sx={{ mb: 2 }}
          value={surname}
          onChange={(e) => setSurname(e.target.value.slice(0, 4))}
          InputLabelProps={{ style: { color: '#000' } }}
          error={!!error && !surname}
          helperText={!!error && !surname ? 'First 4 characters of surname required' : ''}
          inputProps={{ maxLength: 4 }}
        />
        <TextField
          fullWidth
          label="Enter Year of Birth"
          variant="outlined"
          type="number"
          sx={{ mb: 2 }}
          value={yearOfBirth}
          onChange={(e) => setYearOfBirth(e.target.value)}
          InputLabelProps={{ style: { color: '#000' } }}
          error={!!error && !yearOfBirth}
          helperText={!!error && !yearOfBirth ? 'Year of birth is required' : ''}
        />

        <Button
          variant="contained"
          onClick={handleResumeApplication}
          disabled={isLoading}
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Resume Application'}
        </Button>
      </Box>

      {/* Bank Details Section */}
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

      {/* Add Next button at the bottom */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
            },
          }}
        >
          Next
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepOne;
