import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, Chip, useMediaQuery, useTheme
} from '@mui/material';
import axios from 'axios';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const QuizAttempts = () => {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const token = localStorage.getItem('token');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchAttempts();
  }, [quizId]);

  const fetchAttempts = async () => {
    try {
      const res = await axios.get(
        `https://quizzy-backend-7tnf.onrender.com/api/attempts/${quizId}/attempts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAttempts(res.data);
    } catch (err) {
      console.error('Error fetching attempts:', err);
    }
  };

  const handleView = (attempt) => {
    setSelectedAttempt(attempt);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attempt?')) {
      try {
        await axios.delete(
          `https://quizzy-backend-7tnf.onrender.com//api/attempts/${quizId}/attempts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchAttempts();
      } catch (err) {
        console.error('Error deleting attempt:', err);
      }
    }
  };

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h5" mb={2}>
        Attempts Report
      </Typography>

      <Paper sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Attempted At</strong></TableCell>
                <TableCell><strong>Score (%)</strong></TableCell>
                <TableCell><strong>Time Taken</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts?.map((a, i) => (
                <TableRow key={a?._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{a?.name || ''}</TableCell>
                  <TableCell>{a?.phone || 'N/A'}</TableCell>
                  <TableCell>{a?.email || ''}</TableCell>
                  <TableCell>
                    {new Date(a?.submittedAt)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {Math.round((a?.score / (a?.totalQuestions || 1)) * 100)}%
                  </TableCell>
                  <TableCell>{formatTime(a?.timeTaken || 0)}</TableCell>
                  <TableCell>
                    <Chip
                      label={a?.status || ''}
                      color={a?.status === 'Pass' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleView(a)} size="small" sx={{ color: 'black' }}>
                      <VisibilityIcon />
                    </Button>
                    <Button onClick={() => handleDelete(a?._id)} size="small" sx={{ color: 'black' }}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attempt Details</DialogTitle>
        <DialogContent dividers>
          {selectedAttempt && (
            <Box>
              <Typography><strong>Name:</strong> {selectedAttempt?.name}</Typography>
              <Typography><strong>Phone:</strong> {selectedAttempt?.phone || 'N/A'}</Typography>
              <Typography><strong>Email:</strong> {selectedAttempt?.email}</Typography>
              <Typography>
                <strong>Score:</strong>{' '}
                {Math.round((selectedAttempt?.score / (selectedAttempt?.totalQuestions || 1)) * 100)}%
              </Typography>
              <Typography>
                <strong>Time Taken:</strong> {formatTime(selectedAttempt?.timeTaken || 0)}
              </Typography>
              <Typography><strong>Status:</strong> {selectedAttempt?.status}</Typography>
              <Typography>
                <strong>Submitted:</strong>{' '}
                {new Date(selectedAttempt?.submittedAt)?.toLocaleString()}
              </Typography>

              <List sx={{ mt: 2 }}>
                {selectedAttempt?.questions?.map((q, index) => (
                  <ListItem key={index} alignItems="flex-start" disableGutters>
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>
                        {index + 1}. {q?.questionText}
                      </Typography>
                      <Box>
                        {q?.options?.map((opt, i) => {
                          const isCorrect = opt?.isCorrect;
                          const isSelected = q?.selectedOptions?.includes(i);
                          return (
                            <Box
                              key={i}
                              sx={{
                                backgroundColor: isSelected
                                  ? isCorrect
                                    ? '#d4edda'
                                    : '#f8d7da'
                                  : isCorrect
                                  ? '#cce5ff'
                                  : 'transparent',
                                padding: '5px 10px',
                                mb: '4px',
                                borderRadius: '6px'
                              }}
                            >
                              {opt?.text}
                              {isCorrect && (
                                <>
                                  {' '}
                                  <CheckOutlined style={{ color: 'green' }} />
                                </>
                              )}
                              {isSelected && !isCorrect && (
                                <>
                                {''}
                                <CloseOutlined style={{color:'red'}}/>
                                </>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizAttempts;
