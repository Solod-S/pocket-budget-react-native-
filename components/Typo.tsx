import { StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { verticalScale } from "@/utils/styling";

export const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});
