import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ImageUploadProps } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { colors, radius, spacingY } from "@/constants/theme";
import { Typo } from "./Typo";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { getFilePath } from "@/services";
import { Button } from "./Button";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "./Input";
import { FormattedMessage, useIntl } from "react-intl";

export const ImageLinkHandler = ({
  url = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder,
}: ImageUploadProps) => {
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(
    typeof url === "string" ? url : ""
  );
  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setImageUrl(typeof url === "string" ? url : "");
  };
  return (
    <View>
      {!url && (
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.inputContainer}
        >
          <Entypo name="images" size={24} color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}
      {url && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            contentFit="cover"
            style={{ flex: 1 }}
            source={getFilePath(url)}
            transition={100}
          />
          <TouchableOpacity
            onPress={() => onClear("")}
            style={styles.clearIcon}
          >
            <Entypo name="trash" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
      {/* Modal window for editing image URL */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              <FormattedMessage id="profileModal.editImageTitle" />
            </Text>

            <Input
              placeholder={intl.formatMessage({
                id: "profileModal.enterImageUrl",
              })}
              value={imageUrl}
              onChangeText={text => setImageUrl(text)}
            />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => setImageUrl("")}
            >
              <MaterialIcons
                name="delete"
                size={verticalScale(22)}
                color={colors.neutral100}
              />
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <Button onPress={handleCancelEdit} style={styles.cancelButton}>
                <Typo color={colors.neutral100}>
                  <FormattedMessage id="profileModal.cancel" />
                </Typo>
              </Button>
              <Button
                onPress={() => {
                  setIsModalVisible(false);
                  onSelect(imageUrl);
                }}
                style={styles.saveButton}
              >
                <Typo color={colors.neutral100}>
                  <FormattedMessage id="profileModal.save" />
                </Typo>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  clearIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.neutral800,
    padding: spacingY._20,
    borderRadius: scale(10),
    width: scale(300),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: scale(16),
    color: colors.neutral100,
    marginBottom: spacingY._10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: scale(10),
    marginTop: spacingY._15,
  },
  cancelButton: {
    backgroundColor: colors.neutral600,
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  deleteIcon: {
    position: "absolute",
    top: verticalScale(10),
    right: verticalScale(10),
    zIndex: 1,
  },
});
