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

interface Subject {
  subject_name: string;
  grade: string;
  year_written: number;
}

interface Education {
  qualification_type: string;
  examination_board: string;
  subjects: Subject[];
}

interface Document {
  document_type: string;
  file_path: string;
  uploaded_at: string;
}

interface ApplicationDetails {
  referenceNumber: string;
  startingSemester: string;
  satelliteCampus: string;
  acceptedStatus: string;
  createdAt: string;
  fullApplication: {
    programme: string;
    preferred_session: string;
    wua_discovery_method: string;
    previous_registration: string;
    year_of_commencement: string;
    program_type: string;
    personalDetails: {
      title: string;
      surname: string;
      gender: string;
      citizenship: string;
      phone: string;
      email: string;
      city: string;
      country: string;
    };
    nextOfKin: {
      first_name: string;
      last_name: string;
      relationship: string;
      contact_tel: string;
    };
    educationDetails: Education[];
    documents: Document[];
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
                  Education Details
                </Typography>
                {application.fullApplication.educationDetails.map((education, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {education.qualification_type} ({education.examination_board})
                    </Typography>
                    <Grid container spacing={2}>
                      {education.subjects.map((subject, subIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={subIndex}>
                        <Paper sx={{ p: 2, border: '1px solid #E3E6DE' }}>
                          <Typography variant="body1">
                            {subject.subject_name}
                          </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Grade: {subject.grade} ({subject.year_written})
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    {index < application.fullApplication.educationDetails.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
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
                  {application.fullApplication.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {doc.document_type.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
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
