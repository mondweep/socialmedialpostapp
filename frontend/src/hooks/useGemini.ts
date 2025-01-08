import { useState } from 'react';

export const useGemini = () => {
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (context: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: context })
      });
      const data = await response.json();
      return data.generated_content;
    } catch (error) {
      setError('Error generating content');
      throw error;
    }
  };

  const refineContent = async (currentContent: string, refinementPrompt: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentContent,
          instruction: refinementPrompt
        })
      });
      const data = await response.json();
      return data.refined_content;
    } catch (error) {
      setError('Error refining content');
      throw error;
    }
  };

  return {
    generateContent,
    refineContent,
    error
  };
};
