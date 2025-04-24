import { FC, ReactElement, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import Header from './components/Header';
import StepOne from './components/StepOne'; 
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree'; 
import StepFour from './components/StepFour';
import StepFive from './components/StepFive'; 
import StepSix from './components/StepSix'; 
import StepSeven from './components/StepSeven'; 
import StepEight from './components/StepEight'; 
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const steps = [
  'Program Selection',
  'Personal Information',
  'Next of Kin Information', 
  'Disability',
  'Education',
  'Experience',
  'Upload Docs',
  'Submission',
];

const MainContent: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const currentStep = activeStep + 1;
  
  // Hide navigation buttons for Steps 1, 2, 3, 4, 5, 6, and 7
  const showNavigationButtons = currentStep > 7;

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepOne onNext={handleNext} />;
      case 1:
        return <StepTwo onNext={handleNext} onBack={() => setActiveStep(0)} />;
      case 2:
        return <StepThree onNext={handleNext} onBack={() => setActiveStep(1)} />;
      case 3:
        return <StepFour onNext={handleNext} onBack={() => setActiveStep(2)} />;
      case 4:
        return <StepFive onNext={handleNext} onBack={() => setActiveStep(3)} />;
      case 5:
        return <StepSix onNext={handleNext} onBack={() => setActiveStep(4)} />;
      case 6:
        return <StepSeven onNext={handleNext} onBack={() => setActiveStep(5)} />;
      case 7:
        return <StepEight onNext={handleNext} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundImage: 'url(/wuabackground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        pb: 8,
      }}
    >
      <Header />
      <Container maxWidth="md" sx={{ 
        mt: 4,
        mb: 4,
        flex: 1,
        '@media (max-width: 600px)': {
          mt: 2,
          px: 2,
        },
      }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          mb: 4,
        }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 3, 
              textAlign: 'center', 
              color: '#13A215',
              fontWeight: 600,
            }}
          >
            Application Process
          </Typography>
          <Stepper 
            activeStep={activeStep}
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
              },
              '& .MuiStepper-root': {
                padding: '24px 0',
              },
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                '& .MuiStep-root': {
                  width: '100%',
                  mb: 2,
                },
              },
            }}
          >
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography>Application submitted successfully!</Typography>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Thank you for applying to Women's University of Africa. You will receive a confirmation email shortly.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button 
                  onClick={handleReset}
                  variant="outlined"
                  sx={{ 
                    color: '#13A215',
                    borderColor: '#13A215',
                    '&:hover': {
                      borderColor: '#0B8A0D',
                      backgroundColor: 'rgba(19, 162, 21, 0.04)',
                    },
                  }}
                >
                  Start New Application
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ mt: 4, mb: 2 }}>
                {getStepContent(activeStep)}
              </Box>
              {showNavigationButtons && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

const App: FC = (): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route 
        path="/admin" 
        element={
          isAuthenticated ? 
            <Navigate to="/admin/dashboard" /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/admin" />
        } 
      />
    </Routes>
  );
};

export default App;