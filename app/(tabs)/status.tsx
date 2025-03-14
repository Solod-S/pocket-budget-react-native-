import { ScreenWrapper, Typo } from "@/components";
import { StyleSheet, View } from "react-native";

export default function Status() {
  return (
    <ScreenWrapper>
      <View>
        <Typo>Status</Typo>
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
