import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, Divider
} from '@mui/material';
import OptionInput from '../components/OptionInput';
import QuestionCard from '../components/QuestionCard';
import CheckOutlined from '@mui/icons-material/CheckOutlined';

const AddQuestion = ({
  quizTitle,
  setQuizTitle,
  questions,
  setQuestions,
  handleSave,
  quizId,
  linkCopied,
  setLinkCopied
}) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
  const [maxSelectable, setMaxSelectable] = useState('1');
  const [editIndex, setEditIndex] = useState(null);
  const [showLink, setShowLink] = useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const toggleCorrect = (index) => {
    const correctCount = options?.filter((o) => o?.isCorrect)?.length;
    const updated = [...options];
    const max = parseInt(maxSelectable, 10);
    if (!updated[index].isCorrect && correctCount >= max) return;
    updated[index].isCorrect = !updated[index].isCorrect;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    const updated = options?.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const addOrUpdateQuestion = () => {
    const max = parseInt(maxSelectable, 10);
    if (!questionText.trim()) return alert("Question text cannot be empty.");
    if (options?.some((opt) => !opt?.text?.trim())) return alert("All options must have text.");
    if (isNaN(max) || max < 1 || max > options?.length) {
      return alert(`Max selectable must be between 1 and ${options?.length}`);
    }

    const newQ = {
      questionText: questionText.trim(),
      options,
      maxSelectable: max
    };

    if (editIndex !== null) {
      const updated = [...questions];
      updated[editIndex] = newQ;
      setQuestions(updated);
      setEditIndex(null);
    } else {
      setQuestions([...questions, newQ]);
    }

    setQuestionText('');
    setOptions([{ text: '', isCorrect: false }]);
    setMaxSelectable('1');
  };

  const editQuestion = (index) => {
    const q = questions?.[index];
    setQuestionText(q?.questionText ?? '');
    setOptions(q?.options ?? []);
    setMaxSelectable(String(q?.maxSelectable ?? '1'));
    setEditIndex(index);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions?.filter((_, i) => i !== index));
  };

  const handleQuizSave = () => {
    handleSave?.();
    setShowLink(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Quiz Title</Typography>
      <TextField
        fullWidth
        value={quizTitle}
        onChange={(e) => setQuizTitle?.(e?.target?.value)}
        placeholder="Enter Quiz Title"
        sx={{ mb: 2 }}
      />

      <Typography variant="h6">Question</Typography>
      <TextField
        fullWidth
        value={questionText}
        onChange={(e) => setQuestionText(e?.target?.value)}
        placeholder="Type your question"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Max Selectable Options"
        type="number"
        value={maxSelectable}
        onChange={(e) => setMaxSelectable(e?.target?.value)}
        fullWidth
        sx={{ mb: 2 }}
        helperText={`Max: ${options?.length}`}
        inputProps={{ min: 1, max: options?.length }}
      />

      <Typography variant="subtitle1">Options</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {options?.map((option, index) => (
          <OptionInput
            key={index}
            option={option}
            index={index}
            onChange={handleOptionChange}
            onToggle={toggleCorrect}
            onRemove={removeOption}
          />
        ))}
      </Box>

      <Button onClick={addOption} sx={{ my: 2 }}>+ Add Option</Button>
      <Button variant="contained" fullWidth onClick={addOrUpdateQuestion}>
        {editIndex !== null ? 'Update Question' : 'Add Question'}
      </Button>

      {questions?.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Added Questions</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {questions?.map((q, i) => (
              <QuestionCard
                key={i}
                index={i}
                questionData={q}
                onEdit={editQuestion}
                onDelete={deleteQuestion}
              />
            ))}
          </Box>

          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleQuizSave}>
            <CheckOutlined style={{ color: 'green' }} />Save Quiz
          </Button>

          {quizId && showLink && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                border: '1px dashed gray',
                borderRadius: 2,
                overflowWrap: 'break-word'
              }}
            >
              <Typography variant="subtitle1">Quiz Link</Typography>
              <TextField
                fullWidth
                value={`${window.location.origin}/quiz/${quizId}`}
                InputProps={{ readOnly: true }}
                sx={{ my: 1 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  const link = `${window.location.origin}/quiz/${quizId}`;
                  navigator.clipboard.writeText(link)
                    .then(() => {
                      setLinkCopied?.(true);
                      setTimeout(() => setLinkCopied?.(false), 2000);
                    })
                    .catch((err) => {
                      console.error("Clipboard error:", err);
                    });
                }}
              >
                {linkCopied ? (
                  <>
                    <CheckOutlined style={{ color: 'green' }} /> Copied!
                  </>
                ) : (
                  "📋 Copy Link"
                )}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AddQuestion;
