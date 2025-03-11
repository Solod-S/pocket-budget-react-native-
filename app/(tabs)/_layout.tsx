import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarAccessibilityLabel: colors.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
