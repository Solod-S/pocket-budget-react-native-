import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button, ScreenWrapper, Typo } from "@/components";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import LottieView from "lottie-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Login btn & img */}
        <View>
          <Animated.View entering={FadeIn.duration(1000)}>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={styles.loginButton}
            >
              <Typo fontWeight={"500"}>Sign in</Typo>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={FadeIn.duration(1000)}
            style={styles.container}
          >
            <LottieView
              style={styles.welcomeImage}
              source={require("../../assets/images/welcome.json")}
              resizeMode="contain"
              renderMode="HARDWARE"
              autoPlay
              loop
              speed={2}
            />
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.footer}>
          <View style={{ alignItems: "center" }}>
            <Typo size={30} fontWeight={"800"}>
              Master your money,
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              master your life.
            </Typo>
          </View>
          <View style={{ alignItems: "center", gap: 2 }}>
            <Typo size={17} color={colors.textLight}>
              A well-planned budget
            </Typo>
            <Typo size={17} color={colors.textLight}>
              secures your future lifestyle.
            </Typo>
          </View>
          {/* btn */}
          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/register")}>
              <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </View>
        </Animated.View>
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
