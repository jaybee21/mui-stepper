import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const StepSeven: React.FC = () => {
  const [academicCertificates, setAcademicCertificates] = useState<File | null>(null);
  const [professionalCertificates, setProfessionalCertificates] = useState<File | null>(null);
  const [proposal, setProposal] = useState<File | null>(null);
  const [applicationFee, setApplicationFee] = useState<File | null>(null);
  const [birthCertificate, setBirthCertificate] = useState<File | null>(null);
  const [identityCard, setIdentityCard] = useState<File | null>(null);
  const [isProposalRequired, setIsProposalRequired] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleRemoveFile = (setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    setFile(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: APL254002. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Please note you can only attach pdf, jpeg, gif, msword, pjpeg, tiff files that are less than 5MB.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Please attach the following documents:
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isProposalRequired}
              onChange={(e) => setIsProposalRequired(e.target.checked)}
            />
          }
          label="Proposal (M.Phil and D.Phil students only)"
        />
      </FormGroup>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Academic Certificates:
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
          Professional Certificates:
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

      {isProposalRequired && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Proposal:
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
          Application Fee:
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
          Birth Certificate:
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
          Identity Card:
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
    </Box>
  );
};

export default StepSeven; 