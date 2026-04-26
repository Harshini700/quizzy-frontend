import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Button, Checkbox, FormGroup,
  FormControlLabel, useMediaQuery
} from '@mui/material';
import axios from 'axios';
import { Card, Layout, Image as AntImage } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const user = JSON.parse(localStorage.getItem('quizUser'));
  const token = localStorage.getItem('token');
  const isMobile = useMediaQuery('(max-width:768px)');

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const fetchQuizData = async () => {
    try {
      const res = await axios.get(`https://quizzy-backend-7tnf.onrender.com/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(res.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (!submitted && prev > 0) return prev - 1;
        clearInterval(timer);
        if (prev === 1 && !submitted) handleSubmit();
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChange = (qIndex, oIndex) => {
    const question = quiz?.questions?.[qIndex];
    const maxSelectable = question?.maxSelectable || 1;
    let selected = answers[qIndex] || [];

    if (selected.includes(oIndex)) {
      selected = selected.filter(i => i !== oIndex);
    } else if (selected.length < maxSelectable) {
      selected = [...selected, oIndex];
    }

    setAnswers({ ...answers, [qIndex]: selected });
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    let points = 0;
    quiz?.questions?.forEach((q, i) => {
      const selected = answers[i] || [];
      const correctIndexes = q.options
        ?.map((opt, idx) => (opt.isCorrect ? idx : null))
        ?.filter(idx => idx !== null);

      if (
        selected.length === correctIndexes?.length &&
        selected.every(i => correctIndexes?.includes(i))
      ) {
        points += 1;
      }
    });

    setScore(points);
    setSubmitted(true);

    try {
      await axios.post(`https://quizzy-backend-7tnf.onrender.com/api/attempts/${quizId}/submit`, {
        userId: user?._id,
        answers,
        name: user?.name,
        email: user?.email,
        phone: user?.phone || 'N/A',
        title: quiz?.title,
        timeTaken: 1800 - timeLeft,
        questions: quiz?.questions?.map((q, index) => ({
          questionText: q?.questionText || 'Untitled question',
          options: q?.options || [],
          selectedOptions: answers[index] || []
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(1800);
  };

  if (!quiz) return <Typography>Loading quiz...</Typography>;

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const maxSelectable = currentQuestion?.maxSelectable || 1;

  const totalQuestions = quiz?.questions?.length || 1;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80;

  return (
    <Box p={isMobile ? 2 : 4} sx={{ maxWidth: 1200, margin: 'auto', minHeight: '100vh' }}>
      {!submitted ? (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="#0f1a2b" fontWeight="bold">
              {quiz?.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
              }}
            >
              <ClockCircleOutlined style={{ color: '#663399', marginRight: 6 }} />
              <Typography fontWeight="bold">Timer:</Typography>
              <Typography ml={1} color={timeLeft < 60 ? 'red' : '#663399'}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            gap={4}
            p={3}
            border="1px solid #ddd"
            borderRadius={2}
            bgcolor="#f9f9f9"
          >
            <Box flex={1} pr={isMobile ? 0 : 3} borderRight={isMobile ? 'none' : '1px solid #ccc'}>
              <Typography variant="h6" mb={2}>
                Question {currentQuestionIndex + 1} of {quiz?.questions?.length}
              </Typography>
              <Typography fontSize={18} fontWeight="bold">
                {currentQuestion?.questionText}
              </Typography>
              <Typography variant="caption" color="gray" mt={1}>
                (Max Selectable: {maxSelectable})
              </Typography>
            </Box>

            <Box flex={1}>
              <FormGroup>
                {currentQuestion?.options?.map((opt, j) => (
                  <FormControlLabel
                    key={j}
                    control={
                      <Checkbox
                        checked={answers[currentQuestionIndex]?.includes(j) || false}
                        onChange={() => handleChange(currentQuestionIndex, j)}
                        disabled={
                          !answers[currentQuestionIndex]?.includes(j) &&
                          (answers[currentQuestionIndex]?.length || 0) >= maxSelectable
                        }
                      />
                    }
                    label={opt?.text}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Button variant="outlined" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            <Button
              variant="outlined"
              onClick={handleNext}
              disabled={currentQuestionIndex >= totalQuestions - 1}
            >
              Next
            </Button>

            {currentQuestionIndex === totalQuestions - 1 && (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Layout.Content style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          <Card
            style={{
              maxWidth: 400,
              width: '100%',
              borderRadius: 16,
              padding: 24,
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AntImage
              src="/profile.jpg" 
              width={180}
              preview={false}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h5" gutterBottom>
              Thank you for <strong style={{ color: '#663399' }}>attempting</strong> quiz.
            </Typography>
            <Typography variant="body1" gutterBottom>
              You have <strong>{passed ? 'Passed' : 'Failed'}</strong> this test.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your score is <strong>{percentage}%</strong>. And passing score is 80%.
            </Typography>
            <Button
              type="primary"
              style={{ marginTop: 24, backgroundColor: 'black', color: 'white' }}
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </Card>
        </Layout.Content>
      )}
    </Box>
  );
};

export default TakeQuiz;
