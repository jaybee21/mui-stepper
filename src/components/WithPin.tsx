import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Visibility as VisibilityIcon, Download as DownloadIcon, FilterList as FilterListIcon, Clear as ClearIcon, PictureAsPdf as PdfIcon, Refresh as RefreshIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';
import { API_BASE_URL } from '../config/api';
import { fetchWithAuth } from '../utils/auth';

interface Application {
  id: number;
  reference_number: string;
  programme: string;
  satellite_campus: string;
  created_at: string;
  accepted_status: string;
  paynow_status: string | null;
  student_number?: string;
}

interface FullApplicationDetails {
  referenceNumber: string;
  startingSemester: string;
  satelliteCampus: string;
  acceptedStatus: string;
  createdAt: string;
  studentNumber?: string;
  fullApplication: {
    id: number;
    reference_number: string;
    starting_semester: string;
    programme: string;
    satellite_campus: string;
    preferred_session: string;
    wua_discovery_method: string;
    previous_registration: string;
    created_at: string;
    year_of_commencement: string;
    program_type: string;
    accepted_status: string;
    student_number?: string;
    personalDetails: {
      id: number;
      application_id: number;
      title: string;
      first_names: string;
      surname: string;
      marital_status: string;
      maiden_name: string;
      national_id: string;
      passport_number: string;
      date_of_birth: string;
      place_of_birth: string;
      gender: string;
      citizenship: string;
      nationality: string;
      residential_address: string;
      postal_address: string;
      phone: string;
      email: string;
      city: string;
      country: string;
    };
    nextOfKin: {
      id: number;
      application_id: number;
      first_name: string;
      last_name: string;
      relationship: string;
      contact_address: string;
      contact_tel: string;
    };
    educationDetails: Array<{
      id: number;
      application_id: number;
      qualification_type: string;
      examination_board: string;
      subjects: Array<{
        id: number;
        education_id: number;
        subject_name: string;
        grade: string;
        year_written: number;
      }>;
    }>;
    documents: Array<{
      id: number;
      application_id: number;
      document_type: string;
      file_path: string;
      uploaded_at: string;
    }>;
  };
}

interface WithPinProps {
  totalWithPin: number;
}

interface FilterState {
  reference_number: string;
  starting_semester: string;
  programme: string;
  satellite_campus: string;
  created_at: string;
  student_number: string;
}

