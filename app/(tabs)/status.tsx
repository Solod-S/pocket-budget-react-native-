import { Header, Loading, ScreenWrapper, Typo } from "@/components";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import useAuthStore from "@/store/authStore";
import {
  fetchMonthlyChartData,
  fetchWeeklyChartData,
  fetchYearlyChartData,
} from "@/services";
import { TransactionList } from "@/components/home";
import { FormattedMessage, useIntl } from "react-intl";

// const chartExmpl = [
//   {
//     value: 40,
//     label: "Mon",
//     spacing: scale(4),
//     labelWidth: scale(30),
//     frontColor: colors.green,
//     // topLabelComponent: () => {
//     //   <Typo size={10} style={{ marginBottom: 4 }} fontWeight={"bold"}>
//     //     50
//     //   </Typo>;
//     // },
//   },
//   { value: 20, frontColor: colors.rose },
// ];

export default function Status() {
  const intl = useIntl();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chart, setChart] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const m = intl.formatMessage({ id: "status.title" });

  useEffect(() => {
    if (user) {
      switch (true) {
        case activeIndex === 0:
          getWeeklyChart();
          break;

        case activeIndex === 1:
          getMonthlyChart();
          break;

        case activeIndex === 2:
          getYearlyChart();
          break;

        default:
          break;
      }
    }
  }, [activeIndex, user?.language]);

  const getWeeklyChart = async () => {
    try {
      setLoading(true);
      const res = await fetchWeeklyChartData(user?.uid as string);
      if (res.success) {
        const localizedData = res?.data?.stats.map((data: any) => {
          return {
            ...data,
            label: data?.label
              ? intl.formatMessage({
                  id: `sevenDays.${data?.label}`,
                })
              : "",
          };
        });

        setChart(localizedData);
        // setChart(res?.data?.stats);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg);
      }
    } catch (error) {
      console.log(`Error in getWeeklyChart`, error);
    } finally {
      setLoading(false);
    }
  };
  const getMonthlyChart = async () => {
    try {
      setLoading(true);
      const res = await fetchMonthlyChartData(user?.uid as string);
      if (res.success) {
        const localizedData = res?.data?.stats.map((data: any) => {
          const firstPartOfLabel = data?.label?.split(" ")[0]; // Month
          const secondPartOfLabel = data?.label?.split(" ")[1]; // Date
          return {
            ...data,
            label: firstPartOfLabel
              ? secondPartOfLabel +
                " " +
                intl.formatMessage({
                  id: `monthsOfYear.${firstPartOfLabel}`,
                })
              : "",
          };
        });

        setChart(localizedData);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg);
      }
    } catch (error) {
      console.log(`Error in getMonthlyChart`, error);
    } finally {
      setLoading(false);
    }
  };
  const getYearlyChart = async () => {
    try {
      setLoading(true);
      const res = await fetchYearlyChartData(user?.uid as string);
      if (res.success) {
        setChart(res?.data?.stats);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg);
      }
    } catch (error) {
      console.log(`Error in getMonthlyChart`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper edges={["bottom"]}>
      <View style={{ paddingBottom: verticalScale(180) }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Header title={intl.formatMessage({ id: "status.title" })} />
          </View>
          <ScrollView
            contentContainerStyle={{
              gap: spacingY._20,
              paddingTop: spacingY._5,
              // paddingBottom: verticalScale(100),
            }}
            showsVerticalScrollIndicator={false}
          >
            <SegmentedControl
              values={[
                intl.formatMessage({ id: "status.weekly" }),
                intl.formatMessage({ id: "status.monthly" }),
                intl.formatMessage({ id: "status.yearly" }),
              ]}
              selectedIndex={activeIndex}
              onChange={event => {
                setActiveIndex(event.nativeEvent.selectedSegmentIndex);
              }}
              tintColor={colors.neutral200}
              backgroundColor={colors.neutral800}
              activeFontStyle={styles.segmentFontStyle}
              style={styles.segmentStyle}
              fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
            />
            <View style={styles.chartContainer}>
              {chart.length > 0 ? (
                <BarChart
                  data={chart}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                  roundedTop
                  // roundedBottom
                  hideRules
                  yAxisLabelPrefix={user?.currency}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisLabelWidth={
                    [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                  }
                  // hideYAxisText
                  yAxisTextStyle={{ color: colors.neutral300 }}
                  xAxisLabelTextStyle={{
                    color: colors.neutral300,
                    fontSize: verticalScale(12),
                  }}
                  noOfSections={3}
                  minHeight={5}
                  // isAnimated={true}
                  // animationDuration={1000}
                  // maxValue={100}
                />
              ) : (
                <View style={styles.noChart}></View>
              )}
              {loading && (
                <View style={styles.chartLoadingContainer}>
                  <Loading color={colors.white} />
                </View>
              )}
            </View>
            {/* transactions */}
            <View>
              <TransactionList
                data={transactions}
                title={intl.formatMessage({ id: "status.transactions" })}
                emptyListMessage={intl.formatMessage({
                  id: "status.noTransactions",
                })}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0 0.6)",
  },
  header: {},
  noChart: { backgroundColor: "rgba(0,0,0,0.6", height: verticalScale(220) },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: { height: scale(37) },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
