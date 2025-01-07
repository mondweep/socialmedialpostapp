import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { GeminiChat } from './GeminiChat';
import { PlatformSelector } from '../PlatformSelector/PlatformSelector';
import { PlatformVariations } from '../PlatformVariations/PlatformVariations';
import { usePostStore } from '../../store/postStore';
import { useGemini } from '../../hooks/useGemini';

export const PostEditor: React.FC = () => {
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { content, setContent, addToConversation } = usePostStore();
  const { generateContent, error } = useGemini();

  const handleContextSubmit = async () => {
    setIsGenerating(true);
    try {
      const generatedPost = await generateContent(context);
      setContent(generatedPost);
      
      addToConversation({
        role: 'user',
        content: context
      });
      addToConversation({
        role: 'assistant',
        content: generatedPost
      });
    } catch (error) {
      console.error('Error generating post:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="h5" gutterBottom>
          Create Your Social Media Post
        </Typography>
        
        {/* Context Input */}
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="What would you like to post about?"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          onClick={handleContextSubmit}
          disabled={!context || isGenerating}
          sx={{ mb: 3 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Post'}
        </Button>

        {/* Generated Content Area */}
        {content && (
          <GeminiChat 
            initialContent={content}
            onContentUpdate={setContent}
          />
        )}

        {/* Platform Selection */}
        {content && (
          <>
            <PlatformSelector />
            <PlatformVariations />
          </>
        )}
      </Paper>
    </Box>
  );
}; 