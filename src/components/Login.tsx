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
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { setAuthToken } from '../utils/auth';
import wuaLogo from './wua-logo.png';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface LoginResponse {
  token: string;
}

const Login: FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://apply.wua.ac.zw/dev/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 200) {
        const data: LoginResponse = await response.json();
        // Use setAuthToken instead of directly setting in sessionStorage
        setAuthToken(data.token);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed. Please try again.');
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setOpen(true);
    } finally {
      setIsLoading(false);
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 6,
        }}
      >
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderTop: '6px solid #EEB422',
              pointerEvents: 'none',
            }}
          />
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Box
              component="img"
              src={wuaLogo}
              alt="WUA"
              sx={{ width: 52, height: 52 }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                WUA Admin Portal
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Admissions Management Console
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: '#13A215',
                width: 44,
                height: 44,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Sign in to continue
            </Typography>
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
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
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
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
            disabled={isLoading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            Authorized staff only. Contact ICT for access support.
          </Typography>
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
