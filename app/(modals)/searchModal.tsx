import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { BackButton, Input, ModalWrapper } from "@/components";
import { Header } from "@/components";
import { TransactionType } from "@/types";
import useAuthStore from "@/store/authStore";
import { orderBy, where } from "firebase/firestore";
import { useFetchData } from "@/hooks";
import { TransactionList } from "@/components/home";
import { useIntl } from "react-intl";

export default function SearchModal() {
  const intl = useIntl();
  const { user, updateUserData } = useAuthStore();
  const [search, setSearch] = useState("");

  const constains = [where("uid", "==", user?.uid), orderBy("date", "desc")];
  const {
    data: allTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constains);

  const filteredTransactions = allTransactions.filter(item => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={intl.formatMessage({ id: "searchModal.title" })}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView style={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              placeholder={intl.formatMessage({
                id: "searchModal.searchPlaceholder",
              })}
              value={search}
              onChangeText={value => setSearch(value)}
            />
          </View>
          <View style={{ marginTop: spacingY._15 }}>
            <TransactionList
              loading={transactionLoading}
              data={filteredTransactions}
              emptyListMessage={intl.formatMessage({
                id: "searchModal.noTransactions",
              })}
            />
          </View>
        </ScrollView>
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
  form: { gap: spacingY._30, marginTop: spacingY._10 },
  inputContainer: { gap: spacingY._10, marginTop: spacingY._15 },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
