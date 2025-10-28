import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ChatScreen from './screens/ChatScreen';
import CalendarScreen from './screens/CalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    console.log('App mounted, navigation container active');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={ "{ headerShown: false }" }
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>