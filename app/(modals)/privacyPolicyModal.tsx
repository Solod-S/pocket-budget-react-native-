import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { BackButton, ModalWrapper, Typo } from "@/components";
import { Header } from "@/components";

export default function PrivacyPolicyModal() {
  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title="Privacy Policy"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView style={styles.content}>
          <Typo color={colors.neutral200}>
            Your data is not shared with third parties. We use it solely to
            provide our services and improve the user experience.
          </Typo>

          <Typo color={colors.neutral200} style={styles.paragraph}>
            If you have any questions about our privacy policy, please contact
            us via email at{" "}
            <Typo color={colors.neutral200} style={styles.email}>
              solik098@gmail.com
            </Typo>
          </Typo>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  content: {
    marginTop: spacingY._10,
  },
  paragraph: {
    marginTop: spacingY._15,
  },
  email: {
    fontWeight: "bold",
    color: colors.neutral300,
  },
});
