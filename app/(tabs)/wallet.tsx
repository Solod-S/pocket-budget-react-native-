import { ScreenWrapper, Typo } from "@/components";
import { Image, StyleSheet, Platform, View, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  return (
    <ScreenWrapper>
      <View>
        <Typo>Wallet</Typo>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
