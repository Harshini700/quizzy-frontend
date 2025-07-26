import React from 'react';
import {
  Checkbox,
  TextField,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const OptionInput = ({ option, index, onChange, onToggle, onRemove }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Checkbox
          checked={option?.isCorrect}
          onChange={() => onToggle(index)}
          color="success"
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        />
        <TextField
          value={option?.text}
          onChange={(e) => onChange(index, e?.target?.value)}
          placeholder={`Option ${index + 1}`}
          fullWidth
        />
        <IconButton
          onClick={() => onRemove(index)}
          color="error"
          sx={{
            alignSelf: { xs: 'flex-start', sm: 'center' },
            mt: { xs: 1, sm: 0 },
          }}
        >
          <Delete />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default OptionInput;
