import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ModalWrapperProps } from "@/types";
import { colors, spacingY } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const isIos = Platform.OS == "ios";

export const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <SafeAreaView
      // edges={["bottom"]}
      style={[styles.container, { backgroundColor: bg }, style && style]}
    >
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._20 : spacingY._15,
    paddingBottom: isIos ? spacingY._50 : spacingY._15,
  },
});
