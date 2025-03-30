import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import { Typo } from "./Typo";
import { FormattedMessage } from "react-intl";
import { languages } from "@/constants/data";

const LanguageSelect = (
  isLanguageModalVisible: boolean,
  setLanguageModalVisible: (arg0: boolean) => void,
  setSettingsData: (arg0: (prev: any) => any) => void
) => {
  return (
    <Modal
      isVisible={isLanguageModalVisible}
      onBackdropPress={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <Typo style={styles.modalTitle}>
          <FormattedMessage id="settingsModal.selectLanguage" />
        </Typo>
        <FlatList
          data={languages}
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
  );
};

export default LanguageSelect;

const styles = StyleSheet.create({
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
