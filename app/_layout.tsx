import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { ReactNode, useEffect } from "react";
import useAuthStore from "../store/authStore";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, initAuthListener, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(tabs)";
    const inAuth = segments[0] === "(auth)";

    if (isAuthenticated && !inApp) {
      router.replace("/home");
    } else if (isAuthenticated === false && !inAuth) {
      router.replace("/welcome");
    }
  }, [isAuthenticated]);

  return <View style={{ flex: 1 }}>{children}</View>;
};

const RootLayout = () => {
  return (
    <MainLayout>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/profileModal"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/walletModal"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </MainLayout>
  );
};

export default RootLayout;
