import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  Paper,
  Link,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import AddQuestion from '../pages/AddQuestion';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizId, setQuizId] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const token = localStorage.getItem('token');

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/quizzes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizList(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let res;
      let newQuizId;

      if (editMode && editId) {
        res = await axios.put(
          `http://localhost:5000/api/quizzes/${editId}`,
          { title: quizTitle, questions },
          config
        );
        newQuizId = editId;
      } else {
        res = await axios.post(
          'http://localhost:5000/api/quizzes',
          { title: quizTitle, questions },
          config
        );
        newQuizId = res.data._id || res.data.quiz?._id;
      }

      setQuizId(newQuizId);
      const link = `${window.location.origin}/quiz/${newQuizId}`;
      navigator.clipboard.writeText(link)
        .then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard error:", err);
        });

      fetchQuizzes();
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Quiz save error:', error);
    }
  };

  const handleEdit = (quiz) => {
    setQuizTitle(quiz?.title);
    setQuestions(quiz?.questions);
    setEditMode(true);
    setEditId(quiz?._id);
    setQuizId(quiz?._id);
    setOpen(true);
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     fetchQuizzes();
  //   } catch (err) {
  //     console.error(' Delete error:', err);
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
    setQuizTitle('');
    setQuestions([]);
    setEditMode(false);
    setEditId(null);
    setQuizId('');
    setLinkCopied(false);
  };

  const filteredQuizzes = quizList?.filter((quiz) =>
    quiz?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          background: 'linear-gradient(to right, #0284c7, #0ea5e9)',
          color: 'white',
          mb: 3,
        }}
      >
        <Typography variant="h6">All Quizzes</Typography>
        <Typography variant="body2">
          List of all the quizzes you have created. Manage, edit and analyze results of your quizzes through their separate dashboards.
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Create Quiz
        </Button>
      </Box>
      <TextField
        placeholder="Search"
        fullWidth
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e?.target?.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
       <Box sx={{ overflowX: 'auto' }}>
        <Table
          sx={{
            minWidth: 650,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
          }}
        >
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{fontWeight:"bold",fontSize:"16px"}}>#</TableCell>
              <TableCell sx={{fontWeight:"bold",fontSize:"16px"}}>Quiz</TableCell>
              <TableCell sx={{fontWeight:"bold",fontSize:"16px"}}>Questions</TableCell>
              <TableCell sx={{fontWeight:"bold",fontSize:"16px"}}>Created At</TableCell>
              <TableCell sx={{fontWeight:"bold",fontSize:"16px"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuizzes?.map((quiz, index) => (
              <TableRow key={quiz?._id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/quiz/${quiz._id}`}
                    underline="hover"
                    color="primary"
                  >
                    {quiz.title}
                  </Link>
                </TableCell>
                <TableCell>{quiz?.questions?.length}</TableCell>
                <TableCell>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href="#" onClick={() => handleEdit(quiz)} sx={{ mr: 2 }}>
                    Detail
                  </Link>
                  <Link
                    component={RouterLink}
                    to={`/quiz/${quiz._id}/attempts`}
                    color="primary"
                  >
                    Attempts
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <AddQuestion
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
            questions={questions}
            setQuestions={setQuestions}
            handleSave={handleSave}
            quizId={quizId}
            linkCopied={linkCopied}
            setLinkCopied={setLinkCopied}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
