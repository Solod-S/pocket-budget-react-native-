import { View, Text, TouchableOpacity, Alert } from "react-native";
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
import authStore from "@/store/authStore";
import { useRouter } from "expo-router";

export default function Restore() {
  const router = useRouter();
  const { resetPassword } = authStore;

  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef("");

  const handleRestore = async () => {
    try {
      if (!emailRef.current) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }
      setIsLoading(true);
      const response = await resetPassword(emailRef.current.trim());
      setIsLoading(false);
      if (!response.success) {
        Alert.alert("Error", response.message);
      } else {
        Alert.alert(
          "Success",
          "A password reset email has been sent to your inbox.",
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
              Reset
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              Your Password
            </Typo>
          </View>
          {/* Form */}
          <View style={styles.form}>
            <Typo size={16}>
              Enter your email to receive a password reset link
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
              placeholder="Enter email"
            />

            <Button loading={isLoading} onPress={() => handleRestore()}>
              <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
                Restore
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
