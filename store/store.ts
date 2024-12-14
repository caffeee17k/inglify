import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { WordResponse } from '~/models/WordResponse';

export interface StoreState {
  recentWords: WordResponse[];
  addWord: (word: WordResponse) => void;
  favoriteWords: WordResponse[];
  toggleFavoriteWord: (word: WordResponse) => void;
}

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<StoreState & AuthState>()(
  persist(
    (set) => ({
      recentWords: [],
      addWord: (word: WordResponse) =>
        set((state) => {
          const isWordExist = state.recentWords.some((cachedWord) => cachedWord.word === word.word);

          if (!isWordExist) {
            const updatedWords = [...state.recentWords, word];

            if (updatedWords.length > 12) {
              updatedWords.shift();
            }
            return { recentWords: updatedWords };
          }
          return state;
        }),
      favoriteWords: [],
      toggleFavoriteWord: (word: WordResponse) =>
        set((state) => {
          const isWordExist = state.favoriteWords.some(
            (favoriteWord) => favoriteWord.word === word.word
          );

          if (isWordExist) {
            const updatedFavorites = state.favoriteWords.filter(
              (favoriteWord) => favoriteWord.word !== word.word
            );
            return { favoriteWords: updatedFavorites };
          }

          return { favoriteWords: [...state.favoriteWords, word] };
        }),
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
