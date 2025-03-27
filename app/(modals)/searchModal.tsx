import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import {
  BackButton,
  Button,
  ImageLinkHandler,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { createOrUpdateWalletData, deleteWalletData } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TransactionType, WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import { useFetchData } from "@/hooks";
import { TransactionList } from "@/components/home";

export default function SearchModal() {
  const router = useRouter();
  const { user, updateUserData } = useAuthStore();
  const [loading, setLoading] = useState(false);
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
          title="Search"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView style={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              placeholder="shoes..."
              value={search}
              onChangeText={value => setSearch(value)}
            />
          </View>
          <View style={{ marginTop: spacingY._15 }}>
            <TransactionList
              loading={transactionLoading}
              data={filteredTransactions}
              emptyListMessage="No transactions match your search keywords"
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
