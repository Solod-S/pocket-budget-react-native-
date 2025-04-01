import { BaseToast } from "react-native-toast-message";
import { colors } from "./theme";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colors.neutral800,
        borderLeftColor: "#22C55E",
      }}
      text1Style={{ color: colors.text }}
      text2Style={{ color: colors.text }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colors.neutral800,
        borderLeftColor: "#EF4444",
      }}
      text1Style={{ color: colors.text }}
      text2Style={{ color: colors.text }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colors.neutral800,
        borderLeftColor: "#3B82F6",
      }}
      text1Style={{ color: colors.text }}
      text2Style={{ color: colors.text }}
    />
  ),
};
