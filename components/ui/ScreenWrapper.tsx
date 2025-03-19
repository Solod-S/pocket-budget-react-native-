import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export const ScreenWrapper = ({
  style,
  children,
  edges = [],
}: ScreenWrapperProps) => {
  return (
    <SafeAreaView
      edges={["top", ...edges]}
      style={[{ flex: 1, backgroundColor: colors.neutral900 }, style]}
    >
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
};
