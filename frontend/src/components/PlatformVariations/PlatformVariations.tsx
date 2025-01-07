import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { usePostStore } from '../../store/postStore';

// Platform-specific emoji mapping
const platformEmojis: Record<string, string> = {
  linkedin: '💼',
  facebook: '👥',
  threads: '🧵',
  x: '🐦',
  truth: '📢',
  bluetick: '✅'
};

export const PlatformVariations: React.FC = () => {
  const { selectedPlatforms, platformVariations } = usePostStore();

  const formatContent = (content: string) => {
    // Format hashtags
    let formattedContent = content.replace(/#(\w+)/g, '<strong>#$1</strong>');
    
    // Format bold text between **
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format italics between _
    formattedContent = formattedContent.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Format URLs
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return formattedContent;
  };

  return (
    <Box sx={{ mt: 3 }}>
      {selectedPlatforms.map((platformId) => (
        <Paper 
          key={platformId} 
          sx={{ 
            p: 3, 
            mb: 2,
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'primary.main'
          }}>
            {platformEmojis[platformId]} {platformId.charAt(0).toUpperCase() + platformId.slice(1)} Version:
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{
              __html: platformVariations[platformId] 
                ? formatContent(platformVariations[platformId])
                : '⏳ Content being generated...'
            }}
            sx={{
              lineHeight: 1.6,
              '& strong': { fontWeight: 'bold', color: 'primary.main' },
              '& em': { fontStyle: 'italic' },
              '& a': { color: 'primary.main', textDecoration: 'none' }
            }}
          />
        </Paper>
      ))}
    </Box>
  );
};
