import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Button,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import paynowLogo from '../assets/paynowlogo.png';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const subjectsList = [
  'Mathematics',
  'English Language',
  'Ndebele',
  'Shona',
  'Biology',
  'Chemistry',
  'Physics',
  'History',
  'Geography',
  'Literature',
  'Computer Science',
  'Business Studies',
  'Agriculture',
  'Food and Nutrition',
  'Woodwork',
  'Accounting',
  'Economics'
];

const gradesList = ['A', 'B', 'C', 'D', 'E', 'F'];

interface StepFiveProps {
  onNext: () => void;
  onBack: () => void;
}

const StepFive: React.FC<StepFiveProps> = ({ onNext, onBack }) => {
  // Get stored application data
  const [storedData, setStoredData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    try {
      const storedDataStr = sessionStorage.getItem('applicationData');
      if (storedDataStr) {
        const data = JSON.parse(storedDataStr);
        
        // Display existing education details if available
        if (data.educationDetails && data.educationDetails.length > 0) {
          // Find O-Level qualifications
          const oLevelDetails = data.educationDetails.find(
            (edu: any) => edu.qualification_type === "Ordinary Level"
          );
          if (oLevelDetails) {
            setExaminationBoard(oLevelDetails.examination_board || '');
          }

          // Find A-Level qualifications
          const aLevelDetails = data.educationDetails.find(
            (edu: any) => edu.qualification_type === "Advanced Level"
          );
          if (aLevelDetails) {
            setAdvancedLevel(true);
            setALevelExaminationBoard(aLevelDetails.examination_board || '');
          }
        }

        // Load subjects if available and format them correctly
        if (data.subjects && data.subjects.length > 0) {
          // Filter for unique subjects to avoid duplicates
          const uniqueSubjects = data.subjects.reduce((acc: any[], subject: any) => {
            const exists = acc.find(s => 
              s.subject_name === subject.subject_name && 
              s.grade === subject.grade && 
              s.year_written === subject.year_written
            );
            if (!exists) {
              acc.push(subject);
            }
            return acc;
          }, []);

          const formattedSubjects = uniqueSubjects.map((subject: any) => ({
            subject: subject.subject_name,
            grade: subject.grade,
            year: subject.year_written.toString()
          }));
          
          setSubjects(formattedSubjects); // This will now properly set the subjects state
        }

        // Load tertiary education if available
        if (data.tertiaryEducation && data.tertiaryEducation.length > 0) {
          const tertiaryEdu = data.tertiaryEducation[0];
          setInstitutionName(tertiaryEdu.institution_name || '');
          setDegreeDiploma(tertiaryEdu.qualification_obtained || '');
          setFieldOfStudy(tertiaryEdu.field_of_study || '');
          setYearCompleted(tertiaryEdu.year_completed ? tertiaryEdu.year_completed.toString() : '');
        }
      }
    } catch (error) {
      console.error('Error loading stored education data:', error);
    }
  }, []);

  const [examinationBoard, setExaminationBoard] = useState('');
  const [subjects, setSubjects] = useState<{ subject: string; grade: string; year: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // A-Level States
  const [advancedLevel, setAdvancedLevel] = useState(false);
  const [aLevelExaminationBoard, setALevelExaminationBoard] = useState('');
  const [aLevelSubjects, setALevelSubjects] = useState<{ subject: string; grade: string; year: string }[]>([]);
  const [aLevelSelectedSubject, setALevelSelectedSubject] = useState('');
  const [aLevelSelectedGrade, setALevelSelectedGrade] = useState('');
  const [aLevelSelectedYear, setALevelSelectedYear] = useState('');

  // Tertiary Education States
  const [institutionName, setInstitutionName] = useState('');
  const [degreeDiploma, setDegreeDiploma] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [yearCompleted, setYearCompleted] = useState('');

  const handleAddSubject = () => {
    if (selectedSubject && selectedGrade && selectedYear) {
      setSubjects([...subjects, { 
        subject: selectedSubject, 
        grade: selectedGrade, 
        year: selectedYear 
      }]);
      setSelectedSubject('');
      setSelectedGrade('');
      setSelectedYear('');
    }
  };

  const handleAddALevelSubject = () => {
    if (aLevelSelectedSubject && aLevelSelectedGrade && aLevelSelectedYear) {
      setALevelSubjects([...aLevelSubjects, { 
        subject: aLevelSelectedSubject, 
        grade: aLevelSelectedGrade, 
        year: aLevelSelectedYear 
      }]);
      setALevelSelectedSubject('');
      setALevelSelectedGrade('');
      setALevelSelectedYear('');
    }
  };

  const validateForm = () => {
    // Update validation to check the actual subjects array
    if (!subjects || subjects.length < 5) {
      setSnackbarMessage('Please add at least 5 O-level subjects');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }

    if (!examinationBoard) {
      setSnackbarMessage('Please enter O-level examination board');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return false;
    }

    // Only validate tertiary education fields if any of them are filled
    const hasTertiaryEducation = institutionName || degreeDiploma || fieldOfStudy || yearCompleted;
    if (hasTertiaryEducation) {
      // If any field is filled, all fields must be filled
      if (!institutionName || !degreeDiploma || !fieldOfStudy || !yearCompleted) {
        setSnackbarMessage('Please complete all tertiary education fields or leave them all empty');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const referenceNumber = sessionStorage.getItem('applicationReference');
    if (!referenceNumber) {
      setSnackbarMessage('Application reference not found. Please start from step one.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        qualifications: [
          {
            qualificationType: "Ordinary Level",
            examinationBoard: examinationBoard,
            subjects: subjects.map(s => ({
              subjectName: s.subject,
              grade: s.grade,
              yearWritten: parseInt(s.year)
            }))
          }
        ],
        tertiaryEducation: institutionName ? {
          institutionName: institutionName,
          qualificationObtained: degreeDiploma,
          fieldOfStudy: fieldOfStudy,
          yearCompleted: parseInt(yearCompleted)
        } : null
      };

      // Add A-level if provided
      if (advancedLevel && aLevelSubjects.length > 0) {
        payload.qualifications.push({
          qualificationType: "Advanced Level",
          examinationBoard: aLevelExaminationBoard,
          subjects: aLevelSubjects.map(s => ({
            subjectName: s.subject,
            grade: s.grade,
            yearWritten: parseInt(s.year)
          }))
        });
      }

      const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/applications/${referenceNumber}/education-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save education details');
      }

      setSnackbarMessage('Education details saved successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Wait for snackbar to show before proceeding
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to save education details. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a section to display existing education details
  const ExistingEducationDetails = () => {
    const storedData = JSON.parse(sessionStorage.getItem('applicationData') || '{}');
    
    return (
      <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(19, 162, 21, 0.05)', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#13A215' }}>
          Existing Education Details
        </Typography>
        
        {storedData.educationDetails && storedData.educationDetails.length > 0 ? (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Qualifications:
            </Typography>
            {storedData.educationDetails.map((edu: any, index: number) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  {edu.qualification_type} - {edu.examination_board}
                </Typography>
              </Box>
            ))}
          </>
        ) : (
          <Typography>No previous education details found.</Typography>
        )}

        {storedData.tertiaryEducation && storedData.tertiaryEducation.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Tertiary Education:
            </Typography>
            {storedData.tertiaryEducation.map((edu: any, index: number) => (
              <Box key={index}>
                {edu.institution_name && (
                  <Typography>Institution: {edu.institution_name}</Typography>
                )}
                {edu.qualification_obtained && (
                  <Typography>Qualification: {edu.qualification_obtained}</Typography>
                )}
                {edu.field_of_study && (
                  <Typography>Field of Study: {edu.field_of_study}</Typography>
                )}
                {edu.year_completed > 0 && (
                  <Typography>Year Completed: {edu.year_completed}</Typography>
                )}
              </Box>
            ))}
          </>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: {sessionStorage.getItem('applicationReference')}. Keep it safe.
      </Typography>

      <ExistingEducationDetails />

      {/* O-Level Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ordinary Level Qualifications (Required - Minimum 5 Subjects)
      </Typography>

      <TextField
        fullWidth
        required
        label="Examination Board"
        variant="outlined"
        value={examinationBoard}
        onChange={(e) => setExaminationBoard(e.target.value)}
        sx={{ mb: 2, mt: 2 }}
      />

      <Typography variant="body1" sx={{ mb: 2 }}>
        Add O-Level Subjects ({subjects.length} subjects{subjects.length >= 5 ? ' - Minimum requirement met' : ' - Need at least 5'}):
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select Subject</em>
          </MenuItem>
          {subjectsList.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select Grade</em>
          </MenuItem>
          {gradesList.map((grade) => (
            <MenuItem key={grade} value={grade}>
              {grade}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Year"
        variant="outlined"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button 
        variant="contained" 
        onClick={handleAddSubject} 
        sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
          },
        }}
      >
        Add Subject
      </Button>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Added O-Level Subjects ({subjects.length} subjects{subjects.length >= 5 ? ' - Minimum requirement met' : ' - Need at least 5'}):
      </Typography>
      {subjects.map((subject, index) => (
        <Typography key={index}>
          {subject.subject} - Grade: {subject.grade}, Year: {subject.year}
        </Typography>
      ))}
      
      {subjects.length >= 5 && (
        <Typography sx={{ color: '#13A215', mt: 1, mb: 2 }}>
          ✓ You have met the minimum requirement of 5 O-level subjects
        </Typography>
      )}

      {/* A-Level Section (Optional) */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Advanced Level Qualifications (Optional)
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedLevel}
              onChange={(e) => setAdvancedLevel(e.target.checked)}
            />
          }
          label="I have A-Level qualifications"
        />
      </FormGroup>

      {advancedLevel && (
        <>
          <TextField
            fullWidth
            label="A-Level Examination Board"
            variant="outlined"
            value={aLevelExaminationBoard}
            onChange={(e) => setALevelExaminationBoard(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />

          <Typography variant="body1" sx={{ mb: 2 }}>
            Add A-Level Subjects:
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={aLevelSelectedSubject}
              onChange={(e) => setALevelSelectedSubject(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select Subject</em>
              </MenuItem>
              {subjectsList.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={aLevelSelectedGrade}
              onChange={(e) => setALevelSelectedGrade(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select Grade</em>
              </MenuItem>
              {gradesList.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Year"
            variant="outlined"
            value={aLevelSelectedYear}
            onChange={(e) => setALevelSelectedYear(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button 
            variant="contained" 
            onClick={handleAddALevelSubject} 
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #13A215, #1DBDD0)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0B8A0D, #189AAD)',
              },
            }}
          >
            Add A-Level Subject
          </Button>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Added A-Level Subjects:
          </Typography>
          {aLevelSubjects.map((subject, index) => (
            <Typography key={index}>
              {subject.subject} - Grade: {subject.grade}, Year: {subject.year}
            </Typography>
          ))}
        </>
      )}

      {/* Tertiary Education Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Tertiary Education (Optional)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        If you have tertiary education, please fill in all fields below. Otherwise, you can leave them empty.
      </Typography>
      <TextField
        fullWidth
        label="Name of Institution"
        variant="outlined"
        value={institutionName}
        onChange={(e) => setInstitutionName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Qualification Obtained (Degree/Diploma)"
        variant="outlined"
        value={degreeDiploma}
        onChange={(e) => setDegreeDiploma(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Field of Study"
        variant="outlined"
        value={fieldOfStudy}
        onChange={(e) => setFieldOfStudy(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Year Completed"
        variant="outlined"
        type="number"
        value={yearCompleted}
        onChange={(e) => setYearCompleted(e.target.value)}
        sx={{ mb: 2 }}
      />

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

export default StepFive; 