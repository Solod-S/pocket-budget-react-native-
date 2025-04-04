import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { icons } from "../../assets/icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { verticalScale } from "@/utils/styling";
import { FormattedMessage, useIntl } from "react-intl";

const TabBarButton = (props: any) => {
  const intl = useIntl();
  const { isFocused, label, routeName, color } = props;
  let translatedLabel = "";
  const scale = useSharedValue(0);

  switch (true) {
    case label === "home":
      translatedLabel = intl.formatMessage({
        id: "tabBarComponent.tabBar.home",
      });
      break;

    case label === "wallet":
      translatedLabel = intl.formatMessage({
        id: "tabBarComponent.tabBar.wallet",
      });
      break;

    case label === "status":
      translatedLabel = intl.formatMessage({
        id: "tabBarComponent.tabBar.status",
      });
      break;

    case label === "profile":
      translatedLabel = intl.formatMessage({
        id: "tabBarComponent.tabBar.profile",
      });
      break;

    default:
      break;
  }

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      // styles
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      // styles
      opacity,
    };
  });

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {icons[routeName as keyof typeof icons]({
          color,
        })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: verticalScale(12),
          },
          animatedTextStyle,
        ]}
      >
        {translatedLabel}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBarButton;
