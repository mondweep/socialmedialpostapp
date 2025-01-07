import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface UseGeminiReturn {
  generateContent: (context: string) => Promise<string>;
  refineContent: (content: string, feedback: string) => Promise<string>;
  error: string | null;
  isLoading: boolean;
}

export const useGemini = (): UseGeminiReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = async (context: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Create a social media post about: ${context}. 
                     Make it engaging and professional.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refineContent = async (content: string, feedback: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Refine this social media post: "${content}" 
                     Based on this feedback: "${feedback}"
                     Keep it engaging and professional.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refine content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateContent, refineContent, error, isLoading };
};
