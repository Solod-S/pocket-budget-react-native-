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
  ImageLinkHandler,
  Input,
  ModalWrapper,
  ScreenWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { Image } from "expo-image";
import {
  createOrUpdateWalletData,
  getProfileImage,
  updateUser,
} from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserDataType, UserType, WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useRouter } from "expo-router";

export default function WalletModal() {
  const router = useRouter();
  const { user, updateUserData } = useAuthStore();
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletType>({
    name: "",
    image: null,
  });

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setWalletData(prevState => ({ ...prevState, image: url }));
  };

  const handleSubmit = async () => {
    let { name, image } = walletData;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    try {
      // todo include wallet id to update
      const data: WalletType = {
        name,
        image,
        uid: user?.uid,
      };
      setLoading(true);
      const result = await createOrUpdateWalletData(data);
      console.log(`result`, result);
      if (result.success) {
        router.back();
      } else {
        Alert.alert("Wallet", result.msg);
      }
    } catch (error) {
      console.log("Error in handleSubmit: ", error);
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
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView style={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={walletData.name}
              onChangeText={value =>
                setWalletData(prevState => ({ ...prevState, name: value }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageLinkHandler
              url={walletData.image}
              onClear={() => handleImageUrlChange("")}
              onSelect={() => setIsModalVisible(true)}
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleSubmit} style={{ flex: 1 }}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              Add Wallet
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
            <Text style={styles.modalTitle}>Edit Image URL</Text>

            <Input
              placeholder="Enter image URL"
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
                <Typo color={colors.neutral100}>Cancel</Typo>
              </Button>
              <Button
                onPress={() => {
                  setIsModalVisible(false);
                  setWalletData(prevState => ({
                    ...prevState,
                    image: imageUrl,
                  }));
                }}
                style={styles.saveButton}
              >
                <Typo color={colors.neutral100}>Save</Typo>
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
    height: verticalScale(105),
    width: verticalScale(105),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._5,
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
