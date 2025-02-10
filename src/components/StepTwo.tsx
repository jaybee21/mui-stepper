import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const StepTwo: React.FC = () => {
  const [title, setTitle] = useState('');
  const [firstNames, setFirstNames] = useState('');
  const [surname, setSurname] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [maidenName, setMaidenName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [dob, setDob] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [nationality, setNationality] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Personal Information
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel></InputLabel>
        <Select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select Title</em>
          </MenuItem>
          <MenuItem value="Mr">Mr</MenuItem>
          <MenuItem value="Mrs">Mrs</MenuItem>
          <MenuItem value="Ms">Ms</MenuItem>
          <MenuItem value="Dr">Dr</MenuItem>
          <MenuItem value="Prof">Prof</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="First Names"
        variant="outlined"
        value={firstNames}
        onChange={(e) => setFirstNames(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Surname"
        variant="outlined"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel></InputLabel>
        <Select
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select Marital Status</em>
          </MenuItem>
          <MenuItem value="Single">Single</MenuItem>
          <MenuItem value="Married">Married</MenuItem>
          <MenuItem value="Divorced">Divorced</MenuItem>
          <MenuItem value="Widowed">Widowed</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Maiden Name or Prior Names (if applicable)"
        variant="outlined"
        value={maidenName}
        onChange={(e) => setMaidenName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="National I.D"
        variant="outlined"
        value={nationalId}
        onChange={(e) => setNationalId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Passport Number"
        variant="outlined"
        value={passportNumber}
        onChange={(e) => setPassportNumber(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Date of Birth (DD/MM/YYYY)"
        variant="outlined"
        type="text"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Place of Birth"
        variant="outlined"
        value={placeOfBirth}
        onChange={(e) => setPlaceOfBirth(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel></InputLabel>
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select Gender</em>
          </MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Citizenship (Specify Country)"
        variant="outlined"
        value={citizenship}
        onChange={(e) => setCitizenship(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Nationality (Specify Country)"
        variant="outlined"
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Residential Address"
        variant="outlined"
        value={residentialAddress}
        onChange={(e) => setResidentialAddress(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="City"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Country"
        variant="outlined"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Postal Address (if Different from Residential Address)"
        variant="outlined"
        value={postalAddress}
        onChange={(e) => setPostalAddress(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Phone"
        variant="outlined"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="E-mail"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default StepTwo; 