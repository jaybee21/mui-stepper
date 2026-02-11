import { FC, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import adminTheme from '../theme/adminTheme';

interface AdminThemeProviderProps {
  children: ReactNode;
}

const AdminThemeProvider: FC<AdminThemeProviderProps> = ({ children }) => (
  <ThemeProvider theme={adminTheme}>
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {children}
    </Box>
  </ThemeProvider>
);

export default AdminThemeProvider;
