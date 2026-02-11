import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { fetchWithAuth } from '../utils/auth';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  idNumber: string;
  department: string;
  role: string;
  isFirstLogin: number;
  lastLogin: string;
  campus?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    idNumber: '',
    department: '',
    role: 'user',
    isFirstLogin: true,
    campus: '',
  });

  // Reset password form state
  const [resetPassword, setResetPassword] = useState({
    username: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth('https://apply.wua.ac.zw/dev/api/v1/users/all-users/all');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth('https://apply.wua.ac.zw/dev/api/v1/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to create user');

      setSnackbar({
        open: true,
        message: 'User created successfully',
        severity: 'success',
      });
      setOpenCreateDialog(false);
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create user',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`https://apply.wua.ac.zw/dev/api/v1/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth('https://apply.wua.ac.zw/dev/api/v1/users/reset-password', {
        method: 'POST',
        body: JSON.stringify(resetPassword),
      });

      if (!response.ok) throw new Error('Failed to reset password');

      setSnackbar({
        open: true,
        message: 'Password reset successfully',
        severity: 'success',
      });
      setOpenResetDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to reset password',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenCreateDialog(true)}
        >
          Create New User
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: '#F1F4EC' }}>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Campus</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                    <SearchOffIcon sx={{ fontSize: 36, color: 'text.secondary' }} />
                    <Typography variant="subtitle1">No users available</Typography>
                    <Chip label="Create a user to get started" variant="outlined" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: 'rgba(19, 162, 21, 0.04)' } }}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.campus || ''}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setResetPassword({ ...resetPassword, username: user.username });
                        setOpenResetDialog(true);
                      }}
                      color="primary"
                    >
                      <RefreshIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteUser(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Create New User</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Add an administrative or support user for the portal.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mobile Number"
              value={newUser.mobileNumber}
              onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="ID Number"
              value={newUser.idNumber}
              onChange={(e) => setNewUser({ ...newUser, idNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Department"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Campus</InputLabel>
              <Select
                value={newUser.campus}
                onChange={(e) => setNewUser({ ...newUser, campus: e.target.value })}
                label="Campus"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Bulawayo">Bulawayo</MenuItem>
                <MenuItem value="Harare">Harare</MenuItem>
                <MenuItem value="Kadoma">Kadoma</MenuItem>
                <MenuItem value="Marondera">Marondera</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Reset Password</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Assign a temporary password for the selected user.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Username"
              value={resetPassword.username}
              disabled
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={resetPassword.newPassword}
              onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement; 
