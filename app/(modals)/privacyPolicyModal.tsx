import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { BackButton, ModalWrapper, Typo } from "@/components";
import { Header } from "@/components";
import { FormattedMessage, useIntl } from "react-intl";

export default function PrivacyPolicyModal() {
  const intl = useIntl();

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={intl.formatMessage({ id: "privacyPolicyModal.title" })}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView style={styles.content}>
          <Typo color={colors.neutral200}>
            <FormattedMessage id="privacyPolicyModal.description" />
          </Typo>

          <Typo color={colors.neutral200} style={styles.paragraph}>
            <FormattedMessage id="privacyPolicyModal.contact" />{" "}
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
