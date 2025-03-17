import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ImageUploadProps } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { colors, radius } from "@/constants/theme";
import { Typo } from "./Typo";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { getFilePath } from "@/services";

export const ImageLinkHandler = ({
  url = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder,
}: ImageUploadProps) => {
  return (
    <View>
      {!url && (
        <TouchableOpacity
          onPress={() => onSelect()}
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
          <TouchableOpacity onPress={() => onClear()} style={styles.deleteIcon}>
            <Entypo name="trash" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
