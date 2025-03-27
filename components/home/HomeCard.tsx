import { StyleSheet, View } from "react-native";
import { Typo } from "../ui";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { ImageBackground } from "expo-image";
import { Entypo, AntDesign } from "@expo/vector-icons";
import useAuthStore from "@/store/authStore";
import { useFetchData } from "@/hooks";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";

export const HomeCard = () => {
  const { user } = useAuthStore();
  const {
    data: wallets,
    loading: walletsLoading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance += Number(item.amount);
        totals.income += Number(item.totalIncome);
        totals.expense += Number(item.totalExpenses);
        return totals;
      },
      { balance: 0, income: 0, expense: 0 }
    );
  };

  return (
    <ImageBackground
      // resizeMode="stretch"
      contentFit="fill"
      style={styles.bgImage}
      source={require("../../assets/images/card.png")}
    >
      <View style={styles.container}>
        <View>
          {/* Total balance */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} fontWeight={"500"} size={17}>
              Total Balance
            </Typo>
            <Entypo
              name="dots-three-horizontal"
              size={verticalScale(23)}
              color={colors.black}
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            {user?.currency}
            {walletsLoading ? "---" : getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* Total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <AntDesign name="arrowdown" size={24} color="black" />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                {user?.currency}{" "}
                {walletsLoading ? "---" : getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <AntDesign name="arrowup" size={24} color="black" />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                {user?.currency}{" "}
                {walletsLoading ? "---" : getTotals()?.expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: { height: scale(210), width: "100%" },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral300,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
