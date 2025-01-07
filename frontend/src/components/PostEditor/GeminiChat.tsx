import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { usePostStore } from '../../store/postStore';
import { useGemini } from '../../hooks/useGemini';

interface GeminiChatProps {
  initialContent: string;
  onContentUpdate: (content: string) => void;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ 
  initialContent, 
  onContentUpdate 
}) => {
  const [feedback, setFeedback] = useState('');
  const { isGenerating, setIsGenerating } = usePostStore();
  const { refineContent, error } = useGemini();

  const handleRefine = async () => {
    setIsGenerating(true);
    try {
      const refinedContent = await refineContent(initialContent, feedback);
      onContentUpdate(refinedContent);
      setFeedback('');
    } catch (error) {
      console.error('Error refining content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Refine Your Post
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Current Version:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {initialContent}
        </Paper>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="How would you like to improve this?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleRefine}
        disabled={!feedback || isGenerating}
      >
        {isGenerating ? 'Refining...' : 'Refine with AI'}
      </Button>
    </Paper>
  );
}; 