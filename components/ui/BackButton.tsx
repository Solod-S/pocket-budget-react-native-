import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

export const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => router.back()}
    >
      <Ionicons
        name="caret-back-sharp"
        size={verticalScale(iconSize)}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    borderRadius: radius._30,
    padding: 5,
    borderCurve: "continuous",
  },
});
