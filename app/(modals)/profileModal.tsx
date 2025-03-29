import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  BackButton,
  Button,
  CustomKeyboardView,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components/";
import { Image } from "expo-image";
import { getProfileImage, updateUser } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserDataType, UserType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useRouter } from "expo-router";
import { FormattedMessage, useIntl } from "react-intl";

export default function ProfileModal() {
  const intl = useIntl();
  const router = useRouter();
  const { user, updateUserData } = useAuthStore();
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  useEffect(() => {
    setUserData({ name: user?.name || "", image: user?.image || null });
  }, [user]);

  const handleImageEdit = () => {
    setIsModalVisible(true);
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setUserData(prevState => ({ ...prevState, image: url }));
  };

  const handleSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert(
        intl.formatMessage({ id: "profileModal.user" }),
        intl.formatMessage({ id: "profileModal.error" })
      );
      return;
    }

    try {
      setLoading(true);
      const result = await updateUser(user?.uid as string, userData);

      if (result.success) {
        updateUserData(user?.uid as string);
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "profileModal.title" }),
          result.msg
        );
      }
    } catch (error) {
      console.log("Error in submitting user: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setImageUrl(user?.image || "");
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={intl.formatMessage({ id: "profileModal.title" })}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <CustomKeyboardView>
          <ScrollView style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={getProfileImage(userData.image)}
                transition={100}
              />
              <TouchableOpacity
                onPress={handleImageEdit}
                style={styles.editIcon}
              >
                <MaterialIcons
                  name="edit"
                  size={verticalScale(22)}
                  color={colors.neutral600}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>
                <FormattedMessage id="profileModal.name" />
              </Typo>
              <Input
                placeholder={intl.formatMessage({ id: "profileModal.name" })}
                value={userData.name}
                onChangeText={value =>
                  setUserData(prevState => ({ ...prevState, name: value }))
                }
              />
            </View>
          </ScrollView>
        </CustomKeyboardView>
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleSubmit} style={{ flex: 1 }}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              <FormattedMessage id="profileModal.updateButton" />
            </Typo>
          </Button>
        </View>
      </View>

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
              onChangeText={handleImageUrlChange}
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
                  {" "}
                  <FormattedMessage id="profileModal.cancel" />
                </Typo>
              </Button>
              <Button
                onPress={() => {
                  setIsModalVisible(false);
                  setUserData(prevState => ({ ...prevState, image: imageUrl }));
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
  avatarContainer: { position: "relative", alignSelf: "center" },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._7,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: { gap: spacingY._10, marginTop: spacingY._15 },
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
