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
} from '@mui/material';
import { Visibility as VisibilityIcon, Download as DownloadIcon, FilterList as FilterListIcon, Clear as ClearIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Application {
  id: number;
  reference_number: string;
  programme: string;
  satellite_campus: string;
  created_at: string;
  accepted_status: string;
}

interface FullApplicationDetails {
  referenceNumber: string;
  startingSemester: string;
  satelliteCampus: string;
  acceptedStatus: string;
  createdAt: string;
  programme: string;
  fullApplication: {
    personalDetails: {
      title: string;
      first_names: string;
      surname: string;
      email: string;
      phone: string;
      address?: string;
    };
    educationDetails: Array<{
      qualification_type: string;
      examination_board: string;
      subjects: Array<{
        subject_name: string;
        grade: string;
        year_written: number;
      }>;
    }>;
    documents: Array<{
      document_type: string;
      file_path: string;
      uploaded_at: string;
    }>;
  };
}

interface WaitingAcceptanceProps {
  totalWaiting: number;
}

interface FilterState {
  reference_number: string;
  starting_semester: string;
  programme: string;
  satellite_campus: string;
  created_at: string;
  accepted_status: string;
}

const WaitingAcceptance: FC<WaitingAcceptanceProps> = ({ totalWaiting }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<FullApplicationDetails | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    reference_number: '',
    starting_semester: '',
    programme: '',
    satellite_campus: '',
    created_at: '',
    accepted_status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = `http://localhost:3000/dev/api/v1/applications${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
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
      accepted_status: '',
    });
    fetchApplications();
  };

  const handleViewDetails = async (referenceNumber: string) => {
    try {
      const response = await fetch(`http://localhost:3000/dev/api/v1/applications/${referenceNumber}/full-details`);
      const data = await response.json();
      setSelectedApplication(data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const handleDownloadDocument = async (filePath: string, documentType: string) => {
    try {
      // Extract filename from the path
      const fileName = filePath.split('\\').pop() || documentType;
      
      // Make a request to download the file using the new API endpoint
      const response = await fetch(`http://localhost:3000/dev/api/v1/applications/download?path=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Get student's full name from selectedApplication
      const studentName = selectedApplication 
        ? `${selectedApplication.fullApplication.personalDetails.first_names} ${selectedApplication.fullApplication.personalDetails.surname}`
        : 'Unknown';
      
      // Create new filename with document type and student name
      const newFileName = `${documentType}_${studentName.replace(/\s+/g, '_')}.${fileName.split('.').pop()}`;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = newFileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleExportAsPdf = () => {
    if (!selectedApplication) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add header
    doc.setFontSize(16);
    doc.text('Application Form for Admission', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('into Postgraduate/Undergraduate Degree Programmes', pageWidth / 2, 30, { align: 'center' });
    
    // Add application details
    doc.setFontSize(10);
    doc.text(`Application No: ${selectedApplication.referenceNumber}`, 20, 45);
    doc.text(`Year of Application: ${new Date().getFullYear()}`, 20, 50);
    
    // Add programme details
    doc.text('1. The year in which you wish to commence your studies at the University', 20, 65);
    doc.text(selectedApplication.startingSemester.split('-')[0], 20, 70);
    doc.text('Programme being applied for:', 20, 75);
    doc.text(selectedApplication.programme || 'N/A', 20, 80);
    doc.text('Region:', 20, 85);
    doc.text(selectedApplication.satelliteCampus || 'N/A', 20, 90);
    
    // Add personal details
    doc.text('2. Applicants Biodata', 20, 105);
    const personalDetails = selectedApplication.fullApplication.personalDetails;
    doc.text(`2.1 Surname: ${personalDetails.surname || 'N/A'}`, 20, 115);
    doc.text(`2.2 Title: ${personalDetails.title || 'N/A'}`, 20, 120);
    doc.text(`2.3 First names: ${personalDetails.first_names || 'N/A'}`, 20, 125);
    doc.text(`2.15 Residential Address: ${personalDetails.address || 'N/A'}`, 20, 130);
    doc.text(`E-mail address: ${personalDetails.email || 'N/A'}`, 20, 135);
    doc.text(`Telephone: ${personalDetails.phone || 'N/A'}`, 20, 140);
    
    // Add education details
    doc.text('5. Educational Qualifications', 20, 155);
    doc.text('5.1 O Level or Equivalent', 20, 165);
    
    // Create table for education details
    const educationData = selectedApplication.fullApplication.educationDetails.flatMap(edu => 
      edu.subjects.map(subject => [
        edu.qualification_type || 'N/A',
        subject.subject_name || 'N/A',
        subject.grade || 'N/A',
        subject.year_written?.toString() || 'N/A'
      ])
    );
    
    autoTable(doc, {
      startY: 170,
      head: [['Institution', 'Subject', 'Grade', 'Year']],
      body: educationData,
      theme: 'grid',
      headStyles: { fillColor: [19, 162, 21] },
      margin: { left: 20 }
    });
    
    // Add footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.text('549 Arcturus Road, Harare', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('Website : www.apply.wua.ac.zw, E-mail : webmaster@wua.ac.zw', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    doc.save(`Application_${selectedApplication.referenceNumber}.pdf`);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#333' }}>
          Applications ({applications.length})
        </Typography>
        <Button
          variant="outlined"
          startIcon={showFilters ? <ClearIcon /> : <FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ 
            color: '#13A215', 
            borderColor: '#13A215',
            '&:hover': {
              borderColor: '#13A215',
              backgroundColor: 'rgba(19, 162, 21, 0.04)',
            }
          }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>
      
      <Card sx={{ p: 3, mb: 3 }}>
        {showFilters && (
          <Card sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
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
                    <MenuItem value="UK">UK</MenuItem>
                    <MenuItem value="US">US</MenuItem>
                    <MenuItem value="ZA">ZA</MenuItem>
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.accepted_status}
                    label="Status"
                    onChange={(e) => handleFilterChange('accepted_status', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ 
                  color: '#666', 
                  borderColor: '#666',
                  '&:hover': {
                    borderColor: '#666',
                    backgroundColor: 'rgba(102, 102, 102, 0.04)',
                  }
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ 
                  bgcolor: '#13A215',
                  '&:hover': {
                    bgcolor: '#0f7d10',
                  }
                }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Card>
        )}
        
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
          <Table sx={{ minWidth: 650 }} aria-label="waiting acceptance table">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Reference Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Programme</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Campus</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow
                  key={app.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(19, 162, 21, 0.04)' } }}
                >
                  <TableCell>{app.reference_number}</TableCell>
                  <TableCell>{app.programme}</TableCell>
                  <TableCell>{app.satellite_campus}</TableCell>
                  <TableCell>
                    <Chip 
                      label={app.accepted_status} 
                      color={getStatusChipColor(app.accepted_status) as "warning" | "success" | "error" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(app.created_at)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(app.reference_number)}
                      sx={{ 
                        color: '#13A215', 
                        borderColor: '#13A215',
                        '&:hover': {
                          borderColor: '#13A215',
                          backgroundColor: 'rgba(19, 162, 21, 0.04)',
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Application Details</Typography>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleExportAsPdf}
              sx={{ 
                bgcolor: '#13A215',
                '&:hover': {
                  bgcolor: '#0f7d10',
                }
              }}
            >
              Export as PDF
            </Button>
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
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WaitingAcceptance; 