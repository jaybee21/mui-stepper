import React, { useState } from 'react';
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
} from '@mui/material';

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

const StepFive: React.FC = () => {
  const [ordinaryLevel, setOrdinaryLevel] = useState(false);
  const [otherQualification, setOtherQualification] = useState(false);
  const [otherDescription, setOtherDescription] = useState('');
  const [examinationBoard, setExaminationBoard] = useState('');
  const [subjects, setSubjects] = useState<{ subject: string; grade: string; year: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // A-Level States
  const [advancedLevel, setAdvancedLevel] = useState(false);
  const [otherAdvancedQualification, setOtherAdvancedQualification] = useState(false);
  const [otherAdvancedDescription, setOtherAdvancedDescription] = useState('');
  const [aLevelExaminationBoard, setALevelExaminationBoard] = useState('');
  const [aLevelSubjects, setALevelSubjects] = useState<{ subject: string; grade: string; year: string }[]>([]);
  const [aLevelSelectedSubject, setALevelSelectedSubject] = useState('');
  const [aLevelSelectedGrade, setALevelSelectedGrade] = useState('');
  const [aLevelSelectedYear, setALevelSelectedYear] = useState('');

  // Tertiary Education States
  const [institutionName, setInstitutionName] = useState('');
  const [degreeDiploma, setDegreeDiploma] = useState('');
  const [isFullTime, setIsFullTime] = useState(false);
  const [isPartTime, setIsPartTime] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [classification, setClassification] = useState('');

  const handleOrdinaryLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrdinaryLevel(event.target.checked);
  };

  const handleOtherQualificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherQualification(event.target.checked);
  };

  const handleAddSubject = () => {
    if (selectedSubject && selectedGrade && selectedYear) {
      setSubjects([...subjects, { subject: selectedSubject, grade: selectedGrade, year: selectedYear }]);
      setSelectedSubject('');
      setSelectedGrade('');
      setSelectedYear('');
    }
  };

  const handleAdvancedLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedLevel(event.target.checked);
  };

  const handleOtherAdvancedQualificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherAdvancedQualification(event.target.checked);
  };

  const handleAddALevelSubject = () => {
    if (aLevelSelectedSubject && aLevelSelectedGrade && aLevelSelectedYear) {
      setALevelSubjects([...aLevelSubjects, { subject: aLevelSelectedSubject, grade: aLevelSelectedGrade, year: aLevelSelectedYear }]);
      setALevelSelectedSubject('');
      setALevelSelectedGrade('');
      setALevelSelectedYear('');
    }
  };

  const handleAddTertiaryEducation = () => {
    // Logic to handle tertiary education submission can be added here
    console.log({
      institutionName,
      degreeDiploma,
      isFullTime,
      isPartTime,
      fromDate,
      toDate,
      classification,
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: #######. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Please select your secondary school qualifications:
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={ordinaryLevel}
              onChange={handleOrdinaryLevelChange}
            />
          }
          label="Ordinary Level"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={otherQualification}
              onChange={handleOtherQualificationChange}
            />
          }
          label="Other Secondary School Qualification"
        />
      </FormGroup>

      {otherQualification && (
        <TextField
          fullWidth
          label="Please specify"
          variant="outlined"
          value={otherDescription}
          onChange={(e) => setOtherDescription(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
        />
      )}

      <TextField
        fullWidth
        label="Examination Board"
        variant="outlined"
        value={examinationBoard}
        onChange={(e) => setExaminationBoard(e.target.value)}
        sx={{ mb: 2, mt: 2 }}
      />

      <Typography variant="body1" sx={{ mb: 2 }}>
        Add Subjects:
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

      <Button variant="contained" onClick={handleAddSubject} sx={{ mb: 2 }}>
        Add Subject
      </Button>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Added Subjects:
      </Typography>
      {subjects.map((subject, index) => (
        <Typography key={index}>
          {subject.subject} - Grade: {subject.grade}, Year: {subject.year}
        </Typography>
      ))}

      {/* Advanced Level Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Advanced Level Qualifications
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedLevel}
              onChange={handleAdvancedLevelChange}
            />
          }
          label="Advanced Level"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={otherAdvancedQualification}
              onChange={handleOtherAdvancedQualificationChange}
            />
          }
          label="Other Advanced Level School Qualification"
        />
      </FormGroup>

      {otherAdvancedQualification && (
        <TextField
          fullWidth
          label="Please specify"
          variant="outlined"
          value={otherAdvancedDescription}
          onChange={(e) => setOtherAdvancedDescription(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
        />
      )}

      <TextField
        fullWidth
        label="Examination Board"
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

      <Button variant="contained" onClick={handleAddALevelSubject} sx={{ mb: 2 }}>
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

      {/* Tertiary Education Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Tertiary Education
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
        label="Degree / Diploma"
        variant="outlined"
        value={degreeDiploma}
        onChange={(e) => setDegreeDiploma(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormGroup row sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isFullTime}
              onChange={(e) => setIsFullTime(e.target.checked)}
            />
          }
          label="Full Time"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPartTime}
              onChange={(e) => setIsPartTime(e.target.checked)}
            />
          }
          label="Part Time"
        />
      </FormGroup>

      <TextField
        fullWidth
        label="From"
        variant="outlined"
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="To"
        variant="outlined"
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="Classification"
        variant="outlined"
        value={classification}
        onChange={(e) => setClassification(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleAddTertiaryEducation} sx={{ mb: 2 }}>
        Add Tertiary Education
      </Button>
    </Box>
  );
};

export default StepFive; 