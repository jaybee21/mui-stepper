import { FC, ReactElement, useState } from 'react';
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
import StepOne from './components/StepOne'; // Import StepOne
import StepTwo from './components/StepTwo'; // Import StepTwo
import StepThree from './components/StepThree'; // Import StepThree
import StepFive from './components/StepFive'; // Import StepFive
import StepSix from './components/StepSix'; // Import StepSix
import StepSeven from './components/StepSeven'; // Import StepSeven
import StepEight from './components/StepEight'; // Import StepEight

const steps = [
  'Program Selection',
  'Personal Information',
  'Next of Kin Information', // This step is now part of Step Two
  'Education',
  'Experience',
  'Upload Docs',
  'Submission',
];

const App: FC = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepOne />; // Render StepOne component
      case 1:
        return <StepTwo />; // Render StepTwo component
      case 2:
        return <StepThree />; // Render StepThree component
      case 3:
        return <StepFive />; // Render StepFive component
      case 4:
        return <StepSix />; // Render StepSix component
      case 5:
        return <StepSeven />; // Render StepSeven component
      case 6:
        return <StepEight />; // Render StepEight component
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
      }}
    >
      <Header />
      <Container maxWidth="md" sx={{ 
        mt: 4,
        mb: 4,
        '@media (max-width: 600px)': {
          mt: 2,
          px: 2,
        },
      }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                {getStepContent(activeStep)} {/* Render step content */}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ 
                    mr: 1,
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
                <Box sx={{ flex: '1 1 auto' }} />
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
                  {activeStep === steps.length - 1 ? 'Submit Application' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default App;