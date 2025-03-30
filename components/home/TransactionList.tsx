import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TransactionListType, TransactionType } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { Loading, Typo } from "../ui";
import { FlashList } from "@shopify/flash-list";
import { TransactionItem } from "./TransactionItem";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import useAuthStore from "@/store/authStore";

export const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const { user } = useAuthStore();

  const [currentCurrency, setCurrentCurrency] = useState("$");

  const router = useRouter();
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
    // open details in modal
  };

  useEffect(() => {
    if (user?.currency) setCurrentCurrency(user?.currency);
  }, [user]);

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          extraData={{ currentCurrency, lang: user?.language }}
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              lang={user?.language || "en"}
              handleClick={handleClick}
              currency={currentCurrency}
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
