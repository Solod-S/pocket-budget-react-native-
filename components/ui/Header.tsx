import { Typo } from "@/components/ui/Typo";
import { HeaderProps } from "@/types";
import {  StyleSheet, Platform, View, Text } from "react-native";

export const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{ textAlign: "center", width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", flexDirection: "row" },
  leftIcon: { alignSelf: "flex-start" },
});
