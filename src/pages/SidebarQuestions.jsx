import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  List,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  ListItemText,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import AddQuestionModal from './AddQuestionModal';

const SidebarQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('https://quizzy-backend-7tnf.onrender.com/api/questions/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, [token]);

  const handleDeleteQuestion = async (id) => {
    try {
        setQuestions(questions.filter(q => q._id !== id));
        console.log(`Question with ID ${id} deleted locally.`);
    } catch (error) {
        console.error('Failed to delete question:', error);
    }
  };

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find(q => q._id === id);
    if (questionToEdit) {
      setEditingQuestion(questionToEdit);
      setOpenAddQuestionModal(true);
    }
  };

  const handleOpenAddQuestionModal = () => {
    setEditingQuestion(null);
    setOpenAddQuestionModal(true);
  };

  const handleCloseAddQuestionModal = () => {
    setOpenAddQuestionModal(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = (questionData) => {
    console.log("Question data to save/update:", questionData);

    if (editingQuestion) {
      setQuestions(questions.map(q => q._id === editingQuestion._id ? { ...q, ...questionData } : q));
      console.log('Question updated!');
    } else {
      setQuestions(prevQuestions => [...prevQuestions, {
          _id: `temp-${Date.now()}`,
          quizTitle: 'Unassigned',
          ...questionData
      }]);
      console.log('New question added!');
    }
    handleCloseAddQuestionModal();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setQuestions(items);
  };

  return (
    <Box
      sx={{
        padding: 3,
        background: '#e3f2fd',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1a237e' }}>
        Your Questions
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginBottom: 2 }}>
        <Button
          variant="contained"
          onClick={handleOpenAddQuestionModal}
          sx={{ textTransform: 'none', backgroundColor: '#90CAF9', '&:hover': { backgroundColor: '#64B5F6' } }}
        >
          Add Questions
        </Button>
        <Button variant="outlined" sx={{ textTransform: 'none', borderColor: '#90CAF9', color: '#1a237e', '&:hover': { backgroundColor: '#E3F2FD' } }}>
          See All Questions
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                marginTop: 2,
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
              }}
            >
              {questions.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      elevation={1}
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        borderLeft: '5px solid #1976d2',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                        Question: {index + 1}
                      </Typography>
                      <ListItemText
                        primary={item.questionText}
                        secondary={item.quizTitle ? `(${item.quizTitle})` : ''}
                        sx={{ marginBottom: 1 }}
                      />
                      <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditQuestion(item._id)}
                          sx={{ textTransform: 'none', color: '#424242', borderColor: '#bdbdbd' }}
                        >
                          Options
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteQuestion(item._id)}
                          sx={{ textTransform: 'none', color: '#f44336', borderColor: '#ef9a9a' }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog
        open={openAddQuestionModal}
        onClose={handleCloseAddQuestionModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
          <IconButton
            aria-label="close"
            onClick={handleCloseAddQuestionModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AddQuestionModal
            onAddQuestion={handleSaveQuestion}
            initialQuestionData={editingQuestion}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SidebarQuestions;