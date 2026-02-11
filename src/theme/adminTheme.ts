import { createTheme } from '@mui/material/styles';

const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#13A215',
      dark: '#0F7D10',
      light: '#4BC24C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#208F74',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#EEB422',
      contrastText: '#1B1F1B',
    },
    info: {
      main: '#FFD700',
      contrastText: '#1B1F1B',
    },
    background: {
      default: '#F7F8F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1F1B',
      secondary: '#4A564A',
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F7D10',
          boxShadow: '0 6px 18px rgba(19, 33, 20, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E3E6DE',
          boxShadow: '0 10px 24px rgba(27, 31, 27, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #E3E6DE',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F1F4EC',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default adminTheme;
