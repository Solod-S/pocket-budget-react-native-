import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import {
  BackButton,
  Button,
  CustomKeyboardView,
  ImageLinkHandler,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { createOrUpdateWalletData, deleteWalletData } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormattedMessage, useIntl } from "react-intl";
import Toast from "react-native-toast-message";

export default function WalletModal() {
  const intl = useIntl();
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
      Alert.alert(
        intl.formatMessage({ id: "walletModal.wallet" }),
        intl.formatMessage({ id: "walletModal.pleaseFillAllFields" })
      );
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
        Toast.show({
          type: "success",
          position: "top",
          // text1: "Error",
          text2: intl.formatMessage({ id: "walletModal.success" }),
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "walletModal.wallet" }),
          result.msg
        );
      }
    } catch (error) {
      console.log("Error in submitting wallet: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!oldWallet?.id) return;
    try {
      setLoading(true);
      const result = await deleteWalletData(oldWallet?.id);

      if (result.success) {
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "walletModal.wallet" }),
          result.msg
        );
      }
    } catch (error) {
      console.log("Error in deleting wallet: ", error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleAlarm = () => {
    Alert.alert(
      intl.formatMessage({ id: "walletModal.confirmDeleteTitle" }),
      intl.formatMessage({ id: "walletModal.confirmDeleteMessage" }),
      [
        {
          text: intl.formatMessage({ id: "walletModal.cancel" }),
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: intl.formatMessage({ id: "walletModal.delete" }),
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
          title={
            oldWallet?.id
              ? intl.formatMessage({ id: "walletModal.updateTitle" })
              : intl.formatMessage({ id: "walletModal.title" })
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <CustomKeyboardView>
          <ScrollView style={styles.form}>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                <FormattedMessage id="walletModal.walletName" />
              </Typo>
              <Input
                placeholder={intl.formatMessage({
                  id: "walletModal.placeholderWalletName",
                })}
                value={walletData.name}
                onChangeText={value =>
                  setWalletData(prevState => ({ ...prevState, name: value }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  <FormattedMessage id="walletModal.iconUrl" />
                </Typo>
                <Typo color={colors.neutral500} size={14}>
                  (<FormattedMessage id="walletModal.optional" />)
                </Typo>
              </View>
              <ImageLinkHandler
                url={walletData.image}
                onClear={handleImageUrlChange}
                onSelect={handleImageUrlChange}
                placeholder={intl.formatMessage({
                  id: "walletModal.uploadImage",
                })}
              />
            </View>
          </ScrollView>
        </CustomKeyboardView>
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
              {oldWallet?.id
                ? intl.formatMessage({
                    id: "walletModal.saveWallet",
                  })
                : intl.formatMessage({
                    id: "walletModal.addWallet",
                  })}
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
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
