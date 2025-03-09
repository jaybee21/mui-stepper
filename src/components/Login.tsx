import React, { useState, FC } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Snackbar,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SAMPLE_USERS = [
  { username: 'admin', password: 'password' },
  { username: 'user1', password: 'test123' },
  { username: 'demo', password: 'demo123' }
];

const Login: FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const isValidUser = SAMPLE_USERS.some(
      user => user.username === username && user.password === password
    );

    if (isValidUser) {
      setIsAuthenticated(true);
    } else {
      setErrorMessage('Invalid username or password');
      setOpen(true);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: '#13A215',
            width: 56,
            height: 56,
          }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              color: '#333',
              fontWeight: 600,
            }}
          >
            Admin Login
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
              },
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Sign In
          </Button>
        </Paper>
      </Box>
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login; 