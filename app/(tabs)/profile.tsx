import { ScreenWrapper, Typo } from "@/components";
import { Header } from "@/components";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Entypo, AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { getProfileImage } from "@/services";
import { accountOptionType } from "@/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { FormattedMessage, useIntl } from "react-intl";

export default function Profile() {
  const intl = useIntl();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const accountOption: accountOptionType[] = [
    {
      icon: <AntDesign name="user" size={24} color={colors.text} />,
      title: intl.formatMessage({ id: "profile.title" }),
      routeName: "(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      icon: <Ionicons name="settings-outline" size={24} color={colors.text} />,
      title: intl.formatMessage({ id: "profile.settings" }),
      routeName: "(modals)/settingsModal",
      bgColor: "#059669",
    },
    {
      icon: <MaterialIcons name="privacy-tip" size={24} color={colors.text} />,
      title: intl.formatMessage({ id: "profile.privacyPolicy" }),
      routeName: "(modals)/privacyPolicyModal",
      bgColor: colors.neutral600,
    },
    {
      icon: <AntDesign name="logout" size={24} color={colors.text} />,
      title: intl.formatMessage({ id: "profile.logout" }),
      bgColor: "#e11d48",
    },
  ];

  const showAlert = () => {
    Alert.alert(
      intl.formatMessage({ id: "profile.confirm" }),
      intl.formatMessage({ id: "profile.confirmLogout" }),
      [
        {
          text: intl.formatMessage({ id: "profile.cancel" }),
          onPress: () => console.log(`cancel logout`),
          style: "cancel",
        },
        {
          text: intl.formatMessage({ id: "profile.logout" }),
          onPress: () => handleLogOut(),
          style: "destructive",
        },
      ]
    );
  };

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.log("error in logout:", error?.message);
    }
  };

  const handlePress = (item: accountOptionType) => {
    if (item.bgColor == "#e11d48") showAlert();

    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title={intl.formatMessage({ id: "profile.title" })}
          style={{ marginVertical: spacingY._10 }}
        />
        {/* User info */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            <Image
              style={styles.avatar}
              contentFit="cover"
              transition={100}
              source={getProfileImage(user?.image)}
            />
          </View>
          {/* Name & Email */}
          <View style={styles.nameContainer}>
            <Typo color={colors.neutral100} size={24} fontWeight={"600"}>
              {user?.name}
            </Typo>
            <Typo color={colors.neutral400} size={15}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* options */}

        <View style={styles.accountOption}>
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(50 * index)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
                key={item.bgColor}
              >
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={styles.flexRow}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon}
                  </View>
                  <Typo size={16} fontWeight={"500"} style={{ flex: 1 }}>
                    {item.title}
                  </Typo>
                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: { gap: verticalScale(4), alignItems: "center" },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: { marginBottom: verticalScale(17) },
  accountOption: { marginTop: spacingY._35 },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     alignItems: "center",
//     paddingVertical: 20,
//     position: "relative",
//   },
//   avatarContainer: {
//     alignItems: "center",
//   },
//   avatarGradient: {
//     width: 144,
//     height: 144,
//     borderRadius: 72,
//     padding: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatar: {
//     width: 128,
//     height: 128,
//     borderRadius: 64,
//   },
//   name: {
//     fontSize: 24,
//     color: colors.neutral800,
//     marginTop: 16,
//   },
//   title: {
//     fontSize: 20,
//     color: colors.neutral800,
//     fontWeight: "bold",
//     marginTop: 4,
//   },
//   menuContainer: {
//     flex: 1,
//     marginTop: 20,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },
//   menuIcon: {
//     width: "20%",
//     alignItems: "center",
//   },
//   menuItemText: {
//     fontSize: 20,
//     color: colors.neutral800,
//   },
//   logoutButton: {
//     width: "60%",
//     alignSelf: "center",
//     marginVertical: 20,
//   },
//   uploadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: colors.neutral800,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 64,
//   },
// });
