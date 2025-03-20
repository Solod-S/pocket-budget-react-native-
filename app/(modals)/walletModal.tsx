import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  BackButton,
  Button,
  ImageLinkHandler,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { Image } from "expo-image";
import { createOrUpdateWalletData, deleteWalletData } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserDataType, UserType, WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function WalletModal() {
  const router = useRouter();
  const oldWallet: { name: string; id: string; image: string } =
    useLocalSearchParams();
  const { user, updateUserData } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletType>({
    name: "",
    image: null,
  });

  const handleImageUrlChange = (url: string | null) => {
    setWalletData(prevState => ({ ...prevState, image: url }));
  };

  const handleSubmit = async () => {
    let { name, image } = walletData;
    if (!name.trim()) {
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
      if (oldWallet?.id) data.id = oldWallet?.id;
      setLoading(true);
      const result = await createOrUpdateWalletData(data);

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

  const handleDelete = async () => {
    console.log("delete", oldWallet?.id);
    if (!oldWallet?.id) return;
    try {
      setLoading(true);
      const result = await deleteWalletData(oldWallet?.id);

      if (result.success) {
        router.back();
      } else {
        Alert.alert("Wallet", result.msg);
      }
    } catch (error) {
      console.log("Error in handleDelete: ", error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleAlarm = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDelete(),
          style: "destructive",
        },
      ]
    );
  };
  useEffect(() => {
    if (oldWallet?.id) {
      setWalletData({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
    return () => {};
  }, []);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
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
              onClear={handleImageUrlChange}
              onSelect={handleImageUrlChange}
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          {oldWallet?.id && !loading && (
            <Button
              onPress={showDeleAlarm}
              loading={loading}
              style={{
                paddingHorizontal: spacingX._15,
                backgroundColor: colors.neutral100,
              }}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </Button>
          )}
          <Button loading={loading} onPress={handleSubmit} style={{ flex: 1 }}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              {oldWallet?.id ? "Save Wallet" : "Add Wallet"}
            </Typo>
          </Button>
        </View>
      </View>
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
});
