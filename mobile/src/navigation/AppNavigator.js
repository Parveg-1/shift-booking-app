import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import AvailableShiftsScreen from '../screens/AvailableShiftsScreen';
import MyShiftsScreen from '../screens/MyShiftsScreen';
import { colors, spacing, typography } from '../theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: typography.badge,
        tabBarItemStyle: {
          paddingVertical: spacing.sm,
        },
      }}
    >
      <Tab.Screen
        name="MyShifts"
        component={MyShiftsScreen}
        options={{
          title: 'My shifts',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AvailableShifts"
        component={AvailableShiftsScreen}
        options={{
          title: 'Available',
          tabBarIcon: ({ color, size }) => <TabBarIcon name="list" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
