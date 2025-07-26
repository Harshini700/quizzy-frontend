import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Divider,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AddQuestionModal = ({ onAddQuestion, initialQuestionData = null }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [maxSelectableOptions, setMaxSelectableOptions] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 const initializeQuestionData = (initialQuestionData, setQuestionText, setOptions, setMaxSelectableOptions) => {
  if (initialQuestionData) {
    setQuestionText(initialQuestionData?.questionText || '');
    setOptions(
      initialQuestionData?.options?.length
        ? initialQuestionData.options.map((opt, index) => ({
            id: opt?._id || `option-${index}`,
            text: opt?.text || '',
            isCorrect: opt?.isCorrect || false,
          }))
        : [
            { id: 'option-0', text: '', isCorrect: false },
            { id: 'option-1', text: '', isCorrect: false },
          ]
    );

    setMaxSelectableOptions(initialQuestionData?.maxSelectableOptions || 1);
  } else {
    setQuestionText('');
    setOptions([
      { id: 'option-0', text: '', isCorrect: false },
      { id: 'option-1', text: '', isCorrect: false },
    ]);
    setMaxSelectableOptions(1);
  }
};
useEffect(() => {
  initializeQuestionData(initialQuestionData, setQuestionText, setOptions, setMaxSelectableOptions);
}, [initialQuestionData]);
  const handleAddOption = () => {
    setOptions([...options, { id: `option-${options.length}`, text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (idToRemove) => {
    const updated = options.filter((o) => o.id !== idToRemove);
    setOptions(updated.map((opt, index) => ({ ...opt, id: `option-${index}` })));
  };

  const handleOptionTextChange = (id, newText) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt)));
  };

  const handleCorrectToggle = (id) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)));
  };

  const handleSubmit = () => {
    const finalOptions = options
      .filter((opt) => opt?.text?.trim() !== '')
      .map((opt) => ({
        text: opt?.text,
        isCorrect: opt?.isCorrect,
        ...(initialQuestionData?.options?.find((o) => o._id === opt.id) && { _id: opt.id }),
      }));

    const newQuestion = {
      questionText: questionText.trim(),
      questionType: 'Multiple Choice',
      options: finalOptions,
      maxSelectableOptions,
    };

    onAddQuestion?.(newQuestion);
  };

  return (
    <Box
      sx={{
        padding: 2,
        background: '#f5f5f5',
        minHeight: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1 : 3,
          width: '100%',
          maxWidth: 1000,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 4,
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Question</Typography>
          <Paper elevation={1} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 4 : 6}
              placeholder="Type your question here"
              variant="outlined"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
            />
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Sans Serif | Normal | Normal | A
              </Typography>
              <Box>
                <IconButton size="small">
                  <Typography fontWeight="bold">B</Typography>
                </IconButton>
                <IconButton size="small">
                  <Typography fontStyle="italic">I</Typography>
                </IconButton>
                <IconButton size="small">
                  <Typography sx={{ textDecoration: 'underline' }}>U</Typography>
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options?.map((option, index) => (
            <Box key={option.id} sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Option {index + 1}</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={() => handleCorrectToggle(option.id)}
                    />
                  }
                  label="Correct"
                />
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}

          <Button variant="outlined" onClick={handleAddOption}>
            Add Option
          </Button>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Max Selectable Options
            </Typography>
            <TextField
              type="number"
              inputProps={{ min: 1, max: options.length || 1 }}
              value={maxSelectableOptions}
              onChange={(e) =>
                setMaxSelectableOptions(Math.max(1, parseInt(e.target.value) || 1))
              }
              sx={{ width: 100 }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {initialQuestionData ? 'Update Question' : 'Add Question'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddQuestionModal;
