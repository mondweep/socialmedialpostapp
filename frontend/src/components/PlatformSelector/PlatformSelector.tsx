import React from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { usePostStore } from '../../store/postStore';

interface Platform {
  id: string;
  name: string;
  characterLimit: number;
}

const platforms: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', characterLimit: 3000 },
  { id: 'facebook', name: 'Facebook', characterLimit: 63206 },
  { id: 'threads', name: 'Threads', characterLimit: 500 },
  { id: 'x', name: 'X', characterLimit: 280 },
  { id: 'truth', name: 'Truth Social', characterLimit: 500 },
  { id: 'bluesky', name: 'Bluesky', characterLimit: 300 }
];

export const PlatformSelector: React.FC = () => {
  const { selectedPlatforms, setSelectedPlatforms, content, setPlatformVariation, setError, error } = usePostStore();

  const handlePlatformChange = async (platform: string) => {
    const isSelected = selectedPlatforms.includes(platform);
    
    // Update selection state
    setSelectedPlatforms(
      isSelected 
        ? selectedPlatforms.filter(id => id !== platform)
        : [...selectedPlatforms, platform]
    );

    // Only format content when selecting a new platform
    if (!isSelected && content) {
      try {
        const response = await fetch(`/api/format/${platform}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: content }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            setError("Daily usage limit exceeded. The service will resume tomorrow.");
            return;
          }
          throw new Error('Failed to format content');
        }

        const data = await response.json();
        setPlatformVariation(platform, data.formatted_content);
        setError(null);
      } catch (error) {
        console.error('Error formatting for platform:', error);
        setError('Error formatting content. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Platforms
      </Typography>
      {platforms.map((platform) => (
        <FormControlLabel
          key={platform.id}
          control={
            <Checkbox
              checked={selectedPlatforms.includes(platform.id)}
              onChange={() => handlePlatformChange(platform.id)}
            />
          }
          label={`${platform.name} (${platform.characterLimit} chars)`}
        />
      ))}
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span role="img" aria-label="warning">⚠️</span>
          {error}
        </div>
      )}
    </Box>
  );
};