// context/progressContext.js
// Central data hub that connects Chat, Progress, and Calendar

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const ProgressContext = createContext();

// Custom hook for easy access
export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState({
    streak: 0,
    lastUpdated: null,
    entries: {}, // daily logs { 'YYYY-MM-DD': 'Gym done' }
  });

  // Load existing data from storage on app start
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProgressData');
      if (stored) setProgressData(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const saveProgress = async (updated) => {
    try {
      await AsyncStorage.setItem('userProgressData', JSON.stringify(updated));
      setProgressData(updated);
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  };

  // Log new progress (from Chat or manual entry)
  const logProgress = async (date, message) => {
    const updated = { ...progressData };
    updated.entries[date] = message;

    // Update streak
    updated.lastUpdated = date;
    updated.streak = calculateStreak(updated.entries);

    await saveProgress(updated);
  };

  const calculateStreak = (entries) => {
    // Simple streak: consecutive days logged
    const dates = Object.keys(entries).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 1;
    let prev = new Date(dates[0]);
    for (let i = 1; i < dates.length; i++) {
      const current = new Date(dates[i]);
      const diff = (prev - current) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
      prev = current;
    }
    return streak;
  };

  return (
    <ProgressContext.Provider
      value={{
        progressData,
        logProgress,
        saveProgress,
        loadProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
