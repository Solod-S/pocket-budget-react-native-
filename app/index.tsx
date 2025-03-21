import { View, Text, StyleSheet } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

import { ScreenWrapper } from "@/components";

export default function Index() {
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
  logo: { width: "60%", height: "60%" },
});
