import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/tabBar/TabBar";

const _layout = () => {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="status" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default _layout;
