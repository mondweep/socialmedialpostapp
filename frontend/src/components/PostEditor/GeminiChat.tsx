import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
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
  const [isRefining, setIsRefining] = useState(false);
  const { addToConversation } = usePostStore();
  const { refineContent } = useGemini();

  const handleRefine = async () => {
    if (!feedback) return;
    
    setIsRefining(true);
    try {
      addToConversation({
        role: 'user',
        content: feedback
      });

      const refinedContent = await refineContent(initialContent, feedback);
      
      addToConversation({
        role: 'assistant',
        content: refinedContent
      });

      onContentUpdate(refinedContent);
      setFeedback('');
    } catch (error) {
      console.error('Error refining content:', error);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Refine Your Post
      </Typography>

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
        disabled={!feedback || isRefining}
      >
        {isRefining ? 'Refining...' : 'Refine with AI'}
      </Button>
    </Box>
  );
}; 