import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { Text } from "react-native";
import { Typo } from "@/components";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral900,
        },
        tabBarLabelStyle: {
          color: colors.text, // цвет текста для неактивных вкладок
        },
        tabBarActiveTintColor: colors.primary, // Активная иконка
        tabBarInactiveTintColor: colors.textLighter, // Неактивная иконка
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: ({ focused }) => (
            <Typo
              size={12}
              style={{ color: focused ? colors.primary : colors.text }}
            >
              Home
            </Typo>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarLabel: ({ focused }) => (
            <Typo
              size={12}
              style={{ color: focused ? colors.primary : colors.text }}
            >
              Wallet
            </Typo>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
