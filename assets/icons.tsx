import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
  home: (props: any) => <AntDesign name="home" size={26} {...props} />,
  status: (props: any) => <Feather name="bar-chart" size={26} {...props} />,
  wallet: (props: any) => <AntDesign name="wallet" size={26} {...props} />,
  profile: (props: any) => <AntDesign name="user" size={26} {...props} />,
};
