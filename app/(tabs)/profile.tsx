import { ScreenWrapper, Typo } from "@/components";
import { StyleSheet, View, Text } from "react-native";

export default function Profile() {
  return (
    <ScreenWrapper>
      <View>
        <Typo>Profile</Typo>
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
