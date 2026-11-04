import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Compass, BookOpen, Sparkles, LayoutDashboard } from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { CourseCatalogScreen } from '../screens/CourseCatalogScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { LessonViewerScreen } from '../screens/LessonViewerScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { MathNotesAIScreen } from '../screens/MathNotesAIScreen';
import { StudentDashboardScreen } from '../screens/StudentDashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthService } from '../shared/services/authService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen
        name="Learn"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CourseCatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MathNotesAI"
        component={MathNotesAIScreen}
        options={{
          tabBarLabel: 'MathNotes AI',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    return authService.onAuthStateChanged(session => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{ title: 'Course Overview' }}
          />
          <Stack.Screen
            name="LessonViewer"
            component={LessonViewerScreen}
            options={{ title: 'Active Lesson' }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ title: 'Concept Quiz' }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: 'Secure Enrollment' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

