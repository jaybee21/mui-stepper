import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';

interface ApplicationDetails {
  referenceNumber: string;
  startingSemester: string | null;
  satelliteCampus: string;
  acceptedStatus: string;
  createdAt: string;
  fullApplication: {
    programme: string;
    programme1?: string | null;
    programme2?: string | null;
    preferred_session: string;
    wua_discovery_method: string;
    previous_registration: string;
    year_of_commencement: number;
    program_type: string | null;
    personalDetails: {
      title: string;
      surname: string;
      gender: string;
      citizenship: string;
      phone: string;
      email: string;
    };
    nextOfKin: {
      first_name: string;
      last_name: string;
      relationship: string;
      contact_tel: string;
    };
    academicSummary?: {
      olevel_subject_count: number | null;
      olevel_includes_english: string | null;
      olevel_includes_maths: string | null;
      has_alevel: string | null;
      alevel_passes_e_or_better: number | null;
      has_professional_cert: string | null;
      has_diploma: string | null;
      has_degree: string | null;
      notes: string | null;
    };
    uploads?: Array<{
      id: number;
      file_kind: string;
      created_at: string;
    }>;
  };
}

const ApplicationStatus: React.FC = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!referenceNumber.trim()) {
      setError('Please enter your reference number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/${referenceNumber}/full-details`);
      
      if (!response.ok) {
        throw new Error('Application not found');
      }

      const data = await response.json();
      setApplication(data);
    } catch (error) {
      setError('Failed to fetch application details. Please check your reference number.');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircleIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'rejected':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const formatYesNo = (value: string | null | undefined) => {
    const normalized = (value || '').toString().trim().toUpperCase();
    if (normalized === 'Y' || normalized === 'YES') return 'Yes';
    if (normalized === 'N' || normalized === 'NO') return 'No';
    return value ?? 'N/A';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4, border: '1px solid #E3E6DE' }}>
        <Stack spacing={1} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="text.primary">
            Check Your Application Status
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your reference number to view your application status and details.
          </Typography>
        </Stack>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3, maxWidth: 600, mx: 'auto', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="Reference Number"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            onClick={handleCheckStatus}
            disabled={loading}
            sx={{ minWidth: 140 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Check Status'}
          </Button>
        </Box>
      </Paper>

      {application && (
        <Grid container spacing={3}>
          {/* Status Card */}
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #E3E6DE' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(application.acceptedStatus)}
                    label={application.acceptedStatus.toUpperCase()}
                    color={getStatusColor(application.acceptedStatus) as any}
                    sx={{ fontSize: '1.1rem', py: 2 }}
                  />
                  {application.acceptedStatus.toLowerCase() === 'accepted' && (
                    <Typography variant="h6" color="success.main">
                      Congratulations! Your application has been accepted.
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Reference Number: {application.referenceNumber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ border: '1px solid #E3E6DE' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Programme"
                      secondary={application.fullApplication.programme}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Starting Semester"
                      secondary={application.startingSemester}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Campus"
                      secondary={application.satelliteCampus}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Preferred Session"
                      secondary={application.fullApplication.preferred_session}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ border: '1px solid #E3E6DE' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Name"
                      secondary={`${application.fullApplication.personalDetails.title} ${application.fullApplication.personalDetails.surname}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Contact"
                      secondary={`${application.fullApplication.personalDetails.phone} | ${application.fullApplication.personalDetails.email}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Education Details */}
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #E3E6DE' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Academic Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        O-Level Subject Count
                      </Typography>
                      <Typography variant="body1">
                        {application.fullApplication.academicSummary?.olevel_subject_count ?? 'N/A'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        O-Level Includes English
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.olevel_includes_english)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        O-Level Includes Maths
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.olevel_includes_maths)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        Has A-Level
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.has_alevel)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        A-Level Passes (E or better)
                      </Typography>
                      <Typography variant="body1">
                        {application.fullApplication.academicSummary?.alevel_passes_e_or_better ?? 'N/A'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        Has Diploma
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.has_diploma)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        Has Degree
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.has_degree)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                      <Typography variant="body2" color="text.secondary">
                        Has Professional Cert
                      </Typography>
                      <Typography variant="body1">
                        {formatYesNo(application.fullApplication.academicSummary?.has_professional_cert)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents */}
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #E3E6DE' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submitted Documents
                </Typography>
                <Grid container spacing={2}>
                  {(application.fullApplication.uploads || []).map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {doc.file_kind.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ApplicationStatus; 
