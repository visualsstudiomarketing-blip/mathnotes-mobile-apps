import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutGrid, Layers, GraduationCap, MessageSquare, User, TrendingUp } from 'lucide-react-native';

import { TeacherDashboardScreen } from '../screens/TeacherDashboardScreen';
import { MyCoursesScreen } from '../screens/MyCoursesScreen';
import { CreateCourseScreen } from '../screens/CreateCourseScreen';
import { StudentAnalyticsScreen } from '../screens/StudentAnalyticsScreen';
import { TeachersAIScreen } from '../screens/TeachersAIScreen';
import { ExamStudioScreen } from '../screens/ExamStudioScreen';
import { QNAInboxScreen } from '../screens/QNAInboxScreen';
import { TeacherProfileScreen } from '../screens/TeacherProfileScreen';
import { TeacherLoginScreen } from '../screens/TeacherLoginScreen';
import { AuthService } from '../shared/services/authService';
import { FloatingGlassTabBar } from '../shared/components/glass';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TeacherTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingGlassTabBar {...props} activeAccentColor="#10B981" />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TeacherDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Courses"
        component={MyCoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TeachersAI"
        component={TeachersAIScreen}
        options={{
          tabBarLabel: 'Teachers AI',
          tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Doubts"
        component={QNAInboxScreen}
        options={{
          tabBarLabel: 'Q&A',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={StudentAnalyticsScreen}
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={TeacherProfileScreen}
        options={{
          tabBarLabel: 'Portal',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function TeacherNavigator() {
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
        headerStyle: { backgroundColor: '#090D16' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="TeacherLogin"
          component={TeacherLoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="TeacherTabs"
            component={TeacherTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateCourse"
            component={CreateCourseScreen}
            options={{ title: 'Course Builder' }}
          />
          <Stack.Screen
            name="ExamStudio"
            component={ExamStudioScreen}
            options={{ title: 'AI Exam Paper Studio' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

