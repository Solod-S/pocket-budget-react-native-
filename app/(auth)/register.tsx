import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { BackButton, Button, Input, ScreenWrapper, Typo } from "@/components";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [securePass, setSecurePass] = useState(true);
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleRegister = async () => {
    try {
      if (!nameRef.current || !emailRef.current || !passwordRef.current) {
        Alert.alert("Register", "Please fill all the fields");
        //  Toast.show({
        //    type: "error",
        //    position: "top",
        //    text1: "Register Failed",
        //    text2: "Please fill all the fields",
        //    visibilityTime: 2000,
        //    autoHide: true,
        //    topOffset: 50,
        //  });
        return;
      }
      console.log(`Email: `, emailRef.current);
      console.log(`Password: `, passwordRef.current);
      console.log(`Name: `, nameRef.current);

      setIsLoading(true);
    } catch (error) {
      console.log(`Error in handleRegister`);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <ScreenWrapper>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5 }}>
          <Typo size={30} fontWeight={"800"}>
            Start Managing Your Finances
          </Typo>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Typo size={16}>
            Sign up to track your income and expenses easily
          </Typo>
          <Input
            onChangeText={value => {
              nameRef.current = value;
            }}
            icon={
              <Ionicons
                name="glasses-sharp"
                size={24}
                color={colors.neutral400}
              />
            }
            placeholder="Enter name"
          />
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

          <Button loading={isLoading} onPress={() => handleRegister()}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              Sign up
            </Typo>
          </Button>
          <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Typo fontWeight={"700"} color={colors.primary} size={15}>
                Sign in
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
