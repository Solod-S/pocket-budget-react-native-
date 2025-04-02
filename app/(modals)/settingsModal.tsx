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
import { Currencies, languages } from "@/constants/data";
import LanguageSelect from "@/components/ui/LanguageSelect";
import appSettingsStore from "@/store/appSettingsStore";
import Toast from "react-native-toast-message";

export default function SettingsModal() {
  const intl = useIntl();
  const router = useRouter();
  const { user, updateUserData } = useAuthStore();
  const { setAppSettings, appSettings } = appSettingsStore();
  const [loading, setLoading] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsDataType>({
    language: "en",
    currency: "$",
  });

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

  const handleSettings = (value: string) => {
    setSettingsData(prev => ({ ...prev, language: value }));
    setLanguageModalVisible(false);
  };

  useEffect(() => {
    setSettingsData({
      language: user?.language || "en",
      currency: user?.currency || "$",
    });
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setAppSettings({ ...appSettings, language: settingsData?.language });
      const result = await updateSettingsUser(
        user?.uid as string,
        settingsData
      );

      if (result.success) {
        updateUserData(user?.uid as string);
        let msg = "The settings were saved successfully";

        switch (true) {
          case settingsData.language === "en":
            msg = "The settings were saved successfully";
            break;
          case settingsData.language === "uk":
            msg = "Налаштування було успішно збережено";
            break;
          case settingsData.language === "ru":
            msg = "Настройки были успешно сохранены";
            break;
          case settingsData.language === "fr":
            msg = "Les paramètres ont été enregistrés avec succès";
            break;
          case settingsData.language === "de":
            msg = "Die Einstellungen wurden erfolgreich gespeichert";
            break;

          default:
            break;
        }

        Toast.show({
          type: "success",
          position: "top",
          // text1: "Error",
          text2: msg,
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "settingsModal.title" }),
          result.msg
        );
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
                    languages.find(l => l.value === settingsData.language)
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
                    Currencies.find(c => c.value === settingsData.currency)
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
      <LanguageSelect
        isLanguageModalVisible={isLanguageModalVisible}
        setLanguageModalVisible={setLanguageModalVisible}
        setSettingsData={handleSettings}
      />

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
            data={Currencies}
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