const WithPin: FC<WithPinProps> = ({ totalWithPin }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<FullApplicationDetails | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    reference_number: '',
    starting_semester: '',
    programme: '',
    satellite_campus: '',
    created_at: '',
    student_number: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      // Only fetch accepted applications
      queryParams.append('accepted_status', 'accepted');

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/applications${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchApplications();
  };

  const handleClearFilters = () => {
    setFilters({
      reference_number: '',
      starting_semester: '',
      programme: '',
      satellite_campus: '',
      created_at: '',
      student_number: '',
    });
    fetchApplications();
  };

  const handleViewDetails = async (referenceNumber: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${referenceNumber}/full-details`);
      const data = await response.json();
      setSelectedApplication(data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const handleDownloadDocument = async (filePath: string, documentType: string) => {
    try {
      const fileName = filePath.split('\\').pop() || documentType;
      const response = await fetch(`${API_BASE_URL}/applications/download?path=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const studentName = selectedApplication 
        ? `${selectedApplication.fullApplication.personalDetails.first_names} ${selectedApplication.fullApplication.personalDetails.surname}`
        : 'Unknown';
      
      const newFileName = `${documentType}_${studentName.replace(/\s+/g, '_')}.${fileName.split('.').pop()}`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = newFileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleDownloadOfferLetter = async (referenceNumber: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/student-numbers/offer-letter/${referenceNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to download offer letter');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `OfferLetter_${referenceNumber}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading offer letter:', error);
      alert('Failed to download offer letter. Please try again.');
    }
  };

  const handleRegenerateOfferLetter = async (referenceNumber: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/student-numbers/offer-letter/${referenceNumber}/regenerate`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to regenerate offer letter');
      }

      alert('Offer letter regenerated successfully!');
    } catch (error) {
      console.error('Error regenerating offer letter:', error);
      alert('Failed to regenerate offer letter. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Applicants with PIN ({applications.length})
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Accepted applicants issued with student numbers.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchApplications}
            sx={{ borderColor: 'primary.main' }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={showFilters ? <ClearIcon /> : <FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ borderColor: 'primary.main' }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Stack>
      </Box>
      
      <Card sx={{ p: 3, mb: 3 }}>
        {showFilters && (
          <Card sx={{ p: 2.5, mb: 3, bgcolor: '#F1F4EC', border: '1px solid #E3E6DE' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  value={filters.reference_number}
                  onChange={(e) => handleFilterChange('reference_number', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Student Number"
                  value={filters.student_number}
                  onChange={(e) => handleFilterChange('student_number', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Starting Semester</InputLabel>
                  <Select
                    value={filters.starting_semester}
                    label="Starting Semester"
                    onChange={(e) => handleFilterChange('starting_semester', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="August-December">August-December</MenuItem>
                    <MenuItem value="January-May">January-May</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Programme"
                  value={filters.programme}
                  onChange={(e) => handleFilterChange('programme', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Satellite Campus</InputLabel>
                  <Select
                    value={filters.satellite_campus}
                    label="Satellite Campus"
                    onChange={(e) => handleFilterChange('satellite_campus', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Bulawayo">Bulawayo</MenuItem>
                    <MenuItem value="Harare">Harare</MenuItem>
                    <MenuItem value="Kadoma">Kadoma</MenuItem>
                    <MenuItem value="Marondera">Marondera</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Created At"
                  value={filters.created_at}
                  onChange={(e) => handleFilterChange('created_at', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ borderColor: 'text.secondary', color: 'text.secondary' }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </Stack>
          </Card>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E3E6DE' }}>
            <Table sx={{ minWidth: 650 }} aria-label="applicants with pin table">
              <TableHead sx={{ bgcolor: '#F1F4EC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reference Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Programme</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Campus</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Paynow Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                      <Stack spacing={1} alignItems="center">
                        <SearchOffIcon sx={{ fontSize: 36, color: 'text.secondary' }} />
                        <Typography variant="subtitle1">No accepted applicants found</Typography>
                        <Chip label="Try adjusting filters" variant="outlined" />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow
                      key={app.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(19, 162, 21, 0.04)' } }}
                    >
                      <TableCell>{app.reference_number}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.student_number || 'N/A'} 
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{app.programme}</TableCell>
                      <TableCell>{app.satellite_campus}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.accepted_status} 
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={app.paynow_status === 'yes' ? 'Yes' : 'No'} 
                          color={app.paynow_status === 'yes' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(app.created_at)}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDetails(app.reference_number)}
                            sx={{ borderColor: 'primary.main' }}
                          >
                            View
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<PdfIcon />}
                            onClick={() => handleDownloadOfferLetter(app.reference_number)}
                            sx={{ borderColor: 'primary.main' }}
                          >
                            Offer Letter
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Application Details</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Accepted applicant profile and documents.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {selectedApplication && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={() => handleDownloadOfferLetter(selectedApplication.referenceNumber)}
                  >
                    Download Offer Letter
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleRegenerateOfferLetter(selectedApplication.referenceNumber)}
                    sx={{ borderColor: 'primary.main' }}
                  >
                    Regenerate
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={`${selectedApplication.fullApplication.personalDetails.title} ${selectedApplication.fullApplication.personalDetails.first_names} ${selectedApplication.fullApplication.personalDetails.surname}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student Number"
                        value={selectedApplication.studentNumber || selectedApplication.fullApplication.student_number || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={selectedApplication.fullApplication.personalDetails.email}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={selectedApplication.fullApplication.personalDetails.phone}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Education Details</Typography>
                  {selectedApplication.fullApplication.educationDetails.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">{edu.qualification_type}</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Subject</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Year</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {edu.subjects.map((subject, subIndex) => (
                            <TableRow key={subIndex}>
                              <TableCell>{subject.subject_name}</TableCell>
                              <TableCell>{subject.grade}</TableCell>
                              <TableCell>{subject.year_written}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Documents</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Type</TableCell>
                        <TableCell>Uploaded At</TableCell>
                        <TableCell align="center">Download</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedApplication.fullApplication.documents.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell>{doc.document_type}</TableCell>
                          <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download">
                              <IconButton
                                onClick={() => handleDownloadDocument(doc.file_path, doc.document_type)}
                                sx={{ color: '#13A215' }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WithPin; 
