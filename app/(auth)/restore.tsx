import { View, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  BackButton,
  Button,
  CustomKeyboardView,
  Input,
  ScreenWrapper,
  Typo,
} from "@/components";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { FormattedMessage, useIntl } from "react-intl";

export default function Restore() {
  const intl = useIntl();
  const router = useRouter();
  const { resetPassword } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef("");

  const handleRestore = async () => {
    try {
      if (!emailRef.current) {
        Alert.alert(
          intl.formatMessage({
            id: "restore.errorTitle",
          }),
          intl.formatMessage({
            id: "restore.errorFillFields",
          })
        );
        return;
      }
      setIsLoading(true);
      const response = await resetPassword(emailRef.current.trim());
      setIsLoading(false);
      if (!response.success) {
        Alert.alert(
          intl.formatMessage({
            id: "restore.errorTitle",
          }),
          response.message
        );
      } else {
        Alert.alert(
          intl.formatMessage({
            id: "restore.successTitle",
          }),
          intl.formatMessage({
            id: "restore.successMessage",
          }),
          [{ text: "OK", onPress: () => router.replace("/welcome") }]
        );
      }
    } catch (error) {
      console.log(`Error in handleRestore`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <CustomKeyboardView>
        <Animated.View
          entering={FadeIn.duration(1000)}
          style={styles.container}
        >
          <BackButton iconSize={28} />
          <View style={{ gap: 5 }}>
            <Typo size={30} fontWeight={"800"}>
              <FormattedMessage id="restore.title1" />
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              <FormattedMessage id="restore.title2" />
            </Typo>
          </View>
          {/* Form */}
          <View style={styles.form}>
            <Typo size={16}>
              <FormattedMessage id="restore.subtitle" />
            </Typo>
            <Input
              onChangeText={value => {
                emailRef.current = value;
              }}
              icon={
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={colors.neutral400}
                />
              }
              placeholder={intl.formatMessage({
                id: "restore.emailPlaceholder",
              })}
            />

            <Button loading={isLoading} onPress={() => handleRestore()}>
              <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
                <FormattedMessage id="restore.restoreButton" />
              </Typo>
            </Button>
          </View>
        </Animated.View>
      </CustomKeyboardView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
    fontWeight: "700",
    color: colors.neutral800,
    marginVertical: spacingY._10,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "700",
    color: colors.neutral800,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.neutral800,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.neutral800,
    fontSize: verticalScale(14),
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: verticalScale(14),
  },
});
