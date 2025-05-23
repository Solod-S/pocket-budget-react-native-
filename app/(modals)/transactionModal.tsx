import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  BackButton,
  Button,
  CustomKeyboardView,
  ImageLinkHandler,
  Input,
  ModalWrapper,
  Typo,
} from "@/components";
import { Header } from "@/components";
import { Dropdown } from "react-native-element-dropdown";
import { createOrUpdateTransactionData, deleteWalletData } from "@/services";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TransactionType, UserDataType, UserType, WalletType } from "@/types";
import useAuthStore from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { useFetchData } from "@/hooks";
import { orderBy, where } from "firebase/firestore";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";
import { deleteTransactionData } from "@/services/transactionServices";
import { FormattedMessage, useIntl } from "react-intl";
import Toast from "react-native-toast-message";

export default function TransactionModal() {
  const intl = useIntl();
  const { user } = useAuthStore();
  const router = useRouter();

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category: string;
    date: string;
    description: string;
    image: any;
    uid: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();
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

  // localization
  const localizedExpenseCategories = Object.fromEntries(
    Object.entries(expenseCategories).map(([key, category]) => [
      key,
      {
        ...category,
        label: intl.formatMessage({
          id: `expenseCategories.${category.value}`,
        }),
      },
    ])
  );

  // localization
  const localizedTransactionTypes = transactionTypes.map(item => {
    return {
      ...item,
      label: intl.formatMessage({
        id: `transactionTypes.${item.value}`,
      }),
    };
  });

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const handleImageUrlChange = (url: string | null) => {
    setTransactionData(prevState => ({ ...prevState, image: url }));
  };

  const handleSubmit = async () => {
    try {
      let { type, amount, description, category, date, walletId, image } =
        transactionData;
      const missingFields = [];

      if (type === "expense" && !category)
        missingFields.push(
          intl.formatMessage({ id: "transactionModal.category" })
        );
      if (!amount)
        missingFields.push(
          intl.formatMessage({ id: "transactionModal.amount" })
        );
      if (!date)
        missingFields.push(intl.formatMessage({ id: "transactionModal.date" }));
      if (!walletId)
        missingFields.push(
          intl.formatMessage({ id: "transactionModal.wallet" })
        );

      if (missingFields.length > 0) {
        Alert.alert(
          intl.formatMessage({ id: "transactionModal.transactionAlertTitle" }),
          `${intl.formatMessage({
            id: "transactionModal.transactionAlertMessage",
          })}: ${missingFields.join(", ")}`
        );
        return;
      }
      let data: TransactionType = {
        type,
        amount,
        description,
        category,
        date,
        walletId,
        image: image ? image : null,
        uid: user?.uid,
      };
      if (oldTransaction?.id) data.id = oldTransaction?.id;

      setLoading(true);
      const result = await createOrUpdateTransactionData(data);
      if (result.success) {
        Toast.show({
          type: "success",
          position: "top",
          // text1: "Error",
          text2: intl.formatMessage({ id: "transactionModal.success" }),
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "transactionModal.transactionAlertTitle" }),
          result.msg
        );
      }
    } catch (error) {
      console.log("Error in submitting transaction: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!oldTransaction?.id || !oldTransaction?.walletId) return;
    try {
      setLoading(true);
      const result = await deleteTransactionData(
        oldTransaction?.id,
        oldTransaction?.walletId
      );

      if (result.success) {
        router.back();
      } else {
        Alert.alert(
          intl.formatMessage({ id: "transactionModal.transactionAlertTitle" }),
          result.msg
        );
      }
    } catch (error) {
      console.log("Error in deleting transaction: ", error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleAlarm = () => {
    Alert.alert(
      intl.formatMessage({ id: "transactionModal.confirmDeleteTitle" }),
      intl.formatMessage({ id: "transactionModal.confirmDeleteMessage" }),
      [
        {
          text: intl.formatMessage({
            id: "transactionModal.cancel",
          }),
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: intl.formatMessage({
            id: "transactionModal.delete",
          }),
          onPress: () => handleDelete(),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransactionData({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction?.category,
        date: new Date(oldTransaction?.date),
        walletId: oldTransaction?.walletId,
        image: oldTransaction?.image || null,
      });
    }
    return () => {};
  }, []);

  const onDateChange = (date: Date) => {
    setTransactionData(prevState => ({
      ...prevState,
      date: date,
    }));
    setShowDatePicker(false);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={
            oldTransaction?.id
              ? intl.formatMessage({ id: "transactionModal.updateTransaction" })
              : intl.formatMessage({ id: "transactionModal.newTransaction" })
          }
          leftIcon={<BackButton />}
          style={{
            marginBottom: spacingY._10,
            paddingHorizontal: spacingX._20,
          }}
        />
        <CustomKeyboardView>
          <ScrollView style={styles.form}>
            {/*transaction type */}
            <View
              style={[
                styles.inputContainer,
                { paddingHorizontal: spacingX._20 },
              ]}
            >
              <Typo color={colors.neutral200} size={16}>
                <FormattedMessage id="transactionModal.type" />
              </Typo>
              {/* dropDown here */}
              <Dropdown
                activeColor={colors.neutral700}
                style={styles.dropDownContainer}
                itemTextStyle={styles.dropDownItemText}
                containerStyle={styles.dropDownListContainer}
                itemContainerStyle={styles.dropDownItemContainer}
                placeholderStyle={[
                  styles.dropDownPlaceholder,
                  {
                    color:
                      wallets?.length <= 0
                        ? colors.neutral700
                        : colors.neutral300,
                  },
                ]}
                selectedTextStyle={styles.dropDownSelectText}
                iconStyle={styles.dropDownIcon}
                data={localizedTransactionTypes}
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
            <View
              style={[
                styles.inputContainer,
                { paddingHorizontal: spacingX._20 },
              ]}
            >
              <Typo color={colors.neutral200} size={16}>
                <FormattedMessage id="transactionModal.wallet" />
              </Typo>
              {/* dropDown here */}
              <Dropdown
                disable={wallets?.length <= 0}
                activeColor={colors.neutral700}
                style={[
                  styles.dropDownContainer,
                  {
                    borderColor:
                      wallets?.length <= 0
                        ? colors.neutral700
                        : colors.neutral300,
                  },
                ]}
                itemTextStyle={styles.dropDownItemText}
                containerStyle={styles.dropDownListContainer}
                itemContainerStyle={styles.dropDownItemContainer}
                placeholderStyle={[
                  styles.dropDownPlaceholder,
                  {
                    color:
                      wallets?.length <= 0
                        ? colors.neutral700
                        : colors.neutral300,
                  },
                ]}
                selectedTextStyle={styles.dropDownSelectText}
                iconStyle={[
                  styles.dropDownIcon,
                  {
                    tintColor:
                      wallets?.length <= 0
                        ? colors.neutral700
                        : colors.neutral300,
                  },
                ]}
                data={wallets.map(item => ({
                  label: `${item?.name} (${user?.currency}${item?.amount})`,
                  value: item?.id,
                }))}
                // inputSearchStyle={styles.inputSearchStyle}
                // search
                // searchPlaceholder="Search..."
                placeholder={intl.formatMessage({
                  id: `transactionModal.walletPlaceholder`,
                })}
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
              <View
                style={[
                  styles.inputContainer,
                  { paddingHorizontal: spacingX._20 },
                ]}
              >
                <Typo color={colors.neutral200} size={16}>
                  <FormattedMessage id="transactionModal.category" />
                </Typo>
                {/* dropDown here */}
                <Dropdown
                  activeColor={colors.neutral700}
                  style={styles.dropDownContainer}
                  itemTextStyle={styles.dropDownItemText}
                  containerStyle={styles.dropDownListContainer}
                  itemContainerStyle={styles.dropDownItemContainer}
                  placeholderStyle={[
                    styles.dropDownPlaceholder,
                    {
                      color:
                        wallets?.length <= 0
                          ? colors.neutral700
                          : colors.neutral300,
                    },
                  ]}
                  selectedTextStyle={styles.dropDownSelectText}
                  iconStyle={styles.dropDownIcon}
                  data={Object.values(localizedExpenseCategories)}
                  // inputSearchStyle={styles.inputSearchStyle}
                  // search
                  // searchPlaceholder="Search..."
                  placeholder={intl.formatMessage({
                    id: `transactionModal.categoryPlaceholder`,
                  })}
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
              <View style={{ paddingHorizontal: spacingX._20 }}>
                <Typo color={colors.neutral200} size={16}>
                  <FormattedMessage id="transactionModal.date" />
                </Typo>
              </View>
              {!showDatePicker ? (
                <View style={{ paddingHorizontal: spacingX._20 }}>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Typo size={14}>
                      {format(transactionData.date as Date, "dd-MM-yyyy")}
                    </Typo>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <CalendarPicker
                    selectedStartDate={transactionData.date as Date}
                    onDateChange={onDateChange}
                    todayBackgroundColor="transparent"
                    selectedDayColor={colors.primary}
                    selectedDayTextColor="#fff"
                    textStyle={styles.calendarTextStyle}
                    monthTitleStyle={styles.calendarMonthTitleStyle}
                    nextTitle=""
                    previousTitle=""
                    scrollable={true}
                  />
                </View>
              )}
            </View>

            {/* amount */}
            <View
              style={[
                styles.inputContainer,
                { paddingHorizontal: spacingX._20 },
              ]}
            >
              <Typo color={colors.neutral200} size={16}>
                <FormattedMessage id="transactionModal.amount" />
              </Typo>
              <Input
                // placeholder="Amount"
                value={transactionData.amount.toString()}
                keyboardType="numeric"
                onChangeText={value =>
                  setTransactionData(prevState => ({
                    ...prevState,
                    amount: Number(value.replace(/[^0-9]/g, "")),
                  }))
                }
              />
            </View>

            {/* description */}
            <View
              style={[
                styles.inputContainer,
                { paddingHorizontal: spacingX._20 },
              ]}
            >
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  <FormattedMessage id="transactionModal.description" />
                </Typo>
                <Typo color={colors.neutral500} size={14}>
                  (<FormattedMessage id="transactionModal.optional" />)
                </Typo>
              </View>
              <Input
                placeholder={intl.formatMessage({
                  id: `transactionModal.description`,
                })}
                containerStyle={{
                  flexDirection: "row",
                  height: verticalScale(100),
                  alignItems: "flex-start",
                  paddingVertical: 15,
                }}
                multiline={true}
                value={transactionData.description}
                onChangeText={value =>
                  setTransactionData(prevState => ({
                    ...prevState,
                    description: value,
                  }))
                }
              />
            </View>
            {/* <View
              style={[
                styles.inputContainer,
                { paddingHorizontal: spacingX._20 },
              ]}
            >
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  <FormattedMessage id="transactionModal.iconUrl" />
                </Typo>
                <Typo color={colors.neutral500} size={14}>
                  (<FormattedMessage id="transactionModal.optional" />)
                </Typo>
              </View>
              <ImageLinkHandler
                url={transactionData.image}
                onClear={handleImageUrlChange}
                onSelect={handleImageUrlChange}
                placeholder={intl.formatMessage({
                  id: `transactionModal.uploadImage`,
                })}
              />
            </View> */}
          </ScrollView>
        </CustomKeyboardView>
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
              {oldTransaction?.id
                ? intl.formatMessage({
                    id: "transactionModal.update",
                  })
                : intl.formatMessage({
                    id: "transactionModal.submit",
                  })}
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
    // paddingHorizontal: spacingX._20,
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
  header: {
    fontSize: verticalScale(18),
    fontWeight: "bold",
    marginBottom: spacingY._5,
  },
  calendarTextStyle: {
    fontSize: verticalScale(14),
    color: colors.neutral400,
  },
  calendarMonthTitleStyle: {
    fontSize: verticalScale(16),
    fontWeight: "bold",
    color: colors.neutral400,
  },
});
