import React from 'react';
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const QuestionCard = ({ questionData, index, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fafafa',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', minWidth: '40px' }}
          >
            Q{index + 1}.
          </Typography>
          <Typography variant="subtitle1">
            {questionData?.questionText || 'Untitled'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => onEdit?.(index)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete?.(index)} color="error">
            <Delete />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mt: 2,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {questionData?.options?.map((opt, i) => (
          <Box
            key={i}
            sx={{
              border: opt?.isCorrect ? '2px solid green' : '1px solid gray',
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: opt?.isCorrect ? '#e0ffe0' : '#f9f9f9',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            {opt?.text || 'Untitled option'}
          </Box>
        ))}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: 'block' }}
      >
        Max Selectable: {questionData?.maxSelectable ?? 'N/A'}
      </Typography>
    </Box>
  );
};

export default QuestionCard;
