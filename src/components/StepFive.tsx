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
  'Biology',
  'Chemistry',
  'Physics',
  'History',
  'Geography',
  'Literature',
  'Computer Science',
  'Business Studies',
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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: APL254002. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
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
    </Box>
  );
};

export default StepFive; 