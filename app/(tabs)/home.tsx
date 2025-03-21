import { Button, ScreenWrapper, Typo } from "@/components";
import { HomeCard, TransactionList } from "@/components/home";
import { colors, spacingX, spacingY } from "@/constants/theme";
import useAuthStore from "@/store/authStore";
import { verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons/";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <ScreenWrapper edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={16} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <FontAwesome
              name="search"
              size={verticalScale(22)}
              color={colors.neutral200}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyle}
        >
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={[1, 2, 3, 4, 5, 6]}
            loading={false}
            emptyListMessage="No Transaction added yet!"
            title="Recent Transaction"
          />
        </ScrollView>
        <View style={{ height: verticalScale(20) }}></View>
        <Button
          // style={{ position: "absolute" }}
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          <FontAwesome
            name="plus"
            size={verticalScale(34)}
            color={colors.neutral300}
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(90),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
