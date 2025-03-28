import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import {
  BackButton,
  Button,
  CustomKeyboardView,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components/";
import { updateSettingsUser } from "@/services";
import { SettingsDataType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useRouter } from "expo-router";
import Modal from "react-native-modal";
import { FormattedMessage, useIntl } from "react-intl";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Українська", value: "uk" },
  { label: "Русский", value: "ru" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
];

const CURRENCIES = [
  { label: "$ - USD", value: "$" },
  { label: "₴ - UAH", value: "₴" },
  { label: "₽ - RUB", value: "₽" },
  { label: "₣ - CHF", value: "₣" },
  { label: "€ - EUR", value: "€" },
];

export default function SettingsModal() {
  const intl = useIntl();
  const router = useRouter();
  const { user, updateUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsDataType>({
    language: "en",
    currency: "$",
  });

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

  useEffect(() => {
    setSettingsData({
      language: user?.language || "en",
      currency: user?.currency || "$",
    });
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await updateSettingsUser(
        user?.uid as string,
        settingsData
      );
      if (result.success) {
        updateUserData(user?.uid as string);
        router.back();
      } else {
        Alert.alert("User", result.msg);
      }
    } catch (error) {
      console.log("Error in submitting user: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={intl.formatMessage({ id: "settingsModal.title" })}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <CustomKeyboardView>
          <ScrollView style={styles.form}>
            {/* Language Select */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>
                <FormattedMessage id="settingsModal.language" />
              </Typo>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setLanguageModalVisible(true)}
              >
                <Typo color={colors.neutral100}>
                  {
                    LANGUAGES.find(l => l.value === settingsData.language)
                      ?.label
                  }
                </Typo>
              </TouchableOpacity>
            </View>

            {/* Currency Select */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>
                <FormattedMessage id="settingsModal.currency" />
              </Typo>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setCurrencyModalVisible(true)}
              >
                <Typo color={colors.neutral100}>
                  {
                    CURRENCIES.find(c => c.value === settingsData.currency)
                      ?.label
                  }
                </Typo>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </CustomKeyboardView>

        <View style={styles.footer}>
          <Button loading={loading} onPress={handleSubmit} style={{ flex: 1 }}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              <FormattedMessage id="settingsModal.save" />
            </Typo>
          </Button>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        isVisible={isLanguageModalVisible}
        onBackdropPress={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Typo style={styles.modalTitle}>
            <FormattedMessage id="settingsModal.selectLanguage" />
          </Typo>
          <FlatList
            data={LANGUAGES}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSettingsData(prev => ({ ...prev, language: item.value }));
                  setLanguageModalVisible(false);
                }}
              >
                <Typo color={colors.neutral100}>{item.label}</Typo>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        isVisible={isCurrencyModalVisible}
        onBackdropPress={() => setCurrencyModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Typo style={styles.modalTitle}>
            <FormattedMessage id="settingsModal.selectCurrency" />
          </Typo>
          <FlatList
            data={CURRENCIES}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSettingsData(prev => ({ ...prev, currency: item.value }));
                  setCurrencyModalVisible(false);
                }}
              >
                <Typo color={colors.neutral100}>{item.label}</Typo>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: { gap: spacingY._30, marginTop: spacingY._15 },
  inputContainer: { gap: spacingY._10, marginTop: spacingY._15 },
  selectBox: {
    padding: spacingY._10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderRadius: scale(8),
    backgroundColor: colors.neutral800,
  },
  modalContent: {
    backgroundColor: colors.neutral800,
    padding: spacingY._20,
    borderRadius: scale(10),
    width: "90%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: scale(18),
    color: colors.neutral100,
    marginBottom: spacingY._10,
    textAlign: "center",
  },
  option: {
    padding: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral600,
  },
});
