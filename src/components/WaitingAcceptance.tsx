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
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility as VisibilityIcon, Download as DownloadIcon, FilterList as FilterListIcon, Clear as ClearIcon, PictureAsPdf as PdfIcon, SearchOff as SearchOffIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import wuaLogo from './wua-logo.png';
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
}

interface FullApplicationDetails {
  referenceNumber: string;
  startingSemester: string | null;
  satelliteCampus: string;
  acceptedStatus: string;
  createdAt: string;
  fullApplication: {
    id: number;
    reference_number: string;
    starting_semester: string | null;
    programme: string;
    programme1?: string | null;
    programme2?: string | null;
    satellite_campus: string;
    preferred_session: string;
    wua_discovery_method: string;
    previous_registration: string;
    created_at: string;
    program_type: string | null;
    accepted_status: string;
    student_number: string | null;
    year_of_commencement: number;
    ip_address?: { type: string; data: number[] } | null;
    user_agent?: string | null;
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
      marital_status: string | null;
      maiden_name: string | null;
      national_id: string | null;
      passport_number: string | null;
      date_of_birth: string;
      place_of_birth: string;
      gender: string;
      citizenship: string;
      nationality: string;
      residential_address: string;
      postal_address: string;
      phone: string;
      email: string;
      city: string | null;
      country: string | null;
      application_number?: string | null;
      paynow?: string | null;
    };
    nextOfKin: {
      id: number;
      application_id: number;
      full_name?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      relationship: string;
      contact_address: string;
      contact_tel: string;
    };
    academicSummary: {
      id: number;
      application_id: number;
      olevel_subject_count: number | null;
      olevel_includes_english: string | null;
      olevel_includes_maths: string | null;
      has_alevel: string | null;
      alevel_passes_e_or_better: number | null;
      has_professional_cert: string | null;
      has_diploma: string | null;
      has_degree: string | null;
      notes: string | null;
      created_at: string;
    };
    uploads: Array<{
      id: number;
      application_id: number;
      file_kind: string;
      original_name: string;
      stored_name: string;
      stored_path: string;
      mime_type: string;
      file_size_bytes: number;
      sha256: string;
      created_at: string;
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
  const [decisionLoadingRef, setDecisionLoadingRef] = useState<string | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [acceptReference, setAcceptReference] = useState<string | null>(null);
  const [acceptProgrammes, setAcceptProgrammes] = useState<string[]>([]);
  const [acceptProgramme, setAcceptProgramme] = useState<string>('');
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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
      const url = `${API_BASE_URL}/applications${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      // Filter out accepted students - they should appear in "Applicants with PIN" instead
      const filteredData = data.filter((app: Application) => app.accepted_status?.toLowerCase() !== 'accepted');
      setApplications(filteredData);
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
      const response = await fetch(`${API_BASE_URL}/applications/${referenceNumber}/full-details`);
      const data = await response.json();
      setSelectedApplication(data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const handleDownloadDocument = async (filePathOrName: string, documentType: string) => {
    try {
      const normalizedPath = filePathOrName.trim();
      const fileName = normalizedPath.split(/[\\/]/).pop() || documentType;
      
      // Make a request to download the file using the new API endpoint
      const response = await fetch(`${API_BASE_URL}/applications/download?path=${encodeURIComponent(normalizedPath)}`);
      
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
      const extension = fileName.includes('.') ? fileName.split('.').pop() : '';
      const newFileName = `${documentType}_${studentName.replace(/\s+/g, '_')}${extension ? `.${extension}` : ''}`;
      
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

  const formatYesNo = (value: string | null | undefined) => {
    const normalized = (value || '').toString().trim().toUpperCase();
    if (normalized === 'Y' || normalized === 'YES') return 'Yes';
    if (normalized === 'N' || normalized === 'NO') return 'No';
    return value ?? 'N/A';
  };

  const handleDecision = async (referenceNumber: string, decision: 'accept' | 'reject') => {
    const confirmText =
      decision === 'accept'
        ? `Accept application ${referenceNumber}?`
        : `Decline application ${referenceNumber}? This will update the student's status and may trigger an email.`;

    if (decision === 'accept') {
      await openAcceptDialog(referenceNumber);
      return;
    }

    const confirmed = window.confirm(confirmText);
    if (!confirmed) return;

    setDecisionLoadingRef(referenceNumber);
    try {
      // Accept + assign student number, or reject application
      const endpoint =
        decision === 'accept'
          ? `${API_BASE_URL}/student-numbers/assign/${referenceNumber}`
          : `${API_BASE_URL}/applications/${referenceNumber}/reject`;

      const response = await fetchWithAuth(endpoint, { method: 'POST' });
      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || 'Failed to update application status');
      }

