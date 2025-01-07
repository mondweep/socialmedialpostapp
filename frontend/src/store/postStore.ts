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
  setContent: (content: string) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setPlatformVariation: (platform: string, content: string) => void;
  addToConversation: (message: Message) => void;
}

export const usePostStore = create<PostState>((set) => ({
  content: '',
  selectedPlatforms: [],
  platformVariations: {},
  conversationHistory: [],
  setContent: (content) => {
    set((state) => ({
      content,
      conversationHistory: [
        ...state.conversationHistory,
        { role: 'user', content }
      ]
    }));
  },
  setPlatformVariation: (platform, content) => {
    set((state) => ({
      platformVariations: {
        ...state.platformVariations,
        [platform]: content
      }
    }));
  },
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  addToConversation: (message) => {
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message]
    }));
  }
}));
