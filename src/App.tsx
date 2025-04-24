import { FC, ReactElement, useState, useEffect } from 'react';
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
  Grow,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  const [showingLabelIndex, setShowingLabelIndex] = useState(-1);
  const [showNumbers, setShowNumbers] = useState(false);

  // Control the animation sequence
  useEffect(() => {
    // First show only numbers
    setTimeout(() => setShowNumbers(true), 1000);

    // Then start the label animation sequence
    const startLabelAnimations = setTimeout(() => {
      const animateLabels = () => {
        setShowingLabelIndex((prev) => {
          if (prev >= steps.length - 1) return 0;
          return prev + 1;
        });
      };

      // Start the sequence
      animateLabels();
      const interval = setInterval(animateLabels, 3000);

      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(startLabelAnimations);
  }, []);

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
          {/* Desktop view */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'block' },
            position: 'relative',
            width: '100%',
            mb: 4,
            mt: 8, // More space for labels above
            px: 4 // Padding to prevent text cut-off
          }}>
            {/* Numbers row with labels above */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '16px',
                right: '16px',
                top: '50%',
                height: '2px',
                background: 'linear-gradient(90deg, #1976d2 0%, #90caf9 100%)',
                zIndex: 0,
              }
            }}>
              {steps.map((label, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '120px', // Fixed width for each step
                  }}
                >
                  {/* Label container */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '100%',
                    width: '100%',
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <Grow 
                      in={showingLabelIndex === index} 
                      timeout={{ enter: 800, exit: 400 }}
                      style={{
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: showingLabelIndex === index ? 'primary.main' : 'text.primary',
                            transition: 'all 0.3s ease',
                            px: 1,
                            py: 0.5,
                            backgroundColor: showingLabelIndex === index ? 
                              'rgba(25, 118, 210, 0.08)' : 
                              'transparent',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            mb: 1,
                            maxWidth: '100%',
                            animation: showingLabelIndex === index ?
                              'fadeInDown 0.8s ease-out' : 'none',
                            '@keyframes fadeInDown': {
                              '0%': { 
                                opacity: 0,
                                transform: 'translateY(-10px)',
                              },
                              '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                              },
                            },
                          }}
                        >
                          {label}
                        </Typography>
                        {/* Connecting line */}
                        <Box sx={{
                          width: '2px',
                          height: '24px',
                          background: showingLabelIndex === index ?
                            'linear-gradient(180deg, #1976d2 0%, rgba(25, 118, 210, 0.3) 100%)' :
                            'rgba(0, 0, 0, 0.12)',
                          animation: showingLabelIndex === index ?
                            'growDown 0.4s ease-out' : 'none',
                          '@keyframes growDown': {
                            '0%': { 
                              height: 0,
                              opacity: 0,
                            },
                            '100%': {
                              height: '24px',
                              opacity: 1,
                            },
                          },
                        }} />
                      </Box>
                    </Grow>
                  </Box>

                  {/* Number circle */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Fade in={showNumbers} timeout={800}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: activeStep >= index ? 'primary.main' : 'grey.400',
                          color: 'white',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                          boxShadow: showingLabelIndex === index ? 
                            '0 4px 8px rgba(25, 118, 210, 0.25)' : 
                            '0 2px 4px rgba(0,0,0,0.2)',
                          transform: showingLabelIndex === index ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Fade>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Mobile view */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <List sx={{ width: '100%', px: 2 }}>
              {steps.map((label, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: activeStep >= index ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: activeStep >= index ? 'primary.main' : 'grey.400',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: activeStep >= index ? 500 : 400,
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
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