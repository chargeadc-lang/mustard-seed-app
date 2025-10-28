import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProgressContext } from '../context/ProgressContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { progress, updateProgress } = useContext(ProgressContext);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('HomeScreen mounted, progress:', progress);
  }, [progress]);

  return (
    <View style={ flex: 1, justifyContent: "center", alignItems: "center" }>
      <Text style={ fontSize: 22, marginBottom: 16 }>
        Your Progress: { '{progress}' }%
      </Text>

      <TouchableOpacity
        onPress={() => {
          updateProgress(progress + 10);
          navigation.navigate("Progress");
        }
        style={
          backgroundColor: "#4caf50",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 6
        }
      >
        <Text style={ color: "#fff", fontSize: 18 }>Go to Progress</Text>
      </TouchableOpacity>
    </View>
  );
}