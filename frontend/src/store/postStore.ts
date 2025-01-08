import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PostState {
  content: string;
  selectedPlatforms: string[];
  platformVariations: Record<string, string>;
  conversationHistory: Message[];
  error: string | null;
  setContent: (content: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setPlatformVariation: (platform: string, content: string) => void;
  addToConversation: (message: Message) => void;
  clearAll: () => void;
  setError: (error: string | null) => void;
}

export const usePostStore = create<PostState>((set) => ({
  content: '',
  selectedPlatforms: [],
  platformVariations: {},
  conversationHistory: [],
  error: null,
  setContent: (content) => set({ content }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setPlatformVariation: (platform, content) => 
    set((state) => ({
      platformVariations: { ...state.platformVariations, [platform]: content }
    })),
  addToConversation: (message) => 
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message]
    })),
  clearAll: () => set(() => ({
    content: '',
    selectedPlatforms: [],
    platformVariations: {},
    conversationHistory: []
  })),
  setError: (error) => set({ error })
}));
