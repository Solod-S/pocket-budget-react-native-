import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TransactionListType } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { Loading, Typo } from "../ui";
import { FlashList } from "@shopify/flash-list";
import { TransactionItem } from "./TransactionItem";
import { verticalScale } from "@/utils/styling";

export const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = () => {
    // open details in modal
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              handleClick={handleClick}
              item={item}
              index={index}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data?.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
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
