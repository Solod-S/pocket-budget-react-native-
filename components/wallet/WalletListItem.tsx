import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Typo } from "../ui";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { Image } from "expo-image";
import { Entypo } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getProfileImage } from "@/services";

export const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: { id: item?.id, name: item?.name, image: item?.image },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity onPress={() => openWallet()} style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={getProfileImage(item?.image, "wallet")}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={14} color={colors.neutral400}>
            ${item?.amount}
          </Typo>
        </View>
        <Entypo name="chevron-small-right" size={24} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
