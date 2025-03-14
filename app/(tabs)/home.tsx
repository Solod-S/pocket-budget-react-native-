import { Button, ScreenWrapper, Typo } from "@/components";
import { colors } from "@/constants/theme";
import authStore from "@/store/authStore";
import { StyleSheet, View } from "react-native";

export default function Home() {
  const { logout } = authStore;
  const handleLogOut = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.log("error in logout:", error?.message);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.titleContainer}>
        <Button onPress={() => handleLogOut()}>
          <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
            Logout
          </Typo>
        </Button>
      </View>
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
