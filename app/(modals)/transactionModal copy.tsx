import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  BackButton,
  Button,
  ImageLinkHandler,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { Dropdown } from "react-native-element-dropdown";
import { deleteWalletData } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TransactionType, UserDataType, UserType, WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { useFetchWallets } from "@/hooks";
import { orderBy, where } from "firebase/firestore";
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from "@react-native-community/datetimepicker";

export default function TransactionModal() {
  const { user } = useAuthStore();
  const router = useRouter();
  const oldTransaction: { name: string; id: string; image: string } =
    useLocalSearchParams();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionType>({
    walletId: "",
    type: "expense",
    amount: 0,
    category: "",
    description: "",
    image: null,
    date: new Date(),
  });

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchWallets<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const handleImageUrlChange = (url: string | null) => {
    setTransactionData(prevState => ({ ...prevState, image: url }));
  };

  const handleSubmit = async () => {
    // let { name, image } = transactionData;
    // if (!name.trim()) {
    //   Alert.alert("Transaction", "Please fill all the fields");
    //   return;
    // }
    // try {
    //   // todo include wallet id to update
    //   const data: WalletType = {
    //     name,
    //     image,
    //     uid: user?.uid,
    //   };
    //   if (oldTransaction?.id) data.id = oldTransaction?.id;
    //   setLoading(true);
    //   const result = await createOrUpdateWalletData(data);
    //   if (result.success) {
    //     router.back();
    //   } else {
    //     Alert.alert("Transaction", result.msg);
    //   }
    // } catch (error) {
    //   console.log("Error in handleSubmit: ", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleDelete = async () => {
    console.log("delete", oldTransaction?.id);
    if (!oldTransaction?.id) return;
    try {
      setLoading(true);
      const result = await deleteWalletData(oldTransaction?.id);

      if (result.success) {
        router.back();
      } else {
        Alert.alert("Wallet", result.msg);
      }
    } catch (error) {
      console.log("Error in handleDelete: ", error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleAlarm = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDelete(),
          style: "destructive",
        },
      ]
    );
  };

  // const onDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
  //   const currentDate = selectedDate || transactionData.date;
  //   setTransactionData(prevState => ({
  //     ...prevState,
  //     date: currentDate,
  //   }));
  // };

  // useEffect(() => {
  //   if (oldTransaction?.id) {
  // setTransactionData({
  //   name: oldTransaction?.name,
  //   image: oldTransaction?.image,
  // });
  //   }
  //   return () => {};
  // }, []);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView style={styles.form}>
          {/*transaction type */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Type</Typo>
            {/* dropDown here */}
            <Dropdown
              activeColor={colors.neutral700}
              style={styles.dropDownContainer}
              itemTextStyle={styles.dropDownItemText}
              containerStyle={styles.dropDownListContainer}
              itemContainerStyle={styles.dropDownItemContainer}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropDownSelectText}
              iconStyle={styles.dropDownIcon}
              data={transactionTypes}
              // inputSearchStyle={styles.inputSearchStyle}
              // search
              // searchPlaceholder="Search..."
              // placeholder={!isFocus ? "Select item" : "..."}

              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transactionData.type}
              onChange={item => {
                setTransactionData(prevState => ({
                  ...prevState,
                  type: item.value,
                }));
              }}
            />
          </View>
          {/* wallets */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet</Typo>
            {/* dropDown here */}
            <Dropdown
              activeColor={colors.neutral700}
              style={styles.dropDownContainer}
              itemTextStyle={styles.dropDownItemText}
              containerStyle={styles.dropDownListContainer}
              itemContainerStyle={styles.dropDownItemContainer}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropDownSelectText}
              iconStyle={styles.dropDownIcon}
              data={wallets.map(item => ({
                label: `${item?.name} ($${item?.amount})`,
                value: item?.id,
              }))}
              // inputSearchStyle={styles.inputSearchStyle}
              // search
              // searchPlaceholder="Search..."
              placeholder={"Select Wallet"}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transactionData.walletId}
              onChange={item => {
                setTransactionData(prevState => ({
                  ...prevState,
                  walletId: item.value || "",
                }));
              }}
            />
          </View>
          {/* expense categories */}
          {transactionData.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>expense categories</Typo>
              {/* dropDown here */}
              <Dropdown
                activeColor={colors.neutral700}
                style={styles.dropDownContainer}
                itemTextStyle={styles.dropDownItemText}
                containerStyle={styles.dropDownListContainer}
                itemContainerStyle={styles.dropDownItemContainer}
                placeholderStyle={styles.dropDownPlaceholder}
                selectedTextStyle={styles.dropDownSelectText}
                iconStyle={styles.dropDownIcon}
                data={Object.values(expenseCategories)}
                // inputSearchStyle={styles.inputSearchStyle}
                // search
                // searchPlaceholder="Search..."
                placeholder={"Select Wallet"}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transactionData.category}
                onChange={item => {
                  setTransactionData(prevState => ({
                    ...prevState,
                    category: item.value || "",
                  }));
                }}
              />
            </View>
          )}
          {/* date picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {!showDatePicker ? (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>{transactionData.date.toLocaleString()}</Typo>
              </TouchableOpacity>
            ) : (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                {/* <DateTimePicker
                  value={transactionData.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                /> */}
              </View>
            )}
          </View>
          {/* image picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Date</Typo>
            <ImageLinkHandler
              url={transactionData.image}
              onClear={handleImageUrlChange}
              onSelect={handleImageUrlChange}
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          {oldTransaction?.id && !loading && (
            <Button
              onPress={showDeleAlarm}
              loading={loading}
              style={{
                paddingHorizontal: spacingX._15,
                backgroundColor: colors.neutral100,
              }}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </Button>
          )}
          <Button loading={loading} onPress={handleSubmit} style={{ flex: 1 }}>
            <Typo size={22} color={colors.neutral100} fontWeight={"600"}>
              {oldTransaction?.id ? "Save Wallet" : "Add Wallet"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },

  form: {
    gap: spacingY._20,
    // paddingVertical: spacingY._15,
    // paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: { gap: spacingY._10, marginTop: spacingY._15 },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingY._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropDownItemText: {
    color: colors.white,
  },
  dropDownSelectText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingY._7,
    // top: 5,
    paddingVertical: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropDownPlaceholder: {
    color: colors.white,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: { height: verticalScale(30), tintColor: colors.neutral300 },
});
