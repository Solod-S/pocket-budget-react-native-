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
import { useRouter } from "expo-router";

import useAuthStore from "@/store/authStore";

export default function Login() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [securePass, setSecurePass] = useState(true);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    try {
      if (!emailRef.current || !passwordRef.current) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      setIsLoading(true);
      const response = await login(
        emailRef.current.trim(),
        passwordRef.current
      );
      setIsLoading(false);
      if (!response.success) {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.log(`Error in handleLogin`);
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
              Control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              Your Budget Easily
            </Typo>
          </View>
          {/* Form */}
          <View style={styles.form}>
            <Typo size={16}>Sign in to track your income and expenses</Typo>
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
            <View style={{ position: "relative", justifyContent: "center" }}>
              <Input
                onChangeText={value => {
                  passwordRef.current = value;
                }}
                inputStyle={{ paddingRight: 30 }}
                secureTextEntry={securePass}
                icon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color={colors.neutral400}
                  />
                }
                placeholder="Enter password"
              />
              <TouchableOpacity
                onPress={() => setSecurePass(prevState => !prevState)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
              >
                <Ionicons
                  name={securePass ? "eye" : "eye-off"}
                  size={24}
                  color={colors.neutral400}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.replace("/restore")}>
              <Typo
                size={14}
                color={colors.text}
                style={{ alignSelf: "flex-end" }}
              >
                Forgot Password?
              </Typo>
            </TouchableOpacity>
            <Button loading={isLoading} onPress={() => handleLogin()}>
              <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
                Login
              </Typo>
            </Button>
            <View style={styles.footer}>
              <Typo size={15}>Donn't have an account?</Typo>
              <TouchableOpacity onPress={() => router.replace("/register")}>
                <Typo fontWeight={"700"} color={colors.primary} size={15}>
                  Sign up
                </Typo>
              </TouchableOpacity>
            </View>
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
