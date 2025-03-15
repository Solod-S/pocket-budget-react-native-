import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";

export const icons = {
  home: (props: any) => <FontAwesome5 name="home" size={23} {...props} />,
  status: (props: any) => (
    <FontAwesome5 name="chart-area" size={23} {...props} />
  ),
  wallet: (props: any) => (
    <FontAwesome5 name="money-bill" size={23} {...props} />
  ),
  profile: (props: any) => (
    <FontAwesome5 name="user-alt" size={21} {...props} />
  ),
};
