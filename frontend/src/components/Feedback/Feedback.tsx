import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SendIcon from '@mui/icons-material/Send';

export const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    try {
      const feedbackData = {
        rating,
        comment,
        timestamp: new Date().toISOString()
      };
      
      console.log('Preparing to send feedback:', feedbackData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'X-Request-ID': crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)
        },
        body: JSON.stringify(feedbackData),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit feedback');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      setShowSuccess(true);
      setRating(null);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.'); // Show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        mt: 4, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FeedbackIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Help Us Improve
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your feedback helps us make this tool better. How was your experience?
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Rating
          value={rating}
          onChange={(_, value) => setRating(value)}
          size="large"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary" display="block">
          {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
        </Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="What features would you like to see? Any suggestions for improvement?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={!rating || isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </Button>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Paper>
  );
};
