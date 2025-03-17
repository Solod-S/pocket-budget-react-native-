import { ScreenWrapper, Typo } from "@/components";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";

export default function Wallet() {
  const router = useRouter();
  const getTotalBalance = () => {
    return 4242;
  };
  return (
    <ScreenWrapper style={{ backgroundColor: "black" }}>
      <View style={styles.container}>
        {/* Balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo fontWeight={"500"} size={45}>
              ${getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* Wallets */}
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo fontWeight={"500"} size={20}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Entypo
                name="circle-with-plus"
                size={verticalScale(33)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Wallets list */}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral800,
    borderTopRightRadius: radius._30,

    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
