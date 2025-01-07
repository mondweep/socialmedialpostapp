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
  { id: 'bluetick', name: 'BlueTick', characterLimit: 280 }
];

export const PlatformSelector: React.FC = () => {
  const { selectedPlatforms, setSelectedPlatforms, content, setPlatformVariation } = usePostStore();

  const handlePlatformChange = async (platformId: string) => {
    const isSelected = selectedPlatforms.includes(platformId);
    
    if (!isSelected) {
      try {
        // Call backend formatting endpoint when platform is selected
        const response = await fetch(`http://localhost:8000/api/format/${platformId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        // Update store with formatted content
        // Note: You'll need to add this to your store
        setPlatformVariation(platformId, data.formatted_content);
      } catch (error) {
        console.error(`Error formatting for ${platformId}:`, error);
      }
    }

    setSelectedPlatforms(
      isSelected
        ? selectedPlatforms.filter((id: string) => id !== platformId)
        : [...selectedPlatforms, platformId]
    );
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
    </Box>
  );
};