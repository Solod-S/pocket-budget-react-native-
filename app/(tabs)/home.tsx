import { Button, ScreenWrapper, Typo } from "@/components";
import { colors } from "@/constants/theme";

import { StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <ScreenWrapper>
      <View style={styles.titleContainer}></View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 8,
  },
});
