import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeminiChat } from './GeminiChat';
import { PlatformSelector } from '../PlatformSelector/PlatformSelector';
import { PlatformVariations } from '../PlatformVariations/PlatformVariations';
import { usePostStore } from '../../store/postStore';
import { useGemini } from '../../hooks/useGemini';
import { Feedback } from '../Feedback/Feedback';

export const PostEditor: React.FC = () => {
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const conversationHistoryRef = useRef<HTMLDivElement>(null);
  
  const { 
    content, 
    setContent, 
    conversationHistory, 
    addToConversation,
    clearAll
  } = usePostStore();
  const { generateContent } = useGemini();

  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = mainContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleContextSubmit = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          const errorMessage = errorData.detail || "Daily API usage limit exceeded. Please try again tomorrow. 🕒";
          setError(errorMessage);
          
          // Add the rate limit error to conversation history
          addToConversation({
            role: 'user',
            content: context
          });
          addToConversation({
            role: 'assistant',
            content: `⚠️ ${errorMessage}`
          });
          
          setIsGenerating(false);
          return;
        }
        throw new Error("Unable to generate content. Please try again later.");
      }

      // Only proceed with content generation if we haven't hit the rate limit
      const generatedPost = await generateContent(context);
      
      // Add to conversation history
      addToConversation({
        role: 'user',
        content: context
      });
      addToConversation({
        role: 'assistant',
        content: generatedPost
      });

      setContent(generatedPost);
      setContext('');
      
      // Scroll to conversation history
      setTimeout(() => {
        conversationHistoryRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      console.error('Error generating post:', error);
      setError("Error generating content. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    // Clear local state except for rate limit errors
    setContext('');
    setIsGenerating(false);
    
    // Only clear localError if it's not a rate limit message
    if (error !== "Daily usage limit exceeded. Service will resume tomorrow.") {
      setError(null);
    }
    
    // Use the clearAll function from the store
    clearAll();
  };

  return (
    <Box 
      ref={mainContainerRef}
      sx={{ 
        width: '95%',
        margin: '0 auto', 
        padding: 3,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3,
          maxWidth: '100%'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          width: '100%'
        }}>
          <Typography variant="h5">
            Create Your Social Media Post
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 2,
              '&:hover': {
                backgroundColor: 'error.dark',
              }
            }}
          >
            Clear All
          </Button>
        </Box>

        {error && (
          <Box sx={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: 2,
            borderRadius: 1,
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span role="img" aria-label="warning">⚠️</span>
            {error}
          </Box>
        )}
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="What would you like to post about?"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-input': {
              whiteSpace: 'pre-wrap'  // Preserve line breaks
            }
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleContextSubmit}
          disabled={!context || isGenerating}
          sx={{ mb: 3 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Post'}
        </Button>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <Box ref={conversationHistoryRef} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conversation History
            </Typography>
            {conversationHistory.map((message, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  maxWidth: '90%',
                  ml: message.role === 'user' ? 'auto' : 0
                }}
              >
                <Typography variant="body2">
                  <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>
                </Typography>
                <Typography
                  variant="body1"
                  component="pre"
                  sx={{ 
                    mt: 1,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    wordBreak: 'break-word',
                    '& p': { mb: 1 },
                    '& ul, & ol': { 
                      pl: 2,
                      mb: 1
                    }
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {content && (
          <>
            <PlatformSelector />
            <PlatformVariations />
            <GeminiChat initialContent={content} onContentUpdate={setContent} />
            <Box sx={{ my: 3, borderTop: '1px solid', borderColor: 'divider' }} />
            <Feedback />
          </>
        )}
      </Paper>
    </Box>
  );
}; 