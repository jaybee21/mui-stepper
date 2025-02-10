import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormGroup,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Experience {
  organization: string;
  position: string;
  from: string;
  to: string;
  duties: string;
}

const StepSix: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [duties, setDuties] = useState('');

  const handleAddExperience = () => {
    if (organization && position && from && to && duties) {
      setExperiences([...experiences, { organization, position, from, to, duties }]);
      setOrganization('');
      setPosition('');
      setFrom('');
      setTo('');
      setDuties('');
    }
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        NOTE: This is your Reference Number: APL254002. Keep it safe. You will be required to use it in the next session if you do not complete your application now.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Add Your Work Experience:
      </Typography>

      <TextField
        fullWidth
        label="Name of Organisation"
        variant="outlined"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Position"
        variant="outlined"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="From"
        variant="outlined"
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
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
        value={to}
        onChange={(e) => setTo(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="Duties"
        variant="outlined"
        value={duties}
        onChange={(e) => setDuties(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleAddExperience} sx={{ mb: 2 }}>
        Add Experience
      </Button>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Added Experiences:
      </Typography>
      {experiences.map((exp, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="body2"><strong>Organisation:</strong> {exp.organization}</Typography>
          <Typography variant="body2"><strong>Position:</strong> {exp.position}</Typography>
          <Typography variant="body2"><strong>From:</strong> {exp.from}</Typography>
          <Typography variant="body2"><strong>To:</strong> {exp.to}</Typography>
          <Typography variant="body2"><strong>Duties:</strong> {exp.duties}</Typography>
          <IconButton onClick={() => handleRemoveExperience(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default StepSix; 