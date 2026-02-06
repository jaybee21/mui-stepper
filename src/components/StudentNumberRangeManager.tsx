import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { API_BASE_URL } from '../config/api';
import { fetchWithAuth } from '../utils/auth';

interface StudentNumberRange {
  id?: number;
  prefix: string;
  start_number: number;
  end_number: number;
  next_number?: number;
  is_active?: number | boolean;
  created_at?: string;
  updated_at?: string;
  // Also support camelCase for internal use
  startNumber?: number;
  endNumber?: number;
  nextNumber?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const StudentNumberRangeManager: FC = () => {
  const [activeRange, setActiveRange] = useState<StudentNumberRange | null>(null);
  const [loadingActive, setLoadingActive] = useState(false);
  const [form, setForm] = useState({
    prefix: 'w',
    startNumber: '',
    endNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadActiveRange = async () => {
    try {
      setLoadingActive(true);
      setError(null);

      const response = await fetchWithAuth(
        `${API_BASE_URL}/student-numbers/range/active`,
        { method: 'GET' }
      );

      if (response.status === 404) {
        setActiveRange(null);
        return;
      }

      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || 'Failed to load active range');
      }

      const data = (await response.json()) as StudentNumberRange;
      // Normalize snake_case to camelCase for display
      const normalizedData: StudentNumberRange = {
        ...data,
        startNumber: data.start_number ?? data.startNumber,
        endNumber: data.end_number ?? data.endNumber,
        nextNumber: data.next_number ?? data.nextNumber,
        isActive: data.is_active === 1 || data.is_active === true || data.isActive,
        createdAt: data.created_at ?? data.createdAt,
        updatedAt: data.updated_at ?? data.updatedAt,
      };
      setActiveRange(normalizedData);
    } catch (err: any) {
      console.error('Error loading active range:', err);
      setError(err.message || 'Failed to load active range');
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    loadActiveRange();
  }, []);

  const handleChange = (field: 'prefix' | 'startNumber' | 'endNumber', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    const start = Number(form.startNumber);
    const end = Number(form.endNumber);

    if (!form.prefix.trim()) {
      setError('Prefix is required.');
      return;
    }
    if (Number.isNaN(start) || Number.isNaN(end)) {
      setError('Start and End numbers must be valid numbers.');
      return;
    }
    if (start <= 0 || end <= 0) {
      setError('Start and End numbers must be positive.');
      return;
    }
    if (end <= start) {
      setError('End number must be greater than start number.');
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        prefix: form.prefix.trim(),
        startNumber: start,
        endNumber: end,
      };

      const response = await fetchWithAuth(
        `${API_BASE_URL}/student-numbers/range`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || 'Failed to create/activate range');
      }

      setSuccess('Student number range created and activated successfully.');
      await loadActiveRange();
    } catch (err: any) {
      console.error('Error creating range:', err);
      setError(err.message || 'Failed to create/activate range');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Student Number Range
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Range
            </Typography>

            {loadingActive ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : activeRange ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Prefix:</strong> {activeRange.prefix}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Range:</strong> {activeRange.startNumber ?? activeRange.start_number} - {activeRange.endNumber ?? activeRange.end_number}
                </Typography>
                {activeRange.nextNumber !== undefined || activeRange.next_number !== undefined ? (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Next Number:</strong> {activeRange.nextNumber ?? activeRange.next_number}
                  </Typography>
                ) : null}
                {activeRange.createdAt && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Created:{' '}
                    {new Date(activeRange.createdAt).toLocaleString()}
                  </Typography>
                )}
                {activeRange.updatedAt && (
                  <Typography variant="body2" color="text.secondary">
                    Updated:{' '}
                    {new Date(activeRange.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No active student number range is currently configured.
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create / Activate Range
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Prefix"
                  value={form.prefix}
                  onChange={(e) => handleChange('prefix', e.target.value)}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Number"
                  type="number"
                  value={form.startNumber}
                  onChange={(e) => handleChange('startNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Number"
                  type="number"
                  value={form.endNumber}
                  onChange={(e) => handleChange('endNumber', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  bgcolor: '#13A215',
                  '&:hover': { bgcolor: '#0f7d10' },
                }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Range'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentNumberRangeManager;