      // Refresh list + details (if open)
      await fetchApplications();
      if (selectedApplication?.referenceNumber === referenceNumber) {
        await handleViewDetails(referenceNumber);
      }
    } catch (error) {
      console.error('Error updating decision:', error);
      alert('Failed to update application status. Please check the backend endpoint and try again.');
    } finally {
      setDecisionLoadingRef(null);
    }
  };

  const openAcceptDialog = async (referenceNumber: string) => {
    setAcceptError(null);
    setAcceptProgramme('');
    setAcceptProgrammes([]);
    setAcceptReference(referenceNumber);

    try {
      let details = selectedApplication;
      if (!details || details.referenceNumber !== referenceNumber) {
        const response = await fetch(`${API_BASE_URL}/applications/${referenceNumber}/full-details`);
        details = await response.json();
        setSelectedApplication(details);
      }

      const programmes = [
        details.fullApplication.programme,
        details.fullApplication.programme1,
        details.fullApplication.programme2,
      ].filter((value): value is string => !!value && value.trim().length > 0);

      const uniqueProgrammes = Array.from(new Set(programmes));
      setAcceptProgrammes(uniqueProgrammes);
      setAcceptProgramme(uniqueProgrammes[0] || '');
      setAcceptDialogOpen(true);
    } catch (error) {
      console.error('Error preparing accept dialog:', error);
      setAcceptError('Failed to load programme options. Please try again.');
      setAcceptDialogOpen(true);
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptReference) return;

    if (!acceptProgramme) {
      setAcceptError('Please select an accepted programme.');
      return;
    }

    setAcceptLoading(true);
    setAcceptError(null);
    try {
      const endpoint = `${API_BASE_URL}/student-numbers/assign/${acceptReference}`;
      const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedProgramme: acceptProgramme }),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || 'Failed to accept application');
      }

      setAcceptDialogOpen(false);
      setToastMessage(`Application ${acceptReference} accepted.`);
      setToastOpen(true);

      await fetchApplications();
      if (selectedApplication?.referenceNumber === acceptReference) {
        await handleViewDetails(acceptReference);
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      setAcceptError('Failed to accept application. Please try again.');
    } finally {
      setAcceptLoading(false);
    }
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
    pdfDoc.text(`Programme: ${selectedApplication.fullApplication.programme}`, rightMargin, yPosition);
    yPosition += lineHeight;

    const altProgramme1 = selectedApplication.fullApplication.programme1 || 'N/A';
    const altProgramme2 = selectedApplication.fullApplication.programme2 || 'N/A';
    pdfDoc.text(`Programme 1: ${altProgramme1}`, leftMargin, yPosition);
    pdfDoc.text(`Programme 2: ${altProgramme2}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
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
    
    pdfDoc.text(`Marital Status: ${personalDetails.marital_status || 'N/A'}`, leftMargin, yPosition);
    pdfDoc.text(`Maiden Name: ${personalDetails.maiden_name || 'N/A'}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`National ID: ${personalDetails.national_id || 'N/A'}`, leftMargin, yPosition);
    pdfDoc.text(`Passport Number: ${personalDetails.passport_number || 'N/A'}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Date of Birth: ${new Date(personalDetails.date_of_birth).toLocaleDateString()}`, leftMargin, yPosition);
    pdfDoc.text(`Place of Birth: ${personalDetails.place_of_birth}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Gender: ${personalDetails.gender}`, leftMargin, yPosition);
    pdfDoc.text(`Citizenship: ${personalDetails.citizenship}`, rightMargin, yPosition);
    yPosition += lineHeight;
    
    pdfDoc.text(`Nationality: ${personalDetails.nationality}`, leftMargin, yPosition);
    pdfDoc.text(`City: ${personalDetails.city || 'N/A'}`, rightMargin, yPosition);
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
    const nextOfKinName = nextOfKin.full_name || `${nextOfKin.first_name || ''} ${nextOfKin.last_name || ''}`.trim() || 'N/A';
    
    pdfDoc.text(`Full Name: ${nextOfKinName}`, leftMargin, yPosition);
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
    const disabilities = selectedApplication.fullApplication.disabilities?.[0];
    if (disabilities) {
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
    } else {
      pdfDoc.text('Has Disability: N/A', leftMargin, yPosition);
      yPosition += lineHeight;
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
    
    // Add academic summary
    pdfDoc.setFontSize(14);
    pdfDoc.setFont(undefined, 'bold');
    pdfDoc.text('5. Academic Summary', 20, yPosition);
    yPosition += 8;
    
    // Draw underline for Academic Summary
    pdfDoc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;
    
    pdfDoc.setFontSize(10);
    pdfDoc.setFont(undefined, 'normal');
    const academicSummary = selectedApplication.fullApplication.academicSummary;
    const academicRows = [
      ['O-Level Subject Count', academicSummary?.olevel_subject_count?.toString() || 'N/A'],
      ['O-Level Includes English', formatYesNo(academicSummary?.olevel_includes_english)],
      ['O-Level Includes Maths', formatYesNo(academicSummary?.olevel_includes_maths)],
      ['Has A-Level', formatYesNo(academicSummary?.has_alevel)],
      ['A-Level Passes (E or better)', academicSummary?.alevel_passes_e_or_better?.toString() || 'N/A'],
      ['Has Professional Cert', formatYesNo(academicSummary?.has_professional_cert)],
      ['Has Diploma', formatYesNo(academicSummary?.has_diploma)],
      ['Has Degree', formatYesNo(academicSummary?.has_degree)],
      ['Notes', academicSummary?.notes || 'N/A'],
    ];
    
    autoTable(pdfDoc, {
      startY: yPosition,
      head: [['Item', 'Value']],
      body: academicRows,
      theme: 'grid',
      headStyles: { fillColor: [19, 162, 21], textColor: [255, 255, 255], fontStyle: 'bold' },
      margin: { left: 20 }
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
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Applications ({applications.length})
        </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Review applicants awaiting acceptance.
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
        
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E3E6DE' }}>
          <Table sx={{ minWidth: 650 }} aria-label="waiting acceptance table">
            <TableHead sx={{ bgcolor: '#F1F4EC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Reference Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Programme</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Campus</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Paynow Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Stack spacing={1} alignItems="center">
                      <SearchOffIcon sx={{ fontSize: 36, color: 'text.secondary' }} />
                      <Typography variant="subtitle1">No applications found</Typography>
                      <Chip label="Adjust filters or refresh" variant="outlined" />
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
                    <TableCell>{app.programme}</TableCell>
                    <TableCell>{app.satellite_campus}</TableCell>
                    <TableCell>
                      <Chip 
                        label={app.accepted_status} 
                        color={getStatusChipColor(app.accepted_status) as "warning" | "success" | "error" | "default"}
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
                          View Details
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          disabled={decisionLoadingRef === app.reference_number}
                          onClick={() => handleDecision(app.reference_number, 'accept')}
                        >
                          Accept
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={decisionLoadingRef === app.reference_number}
                          onClick={() => handleDecision(app.reference_number, 'reject')}
                        >
                          Decline
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Application Details</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Review applicant information and documents.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {selectedApplication && (
                <>
                  <Button
                    variant="contained"
                    disabled={decisionLoadingRef === selectedApplication.referenceNumber}
                    onClick={() => handleDecision(selectedApplication.referenceNumber, 'accept')}
                    sx={{ 
                      bgcolor: '#13A215',
                      '&:hover': { bgcolor: '#0f7d10' },
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={decisionLoadingRef === selectedApplication.referenceNumber}
                    onClick={() => handleDecision(selectedApplication.referenceNumber, 'reject')}
                  >
                    Decline
                  </Button>
                </>
              )}
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
                  <Typography variant="h6" gutterBottom>Academic Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="O-Level Subject Count"
                        value={selectedApplication.fullApplication.academicSummary?.olevel_subject_count ?? 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="O-Level Includes English"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.olevel_includes_english)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="O-Level Includes Maths"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.olevel_includes_maths)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Has A-Level"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.has_alevel)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="A-Level Passes (E or better)"
                        value={selectedApplication.fullApplication.academicSummary?.alevel_passes_e_or_better ?? 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Has Diploma"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.has_diploma)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Has Degree"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.has_degree)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Has Professional Cert"
                        value={formatYesNo(selectedApplication.fullApplication.academicSummary?.has_professional_cert)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
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
                      {selectedApplication.fullApplication.uploads.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell>{doc.file_kind}</TableCell>
                          <TableCell>{formatDate(doc.created_at)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download">
                              <IconButton
                                onClick={() => handleDownloadDocument(doc.stored_path || doc.stored_name, doc.file_kind)}
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

      <Dialog
        open={acceptDialogOpen}
        onClose={() => setAcceptDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Select Accepted Programme</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Choose the programme to finalize acceptance.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Choose the programme that will be used to assign the student number.
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Accepted Programme</InputLabel>
            <Select
              value={acceptProgramme}
              label="Accepted Programme"
              onChange={(e) => setAcceptProgramme(e.target.value)}
            >
              {acceptProgrammes.map((programme) => (
                <MenuItem key={programme} value={programme}>
                  {programme}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {acceptError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {acceptError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)} disabled={acceptLoading} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAccept}
            disabled={acceptLoading}
            sx={{ 
              bgcolor: '#13A215',
              '&:hover': { bgcolor: '#0f7d10' },
            }}
          >
            Confirm Acceptance
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)} variant="filled">
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WaitingAcceptance; 
