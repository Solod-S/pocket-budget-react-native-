import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Typo } from "../ui";
import { TransactionItemProps } from "@/types";
import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn } from "react-native-reanimated";

export const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const category = expenseCategories["rent"];
  // const category = incomeCategory
  const IconComponent = category.icon;
  return (
    <Animated.View
      entering={FadeIn.delay(70 * index)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              color={colors.white}
              weight="fill"
              size={verticalScale(25)}
            />
          )}
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo
            textProps={{ numberOfLines: 1 }}
            size={17}
            color={colors.neutral400}
          >
            paid wifi bill
          </Typo>
        </View>
        <View style={styles.amountDae}>
          <Typo fontWeight={"500"} color={colors.green}>
            + $25
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            12 jan
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacingY._17 },
  list: { minHeight: 3 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    backgroundColor: colors.neutral800,
    padding: spacingX._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: { flex: 1, gap: 2.5 },
  amountDae: {
    alignItems: "flex-end",
    gap: 3,
  },
});
