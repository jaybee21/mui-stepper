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
import wuaLogo from './wua-logo.png';

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
    disabilities: Array<{
      id: number;
      application_id: number;
      has_disability: string;
      blindness: number;
      cerebral_palsy: number;
      deafness: number;
      speech_impairment: number;
      other: string | null;
      extra_adaptations: string | null;
    }>;
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
      const url = `https://apply.wua.ac.zw/dev/api/v1/applications${queryString ? `?${queryString}` : ''}`;
      
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
      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/${referenceNumber}/full-details`);
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
      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/download?path=${encodeURIComponent(fileName)}`);
      
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

  const getStatusChipColor = (status: string | null) => {
    if (!status) return 'default';
    
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

    const pdfDoc = new jsPDF();
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    let yPosition = 20;
    
    // Add WUA logo
    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    pdfDoc.addImage(wuaLogo, 'PNG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 10;
    
    // Add header
    pdfDoc.setFontSize(20);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('Application Form for Admission', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    pdfDoc.setFontSize(14);
    pdfDoc.text('into Postgraduate/Undergraduate Degree Programmes', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Add application details
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(`Application No: ${selectedApplication.referenceNumber}`, 20, yPosition);
    yPosition += 5;
    pdfDoc.text(`Year of Application: ${new Date(selectedApplication.createdAt).getFullYear()}`, 20, yPosition);
    yPosition += 15;
    
    // Add programme details
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('1. Programme Details', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Programme Details
    pdfDoc.setDrawColor(0, 0, 0);
    pdfDoc.setLineWidth(0.5);
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    // Programme details in two columns
    const leftMargin = 20;
    const rightMargin = pageWidth / 2 + 10;
    const lineHeight = 5;
    
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text(`Starting Semester: ${selectedApplication.startingSemester}`, leftMargin, yPosition);
    pdfDoc.text(`Programme: ${selectedApplication.fullApplication.programme}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Program Type: ${selectedApplication.fullApplication.program_type}`, leftMargin, yPosition);
    pdfDoc.text(`Preferred Session: ${selectedApplication.fullApplication.preferred_session}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Region/Campus: ${selectedApplication.satelliteCampus}`, leftMargin, yPosition);
    pdfDoc.text(`Year of Commencement: ${selectedApplication.fullApplication.year_of_commencement}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`WUA Discovery Method: ${selectedApplication.fullApplication.wua_discovery_method}`, leftMargin, yPosition);
    pdfDoc.text(`Previous Registration: ${selectedApplication.fullApplication.previous_registration}`, rightMargin, yPosition);
    yPosition += 15;
    
    // Add personal details
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('2. Personal Information', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Personal Information
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    // Personal details in two columns
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    const personalDetails = selectedApplication.fullApplication.personalDetails;
    
    pdfDoc.text(`Title: ${personalDetails.title}`, leftMargin, yPosition);
    pdfDoc.text(`Full Name: ${personalDetails.first_names} ${personalDetails.surname}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Marital Status: ${personalDetails.marital_status}`, leftMargin, yPosition);
    pdfDoc.text(`Maiden Name: ${personalDetails.maiden_name || 'N/A'}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`National ID: ${personalDetails.national_id}`, leftMargin, yPosition);
    pdfDoc.text(`Passport Number: ${personalDetails.passport_number || 'N/A'}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Date of Birth: ${new Date(personalDetails.date_of_birth).toLocaleDateString()}`, leftMargin, yPosition);
    pdfDoc.text(`Place of Birth: ${personalDetails.place_of_birth}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Gender: ${personalDetails.gender}`, leftMargin, yPosition);
    pdfDoc.text(`Citizenship: ${personalDetails.citizenship}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Nationality: ${personalDetails.nationality}`, leftMargin, yPosition);
    pdfDoc.text(`City: ${personalDetails.city}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Residential Address: ${personalDetails.residential_address}`, leftMargin, yPosition);
    pdfDoc.text(`Postal Address: ${personalDetails.postal_address}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Phone: ${personalDetails.phone}`, leftMargin, yPosition);
    pdfDoc.text(`Email: ${personalDetails.email}`, rightMargin, yPosition);
    yPosition += 15;
    
    // Add Next of Kin details
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('3. Next of Kin Information', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Next of Kin Information
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    // Next of Kin details in two columns
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    const nextOfKin = selectedApplication.fullApplication.nextOfKin;
    
    pdfDoc.text(`Full Name: ${nextOfKin.first_name} ${nextOfKin.last_name}`, leftMargin, yPosition);
    pdfDoc.text(`Relationship: ${nextOfKin.relationship}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Contact Address: ${nextOfKin.contact_address}`, leftMargin, yPosition);
    pdfDoc.text(`Contact Telephone: ${nextOfKin.contact_tel}`, rightMargin, yPosition);
    yPosition += 15;
    
    // Add Disabilities information
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('4. Special Needs Information', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Special Needs Information
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    const disabilities = selectedApplication.fullApplication.disabilities[0];
    pdfDoc.text(`Has Disability: ${disabilities.has_disability}`, leftMargin, yPosition);
    yPosition += lineHeight;
    
    if (disabilities.has_disability === 'Yes') {
      pdfDoc.text('Disability Types:', leftMargin, yPosition);
      yPosition += lineHeight;
      if (disabilities.blindness) pdfDoc.text('- Blindness', leftMargin + 5, yPosition), yPosition += lineHeight;
      if (disabilities.cerebral_palsy) pdfDoc.text('- Cerebral Palsy', leftMargin + 5, yPosition), yPosition += lineHeight;
      if (disabilities.deafness) pdfDoc.text('- Deafness', leftMargin + 5, yPosition), yPosition += lineHeight;
      if (disabilities.speech_impairment) pdfDoc.text('- Speech Impairment', leftMargin + 5, yPosition), yPosition += lineHeight;
      if (disabilities.other) pdfDoc.text(`- Other: ${disabilities.other}`, leftMargin + 5, yPosition), yPosition += lineHeight;
      if (disabilities.extra_adaptations) pdfDoc.text(`Extra Adaptations: ${disabilities.extra_adaptations}`, leftMargin, yPosition), yPosition += lineHeight;
    }
    
    // Add footer to first page
    const pageHeight = pdfDoc.internal.pageSize.getHeight();
    pdfDoc.setFontSize(8);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text('549 Arcturus Road, Harare', pageWidth / 2, pageHeight - 20, { align: 'center' });
    pdfDoc.text('Website : www.apply.wua.ac.zw, E-mail : webmaster@wua.ac.zw', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Add new page for Educational Qualifications
    pdfDoc.addPage();
    yPosition = 20;
    
    // Add education details
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('5. Educational Qualifications', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Educational Qualifications
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    // Create tables for each education level
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    selectedApplication.fullApplication.educationDetails.forEach(edu => {
      // Add qualification level label
      pdfDoc.setFont(undefined, 'bold');
      const qualificationLabel = edu.qualification_type.toLowerCase().includes('level') 
        ? edu.qualification_type 
        : `${edu.qualification_type} Level`;
      pdfDoc.text(`${qualificationLabel} (${edu.examination_board})`, 20, yPosition);
      yPosition += 5;
      
      const educationData = edu.subjects.map(subject => [
        subject.subject_name,
        subject.grade,
        subject.year_written.toString()
      ]);
      
      autoTable(pdfDoc, {
        startY: yPosition,
        head: [['Subject', 'Grade', 'Year']],
        body: educationData,
        theme: 'grid',
        headStyles: { fillColor: [19, 162, 21], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: 20 }
      });
      
      yPosition = (pdfDoc as any).lastAutoTable.finalY + 10;
    });
    
    // Add footer to second page
    pdfDoc.setFontSize(8);
    pdfDoc.setFont(undefined, 'normal');
    pdfDoc.text('549 Arcturus Road, Harare', pageWidth / 2, pageHeight - 20, { align: 'center' });
    pdfDoc.text('Website : www.apply.wua.ac.zw, E-mail : webmaster@wua.ac.zw', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    pdfDoc.save(`Application_${selectedApplication.referenceNumber}.pdf`);
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