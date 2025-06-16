import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import paynowLogo from '../assets/paynowlogo.png';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface StepSevenProps {
  onNext: () => void;
  onBack: () => void;
}

const StepSeven: React.FC<StepSevenProps> = ({ onNext, onBack }) => {
  const [academicCertificates, setAcademicCertificates] = useState<File | null>(null);
  const [professionalCertificates, setProfessionalCertificates] = useState<File | null>(null);
  const [proposal, setProposal] = useState<File | null>(null);
  const [applicationFee, setApplicationFee] = useState<File | null>(null);
  const [birthCertificate, setBirthCertificate] = useState<File | null>(null);
  const [identityCard, setIdentityCard] = useState<File | null>(null);
  const [isProposalRequired, setIsProposalRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [existingDocuments, setExistingDocuments] = useState<string[]>([]);

  useEffect(() => {
    // Check session storage for existing documents and program type
    try {
      const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
      
      // Check if documents exist
      if (storedData.documents && storedData.documents.length > 0) {
        const documentTypes = storedData.documents.map((doc: any) => doc.document_type);
        setExistingDocuments(documentTypes);
      }

      // Check if PhD program to show proposal requirement
      if (storedData.application && storedData.application.program_type === 'PHD') {
        setIsProposalRequired(true);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage('File size must be less than 5MB');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/tiff'
      ];
      if (!allowedTypes.includes(file.type)) {
        setSnackbarMessage('Invalid file type. Please upload PDF, JPEG, GIF, Word, or TIFF files.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      setFile(file);
    }
  };

  const handleRemoveFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    setFile(null);
  };

  const validateFiles = () => {
    // Check if all required documents exist in existingDocuments
    const hasExistingAcademic = existingDocuments.some(doc => doc.toLowerCase().includes('academic'));
    const hasExistingProfessional = existingDocuments.some(doc => doc.toLowerCase().includes('professional'));
    const hasExistingFee = existingDocuments.some(doc => doc.toLowerCase().includes('fee'));
    const hasExistingBirth = existingDocuments.some(doc => doc.toLowerCase().includes('birth'));
    const hasExistingIdentity = existingDocuments.some(doc => doc.toLowerCase().includes('identity'));
    const hasExistingProposal = existingDocuments.some(doc => doc.toLowerCase().includes('proposal'));

    // Check if new documents are provided or if existing documents are present
    if (!academicCertificates && !hasExistingAcademic) {
      setSnackbarMessage('Academic certificates are required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (!professionalCertificates && !hasExistingProfessional) {
      setSnackbarMessage('Professional certificates are required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (!applicationFee && !hasExistingFee) {
      setSnackbarMessage('Application fee proof is required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (!birthCertificate && !hasExistingBirth) {
      setSnackbarMessage('Birth certificate is required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (!identityCard && !hasExistingIdentity) {
      setSnackbarMessage('Identity card is required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    if (isProposalRequired && !proposal && !hasExistingProposal) {
      setSnackbarMessage('Research proposal is required for PhD applications');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }

    // If we have either new uploads or existing documents for all required fields, return true
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFiles()) return;

    const referenceNumber = sessionStorage.getItem('applicationReference');
    if (!referenceNumber) {
      setSnackbarMessage('Application reference not found. Please start from step one.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Only proceed with API call if there are new documents to upload
    const hasNewDocuments = academicCertificates || professionalCertificates || applicationFee || 
                          birthCertificate || identityCard || (isProposalRequired && proposal);

    if (!hasNewDocuments) {
      // If no new documents, just proceed to next step
      setSnackbarMessage('Proceeding with existing documents');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        onNext();
      }, 1500);
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      
      // Only append files if they exist
      if (academicCertificates) {
        formData.append('academicCertificate', academicCertificates);
      }
      if (professionalCertificates) {
        formData.append('professionalCertificate', professionalCertificates);
      }
      if (applicationFee) {
        formData.append('applicationFee', applicationFee);
      }
      if (birthCertificate) {
        formData.append('birthCertificate', birthCertificate);
      }
      if (identityCard) {
        formData.append('identityCard', identityCard);
      }
      if (isProposalRequired && proposal) {
        formData.append('proposal', proposal);
      }

      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/${referenceNumber}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }

      setSnackbarMessage('Documents uploaded successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to upload documents. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Display existing documents section
  const ExistingDocuments = () => {
    return (
      <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(19, 162, 21, 0.05)', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#13A215' }}>
          Existing Documents
        </Typography>
        {existingDocuments.length > 0 ? (
          existingDocuments.map((docType, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              ✓ {docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Typography>
          ))
        ) : (
          <Typography>No documents have been uploaded yet.</Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: {sessionStorage.getItem('applicationReference')}. Keep it safe.
      </Typography>

      <ExistingDocuments />

      <Typography variant="body1" sx={{ mb: 2, color: 'error.main' }}>
        * All documents are required except for the research proposal (PhD students only)
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Please note you can only attach PDF, JPEG, GIF, Word, or TIFF files that are less than 5MB.
      </Typography>

      {isProposalRequired && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Research Proposal (Required for PhD):
          </Typography>
          <input
            type="file"
            accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
            onChange={(e) => handleFileChange(e, setProposal)}
          />
          {proposal && (
            <Box>
              <Typography variant="body2">{proposal.name}</Typography>
              <Button onClick={() => handleRemoveFile(setProposal)} color="error">
                Remove
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Academic Certificates (Required):
        </Typography>
        <input
          type="file"
          accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
          onChange={(e) => handleFileChange(e, setAcademicCertificates)}
        />
        {academicCertificates && (
          <Box>
            <Typography variant="body2">{academicCertificates.name}</Typography>
            <Button onClick={() => handleRemoveFile(setAcademicCertificates)} color="error">
              Remove
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Professional Certificates (Required):
        </Typography>
        <input
          type="file"
          accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
          onChange={(e) => handleFileChange(e, setProfessionalCertificates)}
        />
        {professionalCertificates && (
          <Box>
            <Typography variant="body2">{professionalCertificates.name}</Typography>
            <Button onClick={() => handleRemoveFile(setProfessionalCertificates)} color="error">
              Remove
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Application Fee (Required):
        </Typography>
        <input
          type="file"
          accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
          onChange={(e) => handleFileChange(e, setApplicationFee)}
        />
        {applicationFee && (
          <Box>
            <Typography variant="body2">{applicationFee.name}</Typography>
            <Button onClick={() => handleRemoveFile(setApplicationFee)} color="error">
              Remove
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Birth Certificate (Required):
        </Typography>
        <input
          type="file"
          accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
          onChange={(e) => handleFileChange(e, setBirthCertificate)}
        />
        {birthCertificate && (
          <Box>
            <Typography variant="body2">{birthCertificate.name}</Typography>
            <Button onClick={() => handleRemoveFile(setBirthCertificate)} color="error">
              Remove
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Identity Card (Required):
        </Typography>
        <input
          type="file"
          accept=".pdf,.jpeg,.gif,.doc,.docx,.pjpeg,.tiff"
          onChange={(e) => handleFileChange(e, setIdentityCard)}
        />
        {identityCard && (
          <Box>
            <Typography variant="body2">{identityCard.name}</Typography>
            <Button onClick={() => handleRemoveFile(setIdentityCard)} color="error">
              Remove
            </Button>
          </Box>
        )}
      </Box>

      {/* PayNow Section */}
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#13A215' }}>
          Click below to make your payment via PayNow
        </Typography>
        <Box 
          component="a"
          href="https://www.topup.co.zw/pay-bill/womens-university"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-block',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(19, 162, 21, 0.4)',
              },
              '70%': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 0 10px rgba(19, 162, 21, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(19, 162, 21, 0)',
              },
            },
            '&:hover': {
              transform: 'scale(1.1)',
              '& img': {
                borderColor: '#1DBDD0',
              },
            },
          }}
        >
          <img 
            src={paynowLogo}
            alt="PayNow Payment" 
            style={{ 
              maxWidth: '200px',
              height: 'auto',
              border: '2px solid #13A215',
              borderRadius: '8px',
              padding: '8px',
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Click the PayNow logo above to proceed with your payment
        </Typography>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ 
            color: '#13A215',
            borderColor: '#13A215',
            '&:hover': {
              borderColor: '#0B8A0D',
              backgroundColor: 'rgba(19, 162, 21, 0.04)',
            },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Next'}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepSeven; 