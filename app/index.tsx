import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "@/components";

export default function Index() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <LottieView
          style={styles.logo}
          source={require("../assets/images/splash.json")}
          autoPlay
          loop
          speed={2}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: wp(65), height: wp(65) },
});
