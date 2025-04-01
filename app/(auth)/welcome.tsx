import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, ScreenWrapper, Typo } from "@/components";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import LottieView from "lottie-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import LanguageSelect from "@/components/ui/LanguageSelect";
import appSettingsStore from "@/store/appSettingsStore";
import { FormattedMessage } from "react-intl";

export default function Welcome() {
  const router = useRouter();
  const { setAppSettings, appSettings } = appSettingsStore();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const handleSettings = (value: string) => {
    setAppSettings({ ...appSettings, language: value });
    setLanguageModalVisible(false);
  };

  return (
    <ScreenWrapper>
      <LanguageSelect
        isLanguageModalVisible={isLanguageModalVisible}
        setLanguageModalVisible={setLanguageModalVisible}
        setSettingsData={handleSettings}
      />
      <View style={styles.container}>
        {/* Login btn & img */}
        <View>
          <Animated.View
            style={styles.headerContainer}
            entering={FadeIn.duration(1000)}
          >
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              style={styles.langButton}
            >
              <Typo fontWeight={"500"}>{appSettings?.language}</Typo>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              // style={styles.loginButton}
            >
              <Typo fontWeight={"500"}>
                <FormattedMessage id="welcome.signIn" />
              </Typo>
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
              <FormattedMessage id="welcome.masterMoney" />
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              <FormattedMessage id="welcome.masterLife" />
            </Typo>
          </View>
          <View style={{ alignItems: "center", gap: 2 }}>
            <Typo size={17} color={colors.textLight}>
              <FormattedMessage id="welcome.budgetAdvice" />
            </Typo>
            <Typo size={17} color={colors.textLight}>
              <FormattedMessage id="welcome.secureFuture" />
            </Typo>
          </View>
          {/* btn */}
          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/register")}>
              <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
                <FormattedMessage id="welcome.getStarted" />
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
  headerContainer: {
    flexDirection: "row",
    marginHorizontal: spacingX._20,
    justifyContent: "space-between",
  },
  langButton: {
    minWidth: spacingX._35,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.text,
    borderWidth: 1,
    padding: spacingX._3,
    borderRadius: radius._6,
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
