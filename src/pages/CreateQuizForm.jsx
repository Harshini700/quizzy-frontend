import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';

const QuizStartForm = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [quizTitle, setQuizTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleStart = () => {
    if (!name || !email || timeLimit <= 0) {
      alert('Please fill all required fields');
      return;
    }
    localStorage.setItem(
      'quizUser',
      JSON.stringify({ name, email, phone, quizTitle, timeLimit })
    );

    navigate(`/quiz/${quizId}/take`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 700,
        mx: 'auto',
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 }
      }}
    >
      <Box
        sx={{
          bgcolor: '#0284c7',
          color: 'white',
          p: 2,
          mb: 3,
          borderRadius: 2,
          fontSize: { xs: 13, sm: 16 }
        }}
      >
        After creating the quiz, please ensure to set the minimum number of re-attempts allowed,
        as the default setting is zero. Additionally, you can utilize AI quiz instructions.
      </Box>

      <Typography variant="h6" gutterBottom>
        Quiz Title
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>
        Required Fields
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            placeholder="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            placeholder="Phone"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            placeholder="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Time Limit (minutes)
      </Typography>
      <TextField
        type="number"
        fullWidth
        value={timeLimit}
        onChange={(e) => setTimeLimit(Number(e.target.value))}
        error={timeLimit <= 0}
        helperText={timeLimit <= 0 ? 'Time Limit must be greater than zero.' : ''}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth={isMobile}
        variant="contained"
        size="large"
        disabled={timeLimit <= 0}
        onClick={handleStart}
      >
        Create Quiz / Start
      </Button>
    </Paper>
  );
};

export default QuizStartForm;
