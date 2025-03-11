import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ScreenWrapper, Typo } from "@/components";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import LottieView from "lottie-react-native";

export default function Welcome() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Login btn & img */}
        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>
          <View style={styles.container}>
            <LottieView
              style={styles.welcomeImage}
              source={require("../../assets/images/welcome.json")}
              autoPlay
              loop
              speed={2}
            />
          </View>
        </View>
        {/* Footer */}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
