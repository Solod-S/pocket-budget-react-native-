import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ModalWrapperProps } from "@/types";
import { colors, spacingY } from "@/constants/theme";

const isIos = Platform.OS == "ios";

export const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <View
      // edges={["top"]}
      style={[
        styles.container,
        { flex: 1, backgroundColor: bg },
        style && style,
      ]}
    >
      <StatusBar style="light" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._15 : spacingY._50,
    paddingBottom: isIos ? spacingY._20 : spacingY._10,
  },
});
